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
        # crud.create_task 関数を呼び出し
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
