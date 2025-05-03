from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import ColumnElement, and_, case
from sqlalchemy import func as sql_func
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

import models
import schemas


# --- ヘルパー関数 ---
def get_labels_by_ids(
    db: Session, label_ids: List[UUID]
) -> List[models.Label]:
    """
    指定された ID のリストに一致する Label オブジェクトのリストを取得する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        label_ids: 取得したいラベルの UUID のリスト。

    Returns:
        models.Label オブジェクトのリスト。ID が見つからない場合は空リスト。
    """
    if not label_ids:
        return []
    label_id_strs = [str(label_id) for label_id in label_ids]
    stmt = select(models.Label).where(models.Label.id.in_(label_id_strs))
    return list(db.scalars(stmt).all())


def get_task(db: Session, task_id: str) -> models.Task | None:
    """
    指定された ID のタスクを、関連ラベルも含めて取得する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        task_id: 取得するタスクの UUID 文字列。

    Returns:
        models.Task オブジェクト、または見つからない場合は None。
    """
    # labels リレーションシップを Eager Loading する (joinedload または selectinload)
    stmt = (
        select(models.Task)
        .options(selectinload(models.Task.labels))
        .where(models.Task.id == task_id)
    )
    return db.scalars(stmt).first()


# get_tasks 用のヘルパー関数 (フィルター条件構築)
def _build_task_filter_conditions(
    assignee_id: Optional[str],
    is_completed: Optional[bool],
    labels: Optional[List[str]],
    current_user_id: Optional[str],
) -> List[ColumnElement[bool]]:  # SQLAlchemy の条件式のリストを返す
    """タスク一覧取得用のフィルター条件リストを構築する。"""
    filter_conditions: List[ColumnElement[bool]] = []
    # 通常タスクのみを対象とする
    filter_conditions.append(models.Task.isRecurring == 0)

    # 担当者フィルター
    effective_assignee_id: Optional[str] = None
    if assignee_id == "me" and current_user_id:
        effective_assignee_id = current_user_id
    elif assignee_id and assignee_id != "me":
        try:
            UUID(assignee_id, version=4)
            effective_assignee_id = assignee_id
        except ValueError:
            print(
                f"Warning: Invalid assigneeId format in filter: {assignee_id}"
            )

    if effective_assignee_id is not None:
        filter_conditions.append(
            models.Task.assigneeId == effective_assignee_id
        )

    # 完了状態フィルター
    if is_completed is not None:
        filter_conditions.append(
            models.Task.isCompleted == (1 if is_completed else 0)
        )

    # ラベルフィルター (AND 条件)
    if labels:
        label_conditions = [
            models.Task.labels.any(models.Label.name == label_name)
            for label_name in labels
        ]
        if label_conditions:
            filter_conditions.append(and_(*label_conditions))
    return filter_conditions


# get_tasks 用のヘルパー関数 (ソート条件構築)
def _build_task_order_by_clause(sort: str) -> Optional[ColumnElement]:
    """タスク一覧取得用のソート条件式を構築する。"""
    order_by_clauses: List[ColumnElement] = []
    if sort == "dueDate_asc":
        order_by_clauses.append(
            case((models.Task.dueDate.is_(None), 1), else_=0).asc()
        )
        order_by_clauses.append(models.Task.dueDate.asc())
    elif sort == "dueDate_desc":
        order_by_clauses.append(
            case((models.Task.dueDate.is_(None), 1), else_=0).asc()
        )
        order_by_clauses.append(models.Task.dueDate.desc())
    elif sort == "createdAt_asc":
        order_by_clauses.append(models.Task.createdAt.asc())
    elif sort == "createdAt_desc":  # デフォルト含む
        order_by_clauses.append(models.Task.createdAt.desc())
    order_by_clauses.append(models.Task.id.asc())
    return order_by_clauses if order_by_clauses else None


# --- Label CRUD ---
def get_label_by_name(db: Session, name: str) -> models.Label | None:
    """
    指定された名前のラベルを取得する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        name: 検索するラベル名。

    Returns:
        models.Label オブジェクト、または見つからない場合は None。
    """
    stmt = select(models.Label).where(models.Label.name == name)
    return db.scalars(stmt).first()


def get_labels(
    db: Session, skip: int = 0, limit: int = 100
) -> list[models.Label]:
    """
    ラベルの一覧を取得する (ページネーション対応)。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        skip: スキップするレコード数。
        limit: 取得する最大レコード数。

    Returns:
        models.Label オブジェクトのリスト。
    """
    stmt = (
        select(models.Label)
        .offset(skip)
        .limit(limit)
        .order_by(models.Label.name)
    )  # 名前順でソート
    return list(db.scalars(stmt).all())


def create_label(db: Session, label: schemas.LabelCreate) -> models.Label:
    """
    新しいラベルを作成する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        label: 作成するラベルの情報 (Pydantic スキーマ)。

    Returns:
        作成された models.Label オブジェクト。
    """
    # Pydantic モデルから SQLAlchemy モデルのインスタンスを作成
    db_label = models.Label(**label.model_dump())
    db.add(db_label)
    db.commit()  # データベースに変更をコミット
    db.refresh(db_label)  # 作成されたオブジェクト (IDなど) を再読み込み
    return db_label


# --- Task CRUD ---
def create_task(
    db: Session, task_data: schemas.TaskCreateApiInput
) -> models.Task:
    """
    新しいタスクを作成し、指定されたラベルを紐付ける。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        task_data: 作成するタスクの情報 (Pydantic スキーマ、label_ids を含む)。

    Returns:
        作成された models.Task オブジェクト (紐付けられたラベル情報を含む)。

    Raises:
        ValueError: 指定された label_id が存在しない場合に発生。
    """
    # 1. 紐付ける Label オブジェクトを取得
    db_labels = get_labels_by_ids(db, task_data.label_ids)
    # 指定された ID のラベルがすべて見つかったか検証
    if len(db_labels) != len(task_data.label_ids):
        found_ids = {str(label.id) for label in db_labels}
        missing_ids = [
            str(id) for id in task_data.label_ids if str(id) not in found_ids
        ]
        raise ValueError(
            f"Labels not found with IDs: {', '.join(map(str, missing_ids))}"
        )

    # 2. Task オブジェクトを作成 (labels を除く)
    #    Pydantic スキーマから SQLAlchemy モデルへの変換
    #    task_data.model_dump() を使うが、label_ids は除外する
    task_dict = task_data.model_dump(exclude={"label_ids"})
    if task_dict.get("assigneeId") is not None:
        task_dict["assigneeId"] = str(task_dict["assigneeId"])
    db_task = models.Task(**task_dict)

    # 3. 取得した Label オブジェクトを Task の labels リレーションシップに追加
    db_task.labels.extend(db_labels)

    # 4. DB に追加してコミット
    db.add(db_task)
    db.commit()
    db.refresh(db_task)  # リレーションシップを含めて最新の状態を取得
    return db_task


def update_task(
    db: Session, task_id: str, task_data: schemas.TaskUpdateApiInput
) -> models.Task | None:
    """
    指定された ID のタスクを更新し、ラベルの紐付けも更新する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        task_id: 更新するタスクの UUID 文字列。
        task_data: 更新後のタスク情報 (Pydantic スキーマ、label_ids を含む)。

    Returns:
        更新された models.Task オブジェクト、またはタスクが見つからない場合は None。

    Raises:
        ValueError: 指定された label_id が存在しない場合に発生。
    """
    # 1. 更新対象のタスクを取得
    db_task = get_task(db, task_id)
    if not db_task:
        return None  # タスクが見つからない

    # 2. 紐付ける新しい Label オブジェクトを取得
    db_labels = get_labels_by_ids(db, task_data.label_ids)
    if len(db_labels) != len(task_data.label_ids):
        found_ids = {str(label.id) for label in db_labels}
        missing_ids = [
            str(id) for id in task_data.label_ids if str(id) not in found_ids
        ]
        raise ValueError(
            f"Labels not found with IDs: {', '.join(missing_ids)}"
        )

    # 3. タスクの各フィールドを更新
    #    Pydantic モデルのフィールドをループして更新
    update_data = task_data.model_dump(
        exclude={"label_ids"}, exclude_unset=True
    )  # 未設定の項目は除外しない (PUT なので)
    for key, value in update_data.items():
        if key == "assigneeId" and value is not None:
            setattr(db_task, key, str(value))
        else:
            setattr(db_task, key, value)

    # 4. ラベルの関連を更新 (既存をクリアして新しいものを追加)
    db_task.labels.clear()  # 既存の関連をクリア
    db_task.labels.extend(db_labels)  # 新しい関連を追加

    # 5. DB にコミットして更新を反映
    db.add(db_task)  # セッションに変更を通知 (必須ではない場合もある)
    db.commit()
    db.refresh(db_task)  # 更新後の状態を再読み込み
    return db_task


def get_tasks(
    db: Session,
    assignee_id: Optional[str] = None,
    is_completed: Optional[bool] = None,
    labels: Optional[List[str]] = None,
    sort: str = "createdAt_desc",
    page: int = 1,
    limit: int = 10,
    current_user_id: Optional[str] = None,
) -> Tuple[List[models.Task], int]:
    """
    タスク一覧を取得します (フィルター/ソート/ページネーション対応)。
    今日の定常タスクと、フィルター/ソート/ページネーションされた通常タスクを返します。

    Args:
        db: DBセッション
        assignee_id: 担当者IDフィルター ('me' または UUID)
        is_completed: 完了状態フィルター
        labels: ラベル名フィルター (指定されたラベルをすべて含むタスク)
        sort: ソート順
        page: ページ番号
        limit: 1ページあたりの件数
        current_user_id: assigneeId='me' の場合に使う現在のユーザーID

    Returns:
        タプル: (表示するタスクのリスト, フィルター条件に合う通常タスクの総数)
    """
    # --- 1. 今日の定常タスクを取得 ---
    # (実際のバックエンドでは recurrenceRule を解釈して判定)
    # モックと同様に isRecurring=true のものを取得
    # TODO: 担当者フィルターも定常タスクに適用するか検討
    routine_stmt = (
        select(models.Task)
        .options(selectinload(models.Task.labels))
        .where(models.Task.isRecurring == 1)
    )
    todays_routines = list(db.scalars(routine_stmt).all())

    # --- 2. 通常タスクのフィルター条件を構築 ---
    filter_conditions = _build_task_filter_conditions(
        assignee_id, is_completed, labels, current_user_id
    )

    # --- 3. 通常タスクの総数をカウント ---
    count_query = select(sql_func.count(models.Task.id)).select_from(
        models.Task
    )
    if filter_conditions:
        count_query = count_query.where(and_(*filter_conditions))
    total_items = db.scalar(count_query) or 0

    # --- 4. 通常タスク取得クエリを構築 ---
    regular_task_query = select(models.Task).options(
        selectinload(models.Task.labels)  # Eager load labels
    )
    if filter_conditions:
        regular_task_query = regular_task_query.where(and_(*filter_conditions))

    # ソート条件を構築して適用
    order_by_clauses = _build_task_order_by_clause(sort)
    if order_by_clauses is not None:
        regular_task_query = regular_task_query.order_by(*order_by_clauses)

    # ページネーションを適用
    offset = (page - 1) * limit
    regular_task_query = regular_task_query.offset(offset).limit(limit)

    # --- 5. 通常タスクを取得 ---
    paginated_regular_tasks = list(db.scalars(regular_task_query).all())

    # --- 6. 結果を結合して返す ---
    result_tasks = todays_routines + paginated_regular_tasks
    return result_tasks, total_items


def delete_task(db: Session, task_id: str) -> bool:
    """
    指定された ID のタスクを削除する。

    Args:
        db: SQLAlchemy セッションオブジェクト。
        task_id: 削除するタスクの UUID 文字列。

    Returns:
        削除が成功した場合は True、タスクが見つからなかった場合は False。
    """
    task_to_delete = db.scalar(
        select(models.Task).where(
            models.Task.id == task_id, models.Task.isRecurring == 0
        )
    )

    if task_to_delete:
        db.delete(task_to_delete)
        db.commit()
        return True
    else:
        return False


# --- User CRUD (後で実装) ---
# def get_user(...)
# def create_user(...)
