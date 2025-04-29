import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy.engine import URL # URLオブジェクトを使う場合
from dotenv import load_dotenv
from pydantic_settings import BaseSettings # pydantic-settings を使う場合

# .env ファイルを読み込む
load_dotenv()

# --- 設定クラス (pydantic-settings を使う場合、より推奨) ---
# class Settings(BaseSettings):
#     database_url: str = "mysql+mysqlconnector://user:password@db:3306/syncfam_db"
#     # 他の設定値 ...
#     class Config:
#         env_file = '.env' # .env ファイルの場所
# settings = Settings()
# DATABASE_URL = settings.database_url

# --- 環境変数から直接読み込む場合 ---
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set")

# SQLAlchemy エンジンを作成
engine = create_engine(DATABASE_URL, echo=True) # echo=True でSQLログ出力

# セッションファクトリ
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルのベースクラス
Base = declarative_base()

# DBセッション取得用の依存性関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
