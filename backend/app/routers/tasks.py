from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import get_db

# ルーターインスタンスを作成
router = APIRouter()


@router.post(
    "/tasks",
    response_model=schemas.Task,
    status_code=status.HTTP_201_CREATED,
    summary="新規通常タスク作成",
    tags=["Tasks"],
)
async def create_new_task(
    task_input: schemas.TaskCreateApiInput, db: Session = Depends(get_db)
) -> models.Task:
    """
    新しい通常のタスクを作成し、指定されたラベルを紐付けます。

    - **name**: タスク名 (必須)
    - **assigneeId**: 担当者ID (任意)
    - **dueDate**: 期限日 (任意)
    - **label_ids**: 紐付けるラベルのID配列 (必須、最低1つ)

    指定されたラベル ID が存在しない場合は 404 エラーを返します。
    """
    try:
        created_task = crud.create_task(db=db, task_data=task_input)
        # FastAPI が response_model に基づいて models.Task -> schemas.Task へ変換
        return created_task
    except ValueError as e:
        # crud.create_task で指定ラベルが見つからない場合に ValueError が発生
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
        )
    except Exception as e:
        # その他の予期せぬエラー
        print(f"Error creating task: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while creating the task.",
        )


@router.put(
    "/tasks/{task_id}",
    response_model=schemas.Task,
    summary="通常タスク更新 (全量)",
    tags=["Tasks"],
)
async def update_existing_task(
    task_id: str,
    task_input: schemas.TaskUpdateApiInput,
    db: Session = Depends(get_db),
) -> models.Task:
    """
    指定された ID の通常のタスク情報を、リクエストボディの内容で完全に上書きします。
    紐付けるラベルもリクエストボディの `label_ids` で指定されたものに置き換わります。

    - **task_id**: 更新対象タスクの UUID
    - **name**: タスク名 (必須)
    - **assigneeId**: 担当者ID (任意)
    - **dueDate**: 期限日 (任意)
    - **isCompleted**: 完了状態 (必須)
    - **label_ids**: 更新後のラベル ID 配列 (必須、最低1つ)

    タスクが見つからない場合は 404 エラー、指定されたラベル ID が
    存在しない場合は 404 エラーを返します。
    """
    # UUID 文字列として妥当か簡易チェック (FastAPIの機能でも可)
    try:
        UUID(task_id, version=4)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format",
        )

    try:
        updated_task = crud.update_task(
            db=db, task_id=task_id, task_data=task_input
        )
        if updated_task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task not found with id: {task_id}",
            )
        return updated_task
    except ValueError as e:
        # crud.update_task で指定ラベルが見つからない場合に発生
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
        )
    except Exception as e:
        print(f"Error updating task {task_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while updating the task.",
        )


@router.get(
    "/tasks",
    response_model=schemas.PaginatedTasksResponse,
    summary="タスク一覧取得 (通常 + 今日の定常タスク)",
    tags=["Tasks"],
)
async def read_tasks(
    # クエリパラメータを受け取る (OpenAPI定義に合わせる)
    assigneeId: Optional[str] = None,
    isCompleted: Optional[bool] = None,
    sort: str = "createdAt_desc",
    labels: Optional[str] = None,  # カンマ区切り文字列
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    # current_user: models.User = Depends(get_current_user) # ★ 認証実装後
) -> schemas.PaginatedTasksResponse:
    """
    指定されたフィルター、ソート、ページネーション条件に基づいてタスク一覧を取得します。
    このリストには、条件に一致する**通常のタスク**と、**今日の定常タスク**が含まれる場合があります。
    ページネーション情報(`meta`)は、通常のタスクのみを対象として計算される想定です。
    """
    # ★ ラベル文字列をリストに変換 (空の場合は None)
    label_list = (
        [label.strip() for label in labels.split(",")] if labels else None
    )

    # ★ current_user_id を取得 (認証が必要) - 今は仮で None
    current_user_id_placeholder = (
        "f0e9d8c7-b6a5-4321-fedc-ba9876543210" if assigneeId == "me" else None
    )

    if assigneeId == "me" and not current_user_id_placeholder:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for 'me' filter",
        )
    try:
        tasks_list, total_regular_tasks = crud.get_tasks(
            db=db,
            assignee_id=assigneeId,
            is_completed=isCompleted,
            labels=label_list,
            sort=sort,
            page=page,
            limit=limit,
            current_user_id=current_user_id_placeholder,
        )
    except Exception as e:
        # CRUD 層で予期せぬエラーが発生した場合
        print(f"Error fetching tasks: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tasks",
        )

    total_pages = (
        (total_regular_tasks + limit - 1) // limit if limit > 0 else 0
    )

    # レスポンスを構築
    response = schemas.PaginatedTasksResponse(
        data=tasks_list,  # FastAPI が models -> schemas に変換
        meta=schemas.PaginationMeta(
            totalItems=total_regular_tasks,
            totalPages=total_pages,
            currentPage=page,
            limit=limit,
        ),
    )
    return response


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,  # 成功時はボディなし
    summary="通常タスク削除",
    tags=["Tasks"],
)
async def delete_existing_task(
    task_id: str, db: Session = Depends(get_db)
) -> None:
    """
    指定された ID の通常のタスクを削除します。
    定常タスクの定義は削除されません。

    タスクが見つからない場合は 404 エラーを返します。
    """
    try:
        UUID(task_id, version=4)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format",
        )

    deleted = crud.delete_task(db=db, task_id=task_id)
    if not deleted:
        # crud.delete_task が False を返した場合 (見つからない or 定常タスク)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task not found with id: {task_id} or recurring task.",
        )
    # 成功時は None を返す (FastAPI が 204 を返す)
    return None
