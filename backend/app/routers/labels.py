from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import get_db

# ルーターインスタンスを作成
# prefix="/labels" と tags=["Labels"] は main.py で include_router する際に指定する方が一般的
router = APIRouter()


@router.post(
    "/labels",
    response_model=schemas.Label,  # レスポンスの型を Pydantic スキーマで指定
    status_code=status.HTTP_201_CREATED,  # 成功時のステータスコード
    summary="新規ラベル作成",
    tags=["Labels"],  # OpenAPI ドキュメント用のタグ
)
async def create_new_label(
    label: schemas.LabelCreate,  # リクエストボディを Pydantic スキーマで受け取る
    db: Session = Depends(get_db),  # DB セッションを依存性注入で取得
) -> schemas.Label:
    """
    新しいラベルを作成します。

    - **name**: 新しいラベル名 (必須)
    - **color**: ラベルの色 (任意、HEX形式など)

    既に同じ名前のラベルが存在する場合はエラー (409 Conflict) を返します。
    """
    db_label = crud.get_label_by_name(db, name=label.name)
    if db_label:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Label with name '{label.name}' already exists",
        )
    return crud.create_label(db=db, label=label)


@router.get(
    "/labels",
    response_model=List[schemas.Label],  # レスポンスは Label スキーマのリスト
    summary="ラベル一覧取得",
    tags=["Labels"],
)
async def read_labels(
    skip: int = 0,  # クエリパラメータ (デフォルト値付き)
    limit: int = 100,  # クエリパラメータ (デフォルト値付き)
    db: Session = Depends(get_db),
) -> List[models.Label]:
    """
    登録されているラベルの一覧を取得します。
    """
    db_labels = crud.get_labels(db, skip=skip, limit=limit)
    # SQLAlchemy モデルのリストを Pydantic モデルのリストに自動変換してくれる
    return db_labels
