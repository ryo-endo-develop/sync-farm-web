from uuid import uuid4

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
import models
import schemas


# --- テストデータ準備用のヘルパー関数 ---
def create_test_label(
    db: Session, name: str, color: str | None = None
) -> models.Label:
    """テスト用のラベルを作成するヘルパー"""
    label_schema = schemas.LabelCreate(name=name, color=color)
    db_label = crud.get_label_by_name(db, name=name)
    if db_label:
        return db_label
    return crud.create_label(db=db, label=label_schema)


def create_test_task(
    db: Session, data: schemas.TaskCreateApiInput
) -> models.Task:
    """テスト用のタスクを作成するヘルパー"""
    try:
        crud.get_labels_by_ids(db, data.label_ids)
    except ValueError as e:
        pytest.fail(
            f"Prerequisite labels not found for test task creation:" f"{e}"
        )

    return crud.create_task(db=db, task_data=data)


# --- GET /tasks テスト ---
def test_read_tasks_empty(client: TestClient, db_session: Session):
    """GET /tasks: タスクが空の場合"""
    # Arrange (データがない状態)

    # Act
    response = client.get("/api/v1/tasks")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["data"] == []
    assert data["meta"]["totalItems"] == 0
    assert data["meta"]["currentPage"] == 1


def test_read_tasks_pagination(client: TestClient, db_session: Session):
    """GET /tasks: ページネーションが機能するか"""
    # Arrange: 複数のタスクを作成 (例: 15件)
    label = create_test_label(db=db_session, name="Paging Label")
    created_tasks_models = []
    for i in range(15):
        task_data = schemas.TaskCreateApiInput(
            name=f"Paging Task {i+1}", label_ids=[label.id]
        )
        task = create_test_task(db=db_session, data=task_data)
        created_tasks_models.append(task)
    response_all = client.get("/api/v1/tasks?limit=100")
    assert response_all.status_code == status.HTTP_200_OK
    all_tasks_data = response_all.json()["data"]
    all_regular_tasks = [t for t in all_tasks_data if not t["isRecurring"]]
    assert len(all_regular_tasks) == 15

    expected_page2_data = all_regular_tasks[10:15]
    expected_names_page2 = [t["name"] for t in expected_page2_data]

    # Act: 2ページ目を10件取得
    response_page2 = client.get("/api/v1/tasks?page=2&limit=10")

    # Assert
    assert response_page2.status_code == status.HTTP_200_OK
    data_page2 = response_page2.json()
    assert len(data_page2["data"]) == 5
    assert data_page2["meta"]["totalItems"] == 15
    assert data_page2["meta"]["currentPage"] == 2
    assert data_page2["meta"]["totalPages"] == 2
    assert data_page2["meta"]["limit"] == 10

    returned_names = [t["name"] for t in data_page2["data"]]
    assert returned_names == expected_names_page2, (
        f"Returned task names {returned_names} do not match "
        f"expected names {expected_names_page2} for page 2"
    )


def test_read_tasks_sort_due_date(client: TestClient, db_session: Session):
    """GET /tasks: 期限日 (dueDate) でソートできるか"""
    # Arrange: 期限日の異なるタスクを作成
    label = create_test_label(db=db_session, name="Sort Label")
    task_later = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Due Later", dueDate="2025-06-01", label_ids=[label.id]
        ),
    )
    task_earlier = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Due Earlier", dueDate="2025-05-01", label_ids=[label.id]
        ),
    )
    task_null = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Due Null", dueDate=None, label_ids=[label.id]
        ),
    )

    # Act: 期限日昇順で取得
    response = client.get("/api/v1/tasks?sort=dueDate_asc")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    data = response.json()["data"]
    # 通常タスクの順序を確認 (nulls last)
    regular_tasks = [t for t in data if not t["isRecurring"]]
    assert len(regular_tasks) == 3
    assert regular_tasks[0]["id"] == str(task_earlier.id)  # 2025-05-01
    assert regular_tasks[1]["id"] == str(task_later.id)  # 2025-06-01
    assert regular_tasks[2]["id"] == str(task_null.id)  # null


def test_read_tasks_filter_assignee(client: TestClient, db_session: Session):
    """GET /tasks: 担当者 (assigneeId) でフィルターできるか"""
    # Arrange: 担当者が異なるタスクを作成
    label = create_test_label(db=db_session, name="Assignee Label")
    user1_id_str = str(uuid4())
    user2_id_str = str(uuid4())
    task1 = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="User1 Task", assigneeId=user1_id_str, label_ids=[label.id]
        ),
    )
    create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="User2 Task", assigneeId=user2_id_str, label_ids=[label.id]
        ),
    )
    create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="No Assignee Task", assigneeId=None, label_ids=[label.id]
        ),
    )

    # Act: user1 でフィルター
    response = client.get(f"/api/v1/tasks?assigneeId={user1_id_str}")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    data = response.json()["data"]
    assert len(data) == 1
    assert data[0]["id"] == str(task1.id)
    assert data[0]["name"] == "User1 Task"
    assert data[0]["assigneeId"] == user1_id_str

    # Act: 担当者なしでフィルター (assigneeId=null は現状未対応だが、将来的に)
    # response_null = client.get("/api/v1/tasks?assigneeId=null")
    # assert response_null.status_code == status.HTTP_200_OK
    # data_null = response_null.json()["data"]
    # assert len(data_null) == 1
    # assert data_null[0]["name"] == "No Assignee Task"


def test_read_tasks_filter_labels(client: TestClient, db_session: Session):
    """GET /tasks: ラベル (labels) でフィルターできるか (AND条件)"""
    # Arrange: ラベルとタスクを作成
    label_a = create_test_label(db=db_session, name="LabelA")
    label_b = create_test_label(db=db_session, name="LabelB")
    label_c = create_test_label(db=db_session, name="LabelC")
    task_ab = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Task AB", label_ids=[label_a.id, label_b.id]
        ),
    )
    task_bc = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Task BC", label_ids=[label_b.id, label_c.id]
        ),
    )
    task_a = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(name="Task A", label_ids=[label_a.id]),
    )

    # Act: LabelA と LabelB の両方を持つタスクを検索
    response_ab = client.get(
        f"/api/v1/tasks?labels={label_a.name},{label_b.name}"
    )

    # Assert
    assert response_ab.status_code == status.HTTP_200_OK
    data_ab = response_ab.json()["data"]
    assert len(data_ab) == 1
    assert data_ab[0]["id"] == str(task_ab.id)
    assert len(data_ab[0]["labels"]) == 2
    label_names_ab = {lbl["name"] for lbl in data_ab[0]["labels"]}
    assert label_a.name in label_names_ab
    assert label_b.name in label_names_ab

    # Act: LabelA のみを持つタスクを検索
    response_a = client.get(f"/api/v1/tasks?labels={label_a.name}")

    assert response_a.status_code == status.HTTP_200_OK
    data_a = response_a.json()["data"]
    # ★ Assert: task_ab と task_a が含まれることを確認
    assert len(data_a) == 2
    returned_a_ids = {t["id"] for t in data_a}
    assert str(task_ab.id) in returned_a_ids
    assert str(task_a.id) in returned_a_ids
    assert str(task_bc.id) not in returned_a_ids  # task_bc は含まれない


# --- DELETE /tasks/{taskId} テスト ---
def test_delete_task_success(client: TestClient, db_session: Session):
    """DELETE /tasks/{taskId}: 通常タスクの削除が成功するケース"""
    # Arrange: 削除対象のタスクを作成
    label = create_test_label(db=db_session, name="Delete Label")
    task_to_delete = create_test_task(
        db=db_session,
        data=schemas.TaskCreateApiInput(
            name="Task to Delete", label_ids=[label.id]
        ),
    )
    task_id_str = str(task_to_delete.id)

    # Act: DELETE リクエストを実行
    response = client.delete(f"/api/v1/tasks/{task_id_str}")

    # Assert: ステータスコード 204 No Content を確認
    assert response.status_code == status.HTTP_204_NO_CONTENT
    # Assert: DB から削除されたことを確認 (get_task が None を返す)
    deleted_task = crud.get_task(db=db_session, task_id=task_id_str)
    assert deleted_task is None


def test_delete_task_not_found(client: TestClient):
    """DELETE /tasks/{taskId}: 存在しないタスクIDを指定した場合に 404 エラー"""
    # Arrange: 存在しない UUID を用意
    non_existent_id = uuid4()

    # Act: DELETE リクエストを実行
    response = client.delete(f"/api/v1/tasks/{non_existent_id}")

    # Assert: ステータスコード 404 Not Found を確認
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_recurring_task_fails(client: TestClient, db_session: Session):
    """DELETE /tasks/{taskId}: 定常タスクを削除しようとすると失敗する (404) ケース"""
    # Arrange: 定常タスクを作成 (isRecurring=True)
    label = create_test_label(db=db_session, name="Routine Label")
    # crud.create_task は isRecurring を設定できないので、直接モデルを作成
    routine_task = models.Task(
        name="Routine Task",
        labels=[label],
        isRecurring=True,
        isCompleted=False,
    )
    db_session.add(routine_task)
    db_session.commit()
    db_session.refresh(routine_task)
    task_id = routine_task.id

    # Act: DELETE リクエストを実行
    response = client.delete(f"/api/v1/tasks/{task_id}")

    # Assert: ステータスコード 404 Not Found を確認 (通常タスクではないため)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # Assert: DB から削除されていないことを確認
    task_in_db = crud.get_task(db=db_session, task_id=str(task_id))
    assert task_in_db is not None
