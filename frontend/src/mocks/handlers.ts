// src/mocks/handlers.ts
import { delay, http, HttpResponse } from 'msw'

import type { CreateTaskInput, PutTaskInput, Task } from '../generated/api' // 生成された型をインポート

// インメモリでタスクデータを保持 (モック用)
let mockTasks: Task[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde0',
    name: '牛乳を買う',
    assigneeId: null,
    dueDate: '2025-04-22',
    isCompleted: false,
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde1',
    name: '請求書を処理する',
    assigneeId: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210', // ダミーの担当者ID
    dueDate: '2025-04-25',
    isCompleted: false,
    createdAt: '2025-04-19T14:30:00Z',
    updatedAt: '2025-04-19T14:30:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde2',
    name: '会議室を予約する',
    assigneeId: null,
    dueDate: null,
    isCompleted: true,
    createdAt: '2025-04-18T09:00:00Z',
    updatedAt: '2025-04-19T11:00:00Z'
  }
]

const API_BASE_URL = '/api/v1' // OpenAPIで定義したベースパス

export const handlers = [
  // --- Health Check ---
  http.get(`${API_BASE_URL}/health`, async () => {
    await delay(100) // ネットワーク遅延をシミュレート
    return HttpResponse.json({ status: 'OK (Mocked)' })
  }),

  // --- Tasks API ---

  // GET /tasks : タスク一覧取得
  http.get(`${API_BASE_URL}/tasks`, async ({ request }) => {
    await delay(300) // 一覧取得は少し遅延させる
    const url = new URL(request.url)
    const isCompletedParam = url.searchParams.get('isCompleted')

    let resultTasks = mockTasks
    if (isCompletedParam !== null) {
      const filterCompleted = isCompletedParam === 'true'
      resultTasks = mockTasks.filter(
        (task) => task.isCompleted === filterCompleted
      )
    }

    return HttpResponse.json({ data: resultTasks })
  }),

  // POST /tasks : 新規タスク作成
  http.post(`${API_BASE_URL}/tasks`, async ({ request }) => {
    await delay(200)
    const newTaskInput = (await request.json()) as CreateTaskInput

    // 簡単なバリデーション例 (実際はZod等で行うべきだが、モックなので省略)
    if (!newTaskInput.name || typeof newTaskInput.name !== 'string') {
      return HttpResponse.json(
        { message: 'Validation Error', details: { name: 'Name is required' } },
        { status: 400 }
      )
    }

    const newTask: Task = {
      id: crypto.randomUUID(), // 新しいUUIDを生成
      name: newTaskInput.name,
      assigneeId: newTaskInput.assigneeId ?? null,
      dueDate: newTaskInput.dueDate ?? null,
      isCompleted: false, // デフォルトは未完了
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockTasks.push(newTask)

    return HttpResponse.json({ data: newTask }, { status: 201 })
  }),

  // PUT /tasks/{taskId} : タスク更新
  http.put(`${API_BASE_URL}/tasks/:taskId`, async ({ request, params }) => {
    await delay(150)
    const { taskId } = params
    const putData = (await request.json()) as PutTaskInput

    // 簡単な必須項目チェック (PUT なので name と isCompleted は必須と仮定)
    if (
      typeof putData.name !== 'string' ||
      putData.name.trim() === '' ||
      typeof putData.isCompleted !== 'boolean'
    ) {
      return HttpResponse.json(
        {
          message: 'Validation Error',
          details: { error: 'Name and isCompleted are required' }
        },
        { status: 400 }
      )
    }

    const taskIndex = mockTasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      // PUT はリソースが存在しない場合、新規作成する挙動も考えられるが、
      // 今回はシンプルに 404 Not Found とする
      return HttpResponse.json({ message: 'Task Not Found' }, { status: 404 })
    }

    // 既存のタスクを取得し、PUTデータで上書き（id, createdAt は維持）
    const originalTask = mockTasks[taskIndex]
    const updatedTask: Task = {
      id: originalTask.id, // IDは維持
      name: putData.name,
      assigneeId: putData.assigneeId ?? null, // リクエストになければnull
      dueDate: putData.dueDate ?? null, // リクエストになければnull
      isCompleted: putData.isCompleted,
      createdAt: originalTask.createdAt, // 作成日時は維持
      updatedAt: new Date().toISOString() // 更新日時を更新
    }
    mockTasks[taskIndex] = updatedTask

    return HttpResponse.json({ data: updatedTask }) // 更新後のデータを返す
  }),

  // DELETE /tasks/{taskId} : タスク削除
  http.delete(`${API_BASE_URL}/tasks/:taskId`, async ({ params }) => {
    await delay(250)
    const { taskId } = params

    const initialLength = mockTasks.length
    mockTasks = mockTasks.filter((task) => task.id !== taskId)

    if (mockTasks.length === initialLength) {
      return HttpResponse.json({ message: 'Task Not Found' }, { status: 404 })
    }

    // 成功時は 204 No Content (ボディなし)
    return new HttpResponse(null, { status: 204 })
  })
]
