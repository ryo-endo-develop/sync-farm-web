import os
import time
from typing import Any, Generator

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

from database import Base, get_db
from main import app

# .env ファイルからテスト用DB URLなどを読み込む
load_dotenv()

# --- テスト用のデータベース設定 ---
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("MYSQL_USER", "devuser")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "devpassword")
ROOT_PASSWORD = os.getenv("MYSQL_ROOT_PASSWORD", "devrootpassword")
TEST_DB_NAME = os.getenv("TEST_MYSQL_DATABASE", "syncfam_test_db")
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
if not TEST_DATABASE_URL:
    # Docker Compose 内で実行されることを想定し、デフォルトを設定
    # (docker-compose.yml の TEST_DATABASE_URL 設定と合わせる)
    TEST_DATABASE_URL = (
        "mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@"
        "{DB_HOST}:{DB_PORT}/{TEST_DB_NAME}"
    )
    print(
        f"Warning: TEST_DATABASE_URL not set,"
        f"using default: {TEST_DATABASE_URL}"
    )
SERVER_URL = (
    f"mysql+mysqlconnector://root:{ROOT_PASSWORD}@{DB_HOST}:{DB_PORT}/"
    f"mysql?charset=utf8mb4"
)

# テスト用 SQLAlchemy エンジンを作成
# connect_args は SQLite 用だが、他のDBでも必要になる場合がある
# poolclass=StaticPool は SQLite インメモリDB用
print(f"--- Creating engine for: {TEST_DATABASE_URL} ---")
try:
    engine = create_engine(TEST_DATABASE_URL, echo=False)
except ImportError as e:
    print(f"!!! Error: DB driver not installed? {e}")
    raise
except Exception as e:
    print(f"!!! Error creating SQLAlchemy engine: {e}")
    raise

# テスト用セッションファクトリ
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


# --- テスト用データベースセットアップ Fixture ---
@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    テストセッション全体で一度だけ実行され、テスト用DBのテーブルを作成・削除する。
    """
    # Docker Compose でテストDBが作成されている前提
    # もしここでDB自体を作成する場合は、さらに複雑な処理が必要
    print(
        f"""
            -Setting up test database: Creating tables on {TEST_DATABASE_URL}-
        """
    )
    setup_engine = None
    try:
        # --- 1. DBサーバーへの接続確認とテストDB作成 ---
        print(
            f"--- Connecting to server:"
            f"{SERVER_URL.replace(ROOT_PASSWORD, '****')} ---"
        )
        setup_engine = create_engine(SERVER_URL, echo=False)
        retry_count = 5
        while retry_count > 0:
            try:
                with setup_engine.connect() as connection:
                    # 既存のテストDBがあれば削除 (冪等性のため)
                    print(
                        f"--- Dropping test database (if exists):"
                        f"{TEST_DB_NAME} ---"
                    )
                    connection.execute(
                        text(f"DROP DATABASE IF EXISTS " f"{TEST_DB_NAME}")
                    )
                    # テストDBを作成
                    print(f"--- Creating test database: {TEST_DB_NAME} ---")
                    connection.execute(
                        text(
                            f"""
                            CREATE DATABASE {TEST_DB_NAME}
                            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
                        """
                        )
                    )
                    # テストユーザーに権限付与 (docker-compose で作成されたユーザー)
                    print(
                        f"--- Granting privileges to user '{DB_USER}' "
                        f"on '{TEST_DB_NAME}' ---"
                    )
                    connection.execute(
                        text(
                            f"""
                            GRANT ALL PRIVILEGES ON {TEST_DB_NAME}.*
                            TO '{DB_USER}'@'%'
                        """
                        )
                    )
                    connection.commit()
                print("--- Test database created and privileges granted ---")
                break
            except OperationalError as e:
                print("--- DB connection failed, retrying...")
                print(f"({retry_count} left)")
                print(f"Error: {e}")
                retry_count -= 1
                time.sleep(5)
        if retry_count == 0:
            pytest.fail(
                "--- Could not connect to DB server after multiple retries ---"
            )

        # --- 2. テストDBにテーブルを作成 ---
        print("--- Connecting to test database:")
        print(f"{TEST_DATABASE_URL.replace(DB_PASSWORD, '****')}")
        # engine は TEST_DATABASE_URL を使う
        print("--- Creating tables in test database... ---")
        Base.metadata.create_all(bind=engine)
        print("--- Test database tables created successfully ---")

        # --- 3. テストセッション実行 ---
        yield

        # --- 4. テスト終了後にテストDBを削除 ---
        print("--- Tearing down test database: Dropping database ---")
        with setup_engine.connect() as connection:
            connection.execute(text(f"DROP DATABASE IF EXISTS {TEST_DB_NAME}"))
            connection.commit()
        print("--- Test database tables dropped ---")

    except SQLAlchemyError as e:
        print(f"\n!!! SQLAlchemy Error during DB setup/teardown: {e} !!!")
        # エラーの詳細を表示 (スタックトレースなど)
        pytest.fail(f"SQLAlchemy Error: {e}", pytrace=True)
    except Exception as e:
        print(f"\n!!! Unexpected Error during DB setup/teardown: {e} !!!")
        pytest.fail(f"Unexpected Error: {e}", pytrace=True)
    finally:
        if setup_engine:
            setup_engine.dispose()  # セットアップ用エンジンの接続を閉じる


# --- テスト用 DB セッション Fixture ---
@pytest.fixture(scope="function")  # 各テスト関数ごとに実行
def db_session() -> Generator[Session, Any, None]:
    """
    各テスト関数に独立したDBセッションを提供する Fixture。
    テスト終了後にロールバックすることで、テスト間の影響を防ぐ。
    """
    connection = engine.connect()
    # トランザクションを開始
    transaction = connection.begin()
    # セッションを作成し、トランザクション内で実行するように設定
    session = TestingSessionLocal(bind=connection)

    try:
        yield session  # テスト関数にセッションを提供
    finally:
        print("--- DB Session Fixture: Rolling back transaction ---")
        # セッションをクローズ (トランザクションはまだアクティブ)
        session.close()
        # メインのトランザクションをロールバック
        # これにより、テスト関数内で行われた変更がすべて元に戻る
        transaction.rollback()
        # 接続をクローズ
        connection.close()
        print("--- DB Session Fixture: ", end="")
        print("Transaction rolled back and connection closed ---")


# --- FastAPI TestClient Fixture ---
@pytest.fixture(scope="function")  # モジュールごとに TestClient を作成
def client(db_session: Session) -> Generator[TestClient, Any, None]:
    """
    FastAPI TestClient を提供する Fixture。
    アプリケーションの get_db 依存性をテスト用セッションでオーバーライドする。
    """

    # get_db 依存性をオーバーライドする関数
    def override_get_db():
        try:
            yield db_session  # 上で定義したテスト用セッションを返す
        finally:
            # db_session のクローズは db_session fixture が行う
            pass

    # アプリケーションの依存性をオーバーライド
    app.dependency_overrides[get_db] = override_get_db

    # TestClient を作成して提供
    with TestClient(app) as test_client:
        yield test_client

    # テスト終了後にオーバーライドを元に戻す (通常は不要)
    # app.dependency_overrides.clear()
