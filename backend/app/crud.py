from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

import models
import schemas


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
    # UUID を文字列に変換してクエリに使用
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
        .options(
            joinedload(models.Task.labels)  # JOIN でラベルも一緒に取得
            # selectinload(models.Task.labels) # 別クエリで効率的に取得
        )
        .where(models.Task.id == task_id)
    )
    return db.scalars(stmt).first()


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
        setattr(db_task, key, value)  # db_task.name = value のように属性を設定

    # 4. ラベルの関連を更新 (既存をクリアして新しいものを追加)
    db_task.labels.clear()  # 既存の関連をクリア
    db_task.labels.extend(db_labels)  # 新しい関連を追加

    # 5. DB にコミットして更新を反映
    db.add(db_task)  # セッションに変更を通知 (必須ではない場合もある)
    db.commit()
    db.refresh(db_task)  # 更新後の状態を再読み込み
    return db_task


# def delete_task(...)

# --- User CRUD (後で実装) ---
# def get_user(...)
# def create_user(...)
