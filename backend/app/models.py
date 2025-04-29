from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, JSON # JSON 型を追加
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import CHAR # UUID 用
from sqlalchemy.sql import func # デフォルトタイムスタンプ用
import uuid # UUID 生成用

from .database import Base # database.py で定義した Base をインポート

# データベースのテーブル構造をPythonクラスとして定義
# Task テーブルに対応するモデル
class Task(Base):
    __tablename__ = "tasks" # テーブル名

    # カラム定義
    # id: UUID 型を CHAR(36) で表現 (MySQL の場合)
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, index=True) # index=True で検索を高速化
    assigneeId = Column(CHAR(36), nullable=True, index=True) # 外部キー制約は後で User モデルと紐付ける
    dueDate = Column(DateTime, nullable=True) # SQLAlchemy では Date 型もあるが DateTime が汎用的
    isCompleted = Column(Boolean, default=False, nullable=False, index=True)
    # labels: 文字列の配列は JSON 型または TEXT 型 (カンマ区切り) で保存
    # MySQL 5.7+ なら JSON 型が使える
    labels = Column(JSON, nullable=False, default=[]) # デフォルトを空配列に
    # labels = Column(Text, nullable=False, default='') # TEXT 型の場合
    isRecurring = Column(Boolean, default=False, nullable=False, index=True)
    recurrenceRule = Column(String(100), nullable=True) # ルール文字列を保存

    # タイムスタンプ (デフォルト値と自動更新)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # --- リレーションシップ (後で User モデルと紐付ける) ---
    # owner = relationship("User", back_populates="tasks") # 仮

    def __repr__(self):
        return f"<Task(id={self.id}, name='{self.name}')>"

# --- User テーブルに対応するモデル (後で定義) ---
# class User(Base):
#     __tablename__ = "users"
#     id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
#     name = Column(String(100), nullable=False)
#     email = Column(String(255), unique=True, index=True, nullable=True) # 例
#     # hashed_password = Column(String(255)) # パスワードハッシュ
#     createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
#     updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
#
#     # tasks = relationship("Task", back_populates="owner") # Task モデルとのリレーション

