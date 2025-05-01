# SyncFam バックエンド API

## 開発環境のセットアップ

1.  **Docker Desktop** をインストール・起動します。
2.  プロジェクトルートに `.env` ファイルを作成し、必要な環境変数（データベース接続情報など）を設定します。`.env.example` ファイルがあれば参考にしてください。（`.env` ファイルは Git 管理下に含めないでください）
3.  以下のコマンドで Docker コンテナをビルド・起動します。
    ```bash
    docker compose up --build -d
    ```
4.  FastAPI アプリケーションは `http://localhost:8000` でアクセス可能になります。
5.  API ドキュメント (Swagger UI) は `http://localhost:8000/docs` で確認できます。
6.  データベースにはホストから `localhost:3307` で接続できます（ユーザー名/パスワードは `.env` を参照）。

## データベースの確認 (Docker コンテナ内)

開発中にコンテナ内の MySQL データベースの状態を確認するには、以下の手順を実行します。

1.  **コンテナが起動していることを確認:**

    ```bash
    docker compose ps
    ```

    (`syncfam_db` コンテナが running/healthy であること)

2.  **MySQL クライアントで接続:**
    ターミナルでプロジェクトルート (`backend`) に移動し、以下のコマンドを実行します。（ユーザー名、パスワード、DB 名は `.env` ファイルの値に合わせてください）

    ```bash
    docker compose exec db mysql -u devuser -pdevpassword syncfam_db
    ```

    - **注意:** `-p` とパスワードの間にスペースは入れません。

3.  **SQL コマンドを実行:**
    `mysql>` プロンプトが表示されたら、SQL コマンドでデータを確認できます。
    - テーブル一覧: `SHOW TABLES;`
    - テーブル構造 (例: tasks): `DESCRIBE tasks;`
    - データ表示 (例: tasks): `SELECT * FROM tasks;`
    - 終了: `exit;`

## データベースマイグレーション (Alembic)

データベースのスキーマ（テーブル定義など）の変更は Alembic を使って管理します。SQLAlchemy モデル (`app/models.py`) を変更した場合、以下の手順でマイグレーションを実行します。

**前提:** Docker コンテナが起動していること (`docker compose up -d`)。

1.  **SQLAlchemy モデルの変更:**

    - `app/models.py` ファイルを編集して、テーブルやカラムの定義を変更します。

2.  **マイグレーションスクリプトの自動生成:**

    - ターミナルでプロジェクトルート (`backend`) に移動します。
    - 以下のコマンドを実行して、モデルと現在のデータベーススキーマの差分からマイグレーションスクリプトを自動生成します。
      ```bash
      docker compose exec app alembic revision --autogenerate -m "変更内容の簡潔な説明"
      ```
      - 例: `docker compose exec app alembic revision --autogenerate -m "Add email column to users table"`
      - `-m` の後のメッセージは、どのような変更か分かりやすいように記述してください。

3.  **生成されたスクリプトの確認:**

    - `migrations/versions/` ディレクトリに新しい Python ファイル (`xxxxxxxxxxxx_変更内容の簡潔な説明.py`) が生成されます。
    - このファイルを開き、`upgrade()` 関数と `downgrade()` 関数の内容が意図したスキーマ変更（`op.create_table`, `op.add_column`, `op.drop_column` など）になっているか**必ず確認・修正**してください。`--autogenerate` が全ての変更を完璧に検出できるわけではありません（特に制約の変更など）。

4.  **マイグレーションの適用:**
    - 生成されたスクリプトに問題がなければ、以下のコマンドを実行してデータベーススキーマに実際の変更を適用します。
      ```bash
      docker compose exec app alembic upgrade head
      ```
      - `head` は最新のリビジョンまで適用することを意味します。特定のバージョンまで適用したい場合はリビジョン ID を指定します。

**その他の Alembic コマンド (参考):**

- **現在のリビジョン確認:**
  ```bash
  docker compose exec app alembic current
  ```
- **マイグレーション履歴確認:**
  ```bash
  docker compose exec app alembic history
  ```
- **一つ前のリビジョンに戻す (ロールバック):**
  ```bash
  docker compose exec app alembic downgrade -1
  ```
  (事前に `downgrade()` 関数が正しく実装されていることを確認してください)

## Linter と Formatter

コードの品質と一貫性を保つために、以下のツールを使用します。コミット前に実行することを推奨します。
設定ファイル (`pyproject.toml`, `.flake8`) で、自動生成されるマイグレーションスクリプト (`migrations/versions/`) はチェック対象から除外されています。

- **Formatter (`black`, `isort`):** コードのスタイルを自動で整形します。

  ```bash
  # isort で import 文をソート (app ディレクトリ以下を対象)
  isort app/
  # black でコード全体をフォーマット (app ディレクトリ以下を対象)
  black app/
  ```

  または、Docker コンテナ内で実行する場合 (プロジェクト全体にかける例):

  ```bash
  docker compose exec app isort .
  docker compose exec app black .
  ```

- **Linter (`flake8`):** スタイルガイド違反や簡単なエラーをチェックします。

  ```bash
  flake8 app/ # app ディレクトリ以下を対象
  ```

  または、Docker コンテナ内で実行する場合 (プロジェクト全体にかける例):

  ```bash
  docker compose exec app flake8 .
  ```

- **Type Checker (`mypy`):** 静的な型チェックを行います。

  ```bash
  mypy app/ # app ディレクトリ以下を対象
  ```

  または、Docker コンテナ内で実行する場合 (プロジェクト全体にかける例):

  ```bash
  docker compose exec app mypy .
  ```

- **すべて実行 (app ディレクトリ以下):**
  ```bash
  isort app/ && black app/ && flake8 app/ && mypy app/
  ```
  または、Docker コンテナ内で (プロジェクト全体):
  ```bash
  docker compose exec app sh -c "isort . && black . && flake8 . && mypy ."
  ```

**(任意) pre-commit フックの設定:**
Git コミット時に自動的にこれらのチェックを実行させるために、`pre-commit` を設定することも推奨されます。（設定方法は省略）
