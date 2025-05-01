import os
import sys

from alembic import context
from sqlalchemy import create_engine, pool

# env.py は /app/migrations にあるので、/app をパスに追加する
app_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)
# print("sys.path:", sys.path) # デバッグ用

# ★★★ app.models のインポートを試みる ★★★
try:
    # models.py が /app/app/models.py にある場合は from app.app.models import Base
    from app.models import Base  # /app/models.py を想定

    target_metadata = Base.metadata
    print("Successfully imported Base from app.models")  # 成功ログ
except ImportError as e:
    print(
        f"Error: Could not import Base from app.models. "
        f"sys.path: {sys.path}"
    )
    print(f"ImportError: {e}")
    target_metadata = None


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config


# DATABASE_URL を環境変数から取得して設定
db_url = os.getenv("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)
else:
    print(
        "Warning: DATABASE_URL environment variable not found. "
        "Using alembic.ini default."
    )


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # alembic.ini の設定を使って Engine を作成
    # url を明示的に渡すように変更
    connectable_url = config.get_main_option("sqlalchemy.url")
    if not connectable_url:
        raise ValueError(
            "Database URL not set in alembic.ini or DATABASE_URL env var."
        )

    connectable = create_engine(connectable_url, poolclass=pool.NullPool)
    # connectable = engine_from_config(
    #     config.get_section(config.config_ini_section, {}),
    #     prefix="sqlalchemy.",
    #     poolclass=pool.NullPool,
    #     url=connectable_url # url を明示的に渡す
    # )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

print("env.py finished.")  # 終了ログ
