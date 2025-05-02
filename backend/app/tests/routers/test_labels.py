from fastapi import status
from fastapi.testclient import TestClient


def test_create_label_success(client: TestClient):
    """POST /labels: 新規ラベル作成が成功するケース"""
    # Arrange: テストに必要なデータや状態を準備
    label_data = {"name": "テストラベル1", "color": "#FF0000"}

    # Act: テスト対象の処理（APIコールなど）を実行
    response = client.post("/api/v1/labels", json=label_data)

    # Assert: 実行結果が期待通りか検証
    assert (
        response.status_code == status.HTTP_201_CREATED
    )  # ステータスコード 201 を確認
    data = response.json()
    assert data["name"] == label_data["name"]
    assert data["color"] == label_data["color"]
    assert "id" in data  # id が含まれていることを確認
    # createdAt, updatedAt はレスポンスに含まれない想定 (schemas.Label に基づく)


def test_create_label_duplicate_name(client: TestClient):
    """POST /labels: 同じ名前のラベルを再度作成しようとするとエラーになるケース"""
    # Arrange: 事前に同じ名前のラベルを作成しておく
    existing_label_name = "重複テスト AAA"
    client.post(
        "/api/v1/labels",
        json={"name": existing_label_name, "color": "#00FF00"},
    )
    new_label_data = {"name": existing_label_name, "color": "#0000FF"}

    # Act: 同じ名前で再度 POST リクエストを実行
    response = client.post("/api/v1/labels", json=new_label_data)

    # Assert: 409 Conflict エラーが返ることを確認
    assert (
        response.status_code == status.HTTP_409_CONFLICT
    )  # ステータスコード 409 を確認
    data = response.json()
    assert "detail" in data
    assert "already exists" in data["detail"]  # エラーメッセージの内容を確認


def test_create_label_missing_name(client: TestClient):
    """POST /labels: 必須項目 name がない場合にエラーになるケース"""
    # Arrange: name を含まないデータを用意
    invalid_label_data = {"color": "#FFFFFF"}

    # Act: 不正なデータで POST リクエストを実行
    response = client.post("/api/v1/labels", json=invalid_label_data)

    # FastAPI/Pydantic がバリデーションエラー (422) を返す
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_read_labels_empty(client: TestClient):
    """GET /labels: ラベルがまだ作成されていない場合に空リストが返るケース"""
    # Arrange: 事前準備は不要 (db_session fixture がクリーンな状態を保証)

    # Act: GET リクエストを実行
    response = client.get("/api/v1/labels")

    # Assert: ステータスコード 200 と空リストが返ることを確認
    assert response.status_code == status.HTTP_200_OK
    # response.json() は List[schemas.Label] になるはず
    assert response.json() == []


def test_read_labels_after_creation(client: TestClient):
    """GET /labels: ラベル作成後にリストが取得できるケース"""
    # Arrange: 事前にいくつかのラベルを作成
    label1_data = {"name": "ラベルA", "color": "#AAAAAA"}
    label2_data = {"name": "ラベルB", "color": None}
    # 作成 API を呼び出す (Act の一部と見ることもできるが、ここでは Arrange とする)
    resp1 = client.post("/api/v1/labels", json=label1_data)
    resp2 = client.post("/api/v1/labels", json=label2_data)
    assert resp1.status_code == status.HTTP_201_CREATED  # Arrange の前提確認
    assert resp2.status_code == status.HTTP_201_CREATED

    # Act: GET リクエストを実行
    response = client.get("/api/v1/labels")

    # Assert: ステータスコード 200 と、作成したラベルを含むリストが返ることを確認
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2
    # 作成したデータが存在するかチェック (より厳密なチェック)
    assert any(
        item["name"] == label1_data["name"]
        and item["color"] == label1_data["color"]
        for item in data
    )
    assert any(
        item["name"] == label2_data["name"]
        and item["color"] == label2_data["color"]
        for item in data
    )
    # 各アイテムが id を持っているか確認
    for item in data:
        assert "id" in item


# --- (任意) 将来追加するテスト ---
# def test_update_label(...)
# def test_delete_label(...)
# def test_read_labels_pagination(...) # ページネーションを実装した場合
