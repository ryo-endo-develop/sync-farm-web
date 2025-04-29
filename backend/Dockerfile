# ベースイメージとして公式の Python イメージを使用
FROM python:3.11-slim

# 環境変数設定
ENV PYTHONDONTWRITEBYTECODE 1 # .pyc ファイルを作成しない
ENV PYTHONUNBUFFERED 1      # Python の出力バッファリングを無効化 (ログ確認しやすく)

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
# requirements.txt を先にコピーしてインストールすることで、
# アプリケーションコードの変更時に毎回インストールし直すのを防ぐ (Docker キャッシュ活用)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY ./app /app

# uvicorn サーバーを実行
# ポート 80 を公開 (docker-compose.yml でホストとマッピング)
# --host 0.0.0.0 でコンテナ外部からのアクセスを許可
# --reload は開発時のみ有効 (本番では外す)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
