import uuid
from typing import Self

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Table
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base  # database.py で定義した Base をインポート

# --- 中間テーブル (task_labels) の定義 ---
task_labels_table = Table(
    "task_labels",  # テーブル名
    Base.metadata,
    Column(
        "task_id",
        CHAR(36),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "label_id",
        CHAR(36),
        ForeignKey("labels.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    # ondelete="CASCADE" はタスクやラベルが削除されたら関連も削除する設定 (任意)
)


# --- Label テーブルに対応するモデル ---
class Label(Base):
    __tablename__ = "labels"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(
        String(50), nullable=False, unique=True, index=True
    )  # ラベル名はユニーク制約
    color = Column(String(7), nullable=True)  # HEXカラーコード想定 (#RRGGBB)
    createdAt = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updatedAt = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Task モデルとのリレーションシップ (Task モデル側で back_populates)
    tasks = relationship(
        "Task",
        secondary=task_labels_table,
        back_populates="labels",  # Task モデル側の 'labels' 属性と紐付け
    )

    def __repr__(self: Self) -> str:
        return f"<Label(id={self.id}, name='{self.name}')>"


# --- Task テーブルに対応するモデル ---
class Task(Base):
    __tablename__ = "tasks"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, index=True)
    assigneeId = Column(CHAR(36), nullable=True, index=True)
    dueDate = Column(DateTime, nullable=True)
    isCompleted = Column(Boolean, default=False, nullable=False, index=True)
    isRecurring = Column(Boolean, default=False, nullable=False, index=True)
    recurrenceRule = Column(String(100), nullable=True)
    createdAt = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updatedAt = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ★★★ Label モデルとの Many-to-Many リレーションシップを設定 ★★★
    labels = relationship(
        "Label",  # 関連付けるモデルクラス名
        secondary=task_labels_table,  # 中間テーブルを指定
        back_populates="tasks",  # Label モデル側のリレーションシップ名 (Label モデル側で定義する場合)
        lazy="selectin",  # ★ N+1 問題を避けるためのロード戦略 (推奨)
        # lazy="joined" も選択肢だが、常に JOIN するため状況による
    )

    # --- User モデルとのリレーションシップ (後で User モデル側で back_populates) ---
    # assignee = relationship("User", back_populates="assigned_tasks") # 例

    def __repr__(self: Self) -> str:
        return f"<Task(id={self.id}, name='{self.name}')>"


# --- User テーブルに対応するモデル (後で定義) ---
