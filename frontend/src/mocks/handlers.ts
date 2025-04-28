// src/mocks/handlers.ts
import { delay, http, HttpResponse } from 'msw'

import type {
  CreateTaskInput,
  PaginatedTasksResponse,
  PaginationMeta,
  PutTaskInput,
  Task,
  User
} from '../generated/api' // 生成された型をインポート

// インメモリでタスクデータを保持 (モック用)
let mockTasks: Task[] = [
  // ★ labels プロパティを追加
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde0',
    name: '牛乳を買う',
    assigneeId: null,
    dueDate: '2025-04-22',
    isCompleted: false,
    labels: ['買い物', '家事'],
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde1',
    name: '請求書を処理する',
    assigneeId: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
    dueDate: '2025-04-25',
    isCompleted: false,
    labels: ['仕事', '重要'],
    createdAt: '2025-04-19T14:30:00Z',
    updatedAt: '2025-04-19T14:30:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcde2',
    name: '会議室を予約する',
    assigneeId: null,
    dueDate: null,
    isCompleted: true,
    labels: ['仕事'],
    createdAt: '2025-04-18T09:00:00Z',
    updatedAt: '2025-04-19T11:00:00Z'
  },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `ダミータスク ${i + 1}`,
    assigneeId: i % 3 === 0 ? 'f0e9d8c7-b6a5-4321-fedc-ba9876543210' : null,
    dueDate:
      i % 4 === 0 ? null : new Date(2025, 4, 1 + i).toISOString().split('T')[0],
    isCompleted: i % 5 === 0,
    // ★ ダミーデータにも labels を追加
    labels: i % 2 === 0 ? ['個人'] : ['家事', `タスク${i}`],
    createdAt: new Date(2025, 3, 20 + i).toISOString(),
    updatedAt: new Date().toISOString()
  }))
]

let mockUsers: User[] = [
  {
    id: crypto.randomUUID(), // ランダムなUUID
    name: 'あなた', // ログインユーザー自身を表す例
    createdAt: new Date(2024, 10, 1).toISOString(), // 2024-11-01
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'パートナー',
    createdAt: new Date(2024, 10, 5).toISOString(), // 2024-11-05
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'おばあちゃん',
    createdAt: new Date(2025, 0, 15).toISOString(), // 2025-01-15
    updatedAt: new Date().toISOString()
  }
  // 必要に応じて他の家族メンバーを追加
]

const API_BASE_URL = '/api/v1' // OpenAPIで定義したベースパス
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10 // TaskListPage のデフォルトと合わせる

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

    // --- クエリパラメータを取得 ---
    const assigneeId = url.searchParams.get('assigneeId')
    const isCompletedParam = url.searchParams.get('isCompleted')
    const sort = url.searchParams.get('sort') || 'createdAt_desc' // デフォルトソート
    const page = parseInt(
      url.searchParams.get('page') || String(DEFAULT_PAGE),
      10
    )
    const limit = parseInt(
      url.searchParams.get('limit') || String(DEFAULT_LIMIT),
      10
    )

    let processedTasks = [...mockTasks] // コピーして操作

    // --- フィルター適用 ---
    if (assigneeId) {
      // 'me' の場合は仮のIDに置き換える (実際のバックエンドでは認証情報から取得)
      const filterAssigneeId =
        assigneeId === 'me'
          ? 'f0e9d8c7-b6a5-4321-fedc-ba9876543210'
          : assigneeId
      processedTasks = processedTasks.filter(
        (task) => task.assigneeId === filterAssigneeId
      )
    }
    if (isCompletedParam !== null) {
      const filterCompleted = isCompletedParam === 'true'
      processedTasks = processedTasks.filter(
        (task) => task.isCompleted === filterCompleted
      )
    }

    // --- ソート適用 ---
    processedTasks.sort((a, b) => {
      switch (sort) {
        case 'dueDate_asc':
          if (a.dueDate == null) return 1
          if (b.dueDate == null) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'dueDate_desc':
          if (a.dueDate == null) return 1
          if (b.dueDate == null) return -1
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        case 'createdAt_asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        case 'createdAt_desc':
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
    })

    // --- ページネーション適用 ---
    const totalItems = processedTasks.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = processedTasks.slice(startIndex, endIndex)

    // --- ページネーションメタデータを作成 ---
    const meta: PaginationMeta = {
      totalItems,
      totalPages,
      currentPage: page,
      limit
    }

    // --- PaginatedTasksResponse 形式でレスポンスを返す ---
    const response: PaginatedTasksResponse = {
      data: paginatedData,
      meta: meta
    }

    return HttpResponse.json(response)
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
      labels: newTaskInput.labels,
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
      labels: putData.labels,
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
  }),

  // --- Members API ---
  http.get(`${API_BASE_URL}/members`, async () => {
    await delay(150) // 少し遅延させる
    // OpenAPI で定義した通り { data: User[] } の形式で返す
    return HttpResponse.json({ data: mockUsers })
  })
]
