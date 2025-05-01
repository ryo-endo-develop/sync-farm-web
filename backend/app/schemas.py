from datetime import date, datetime
from typing import List, Optional

from pydantic import UUID4, BaseModel, Field

# APIのリクエストボディやレスポンスで使うデータの形状を定義。OpenAPI仕様と密接。


# --- Label Schemas ---
class LabelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color: Optional[str] = Field(
        None,
        description="HEXカラーコードなど",
        json_schema_extra={"example": "#4A90E2"},
    )


# API の LabelCreateInput に対応


class LabelCreate(LabelBase):
    pass


# API の LabelUpdateInput に対応


class LabelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = None


# API の Label レスポンスに対応


class Label(LabelBase):
    id: UUID4
    # createdAt, updatedAt は含めない (OpenAPI 仕様に合わせる)

    class Config:
        from_attributes = True


# --- Task Schemas ---


# ベースとなる Task スキーマ (共通フィールド)
class TaskBase(BaseModel):
    name: str = Field(
        ..., min_length=1, max_length=100, description="タスク名"
    )
    assigneeId: Optional[UUID4] = Field(None, description="担当者のユーザーID")
    dueDate: Optional[date] = Field(None, description="期限日 (YYYY-MM-DD)")

    # Pydantic モデルを ORM モデルと連携させるための設定
    # SQLAlchemy 2.0+ では from_attributes=True が推奨される
    class Config:
        from_attributes = True  # SQLAlchemyモデルインスタンスからPydanticモデルを作成可能にする


# TaskCreate (API の CreateTaskInput に対応)
class TaskCreateApiInput(TaskBase):
    label_ids: List[UUID4] = Field(
        ..., description="紐付けるラベルのID配列", min_length=1
    )


# TaskUpdate (API の PutTaskInput に対応)
class TaskUpdateApiInput(TaskBase):
    isCompleted: bool  # PUT では必須
    label_ids: List[UUID4] = Field(
        ..., description="更新後のラベルID配列", min_length=1
    )


# API から読み取る Task スキーマ (DB モデルに対応)
class Task(TaskBase):
    id: UUID4
    isCompleted: bool
    labels: List[Label] = []
    isRecurring: bool
    recurrenceRule: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


# --- Pagination Schemas (OpenAPI に合わせて定義) ---
class PaginationMeta(BaseModel):
    totalItems: int
    totalPages: int
    currentPage: int
    limit: int


class PaginatedTasksResponse(BaseModel):
    data: List[Task]  # Task スキーマのリスト
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
