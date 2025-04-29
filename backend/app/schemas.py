from pydantic import BaseModel, Field, UUID4
from typing import List, Optional
from datetime import date, datetime

# APIのリクエストボディやレスポンスで使うデータの形状を定義。OpenAPI仕様と密接。
# --- Task Schemas ---

# ベースとなる Task スキーマ (共通フィールド)
class TaskBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="タスク名")
    assigneeId: Optional[UUID4] = Field(None, description="担当者のユーザーID")
    dueDate: Optional[date] = Field(None, description="期限日 (YYYY-MM-DD)")
    isCompleted: bool = Field(False, description="完了状態フラグ")
    labels: List[str] = Field(..., description="ラベルの配列 (必須、最低1つ)", min_length=1) # OpenAPI に合わせて min_length を追加

    # Pydantic モデルを ORM モデルと連携させるための設定
    # SQLAlchemy 2.0+ では from_attributes=True が推奨される
    class Config:
        from_attributes = True # SQLAlchemyモデルインスタンスからPydanticモデルを作成可能にする

# API から読み取る Task スキーマ (DB モデルに対応)
class Task(TaskBase):
    id: UUID4 = Field(..., description="タスクの一意なID")
    isRecurring: bool = Field(..., description="定常タスクフラグ")
    recurrenceRule: Optional[str] = Field(None, description="繰り返しルール")
    createdAt: datetime = Field(..., description="作成日時")
    updatedAt: datetime = Field(..., description="更新日時")

# タスク作成時のリクエストボディ用スキーマ (CreateTaskInput)
class TaskCreate(TaskBase):
    # isCompleted は作成時には False 固定なので含めないことが多い
    # labels は TaskBase で必須になっている
    pass

# タスク更新時のリクエストボディ用スキーマ (PutTaskInput)
# PUT なので isCompleted も必須
class TaskUpdate(TaskBase):
    # labels は TaskBase で必須になっている
    pass

# --- Pagination Schemas (OpenAPI に合わせて定義) ---
class PaginationMeta(BaseModel):
    totalItems: int
    totalPages: int
    currentPage: int
    limit: int

class PaginatedTasksResponse(BaseModel):
    data: List[Task] # Task スキーマのリスト
    meta: PaginationMeta

# --- User Schemas (後で定義) ---
# class UserBase(BaseModel):
#     name: str
#     # email: Optional[str] = None

# class UserCreate(UserBase):
#     pass

# class User(UserBase):
#     id: UUID4
#     createdAt: datetime
#     updatedAt: datetime

#     class Config:
#         from_attributes = True

