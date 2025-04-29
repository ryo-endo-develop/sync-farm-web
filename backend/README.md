syncfam-backend/
├── app/ # FastAPI アプリケーションコード
│ ├── **init**.py
│ ├── main.py
│ ├── database.py # SQLAlchemy 設定
│ ├── models.py # SQLAlchemy モデル
│ └── schemas.py # Pydantic スキーマ
│ └── crud.py # (任意)
│ └── routers/ # (任意)
│ └── **init**.py
│ └── tasks.py
│ └── users.py
├── migrations/ # Alembic マイグレーションファイル
│ ├── versions/ # 自動生成されるマイグレーションスクリプト
│ ├── env.py # Alembic 環境設定 (DB 接続など)
│ └── script.py.mako # マイグレーションスクリプトのテンプレート
├── alembic.ini # Alembic 設定ファイル
├── Dockerfile # FastAPI アプリケーション用
├── docker-compose.yml # Docker Compose 設定ファイル
├── requirements.txt # Python 依存ライブラリ
└── .env # ★ 環境変数ファイル (Git 管理外)
└── .gitignore # Git 除外設定
