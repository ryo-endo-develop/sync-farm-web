from fastapi import FastAPI, Depends, HTTPException
from contextlib import asynccontextmanager
from typing import AsyncGenerator


# FastAPI アプリケーションインスタンスを作成
# app = FastAPI(lifespan=lifespan) # ライフサイクルイベントを使う場合
app = FastAPI(title="SyncFam API", version="1.0.0")

# --- ルーターのインクルード (後で使う) ---
# from .routers import tasks, users
# app.include_router(tasks.router, prefix="/api/v1", tags=["Tasks"])
# app.include_router(users.router, prefix="/api/v1", tags=["Members"]) # OpenAPI の tags と合わせる

# --- ヘルスチェックエンドポイント ---
@app.get("/api/v1/health", tags=["Meta"])
async def health_check():
    """
    アプリケーションの動作確認用エンドポイント。
    常に {"status": "OK"} を返す。
    """
    # TODO: 必要であればデータベース接続などもチェックする
    return {"status": "OK"}

# --- ルートパス (任意) ---
@app.get("/", include_in_schema=False) # OpenAPI ドキュメントには含めない
async def read_root():
    return {"message": "Welcome to SyncFam API!"}

# --- ここから下に他のエンドポイントやルーターを追加していく ---

