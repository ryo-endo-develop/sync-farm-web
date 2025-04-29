import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL
from dotenv import load_dotenv

# .env ファイルから環境変数を読み込む (任意)
load_dotenv()

# 環境変数からデータベース接続情報を取得
# docker-compose.yml で設定した DATABASE_URL を参照
# または個別の変数 (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME) を使う
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://user:password@db:3306/syncfam_db")

# SQLAlchemy エンジンを作成
# echo=True にすると実行される SQL がコンソールに出力される (開発時に便利)
engine = create_engine(DATABASE_URL, echo=True)

# セッションファクトリを作成
# autocommit=False, autoflush=False が標準的
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy モデルのベースクラスを作成
Base = declarative_base()

# --- DB セッションを取得するための依存性関数 ---
# FastAPI の Depends() で使用する
def get_db():
    """
    FastAPI の依存性として使用されるデータベースセッションジェネレータ。
    リクエストごとにセッションを作成し、終了時にクローズする。
    """
    db = SessionLocal()
    try:
        yield db # セッションをエンドポイント関数に提供
    finally:
        db.close() # リクエスト処理完了後にセッションをクローズ

# --- (任意) データベース初期化関数 ---
# アプリケーション起動時などにテーブルを作成する場合
# Liquibase を使う場合は不要になることが多い
# def init_db():
#     # ここで定義されたすべてのテーブルをデータベースに作成
#     # import models # models.py をインポートする必要がある
#     # Base.metadata.create_all(bind=engine)
#     print("Database tables created (if not exist).")
#     pass

