import os
import sys
from typing import Dict

from fastapi import FastAPI

from routers import labels, tasks
from fastapi.middleware.cors import CORSMiddleware

# プロジェクトルートをパスに追加
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
if APP_ROOT not in sys.path:
    sys.path.insert(0, APP_ROOT)

# FastAPI アプリケーションインスタンスを作成
app = FastAPI(title="SyncFam API", version="1.0.0")
# --- ★★★ CORS ミドルウェアの設定 ★★★ ---
#    フロントエンドのオリジン (開発環境) を許可する
#    本番環境では、実際のフロントエンドのドメインを許可する必要がある
origins = [
    "http://localhost:5173",  # Vite のデフォルト開発サーバーポート
    "http://127.0.0.1:5173",
    # 必要に応じて他のオリジンを追加 (例: デプロイ先のフロントエンド URL)
    # "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 許可するオリジンのリスト
    allow_credentials=True,  # クレデンシャル (Cookie など) を許可するかどうか
    allow_methods=["*"],  # 許可する HTTP メソッド (GET, POST, PUT, DELETE など)
    allow_headers=["*"],  # 許可する HTTP ヘッダー
)


# ルーターの設定
app.include_router(labels.router, prefix="/api/v1", tags=["Labels"])
app.include_router(tasks.router, prefix="/api/v1", tags=["Tasks"])


# --- ヘルスチェックエンドポイント ---
@app.get("/api/v1/health", tags=["Meta"])
async def health_check() -> Dict[str, str]:
    """
    アプリケーションの動作確認用エンドポイント。
    常に {"status": "OK"} を返す。
    """
    # TODO: 必要であればデータベース接続などもチェックする
    return {"status": "OK"}


# --- ルートパス (任意) ---
@app.get("/", include_in_schema=False)  # OpenAPI ドキュメントには含めない
async def read_root() -> Dict[str, str]:
    return {"message": "Welcome to SyncFam API!"}


# --- ここから下に他のエンドポイントやルーターを追加していく ---
