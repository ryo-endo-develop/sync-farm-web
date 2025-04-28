import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  CreateTaskInput,
  PaginatedTasksResponse,
  PutTaskInput,
  Task
} from '../../generated/api'

type GetTasksParams = {
  assigneeId?: string
  isCompleted?: boolean
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'dueDate_asc' | 'dueDate_desc'
  page?: number
  limit?: number
}

// API Slice の定義
export const tasksApi = createApi({
  reducerPath: 'tasksApi', // Store 内でのキー
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }), // ベース URL を設定
  tagTypes: ['Task'], // キャッシュタグの種類を定義 (キャッシュ無効化に使用)
  endpoints: (builder) => ({
    // エンドポイント定義: getTasks (一覧取得)
    getTasks: builder.query<PaginatedTasksResponse, GetTasksParams | void>({
      query: (params) => {
        // クエリパラメータを構築
        const queryParams = new URLSearchParams()
        if (params) {
          // params が void でない場合のみ処理
          if (params.assigneeId)
            queryParams.append('assigneeId', params.assigneeId)
          if (params.isCompleted !== undefined)
            queryParams.append('isCompleted', String(params.isCompleted))
          if (params.sort) queryParams.append('sort', params.sort)
          if (params.page) queryParams.append('page', String(params.page))
          if (params.limit) queryParams.append('limit', String(params.limit))
        }
        const queryString = queryParams.toString()
        // クエリ文字列を付けて URL を返す
        return {
          url: `/tasks${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        }
      },

      // キャッシュタグを提供 (他の操作でキャッシュを無効化するため)
      providesTags: (result, error, arg) =>
        result?.data
          ? [
              // 現在のページの各タスクにタグ付け
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              // リスト全体を示すタグも提供 (フィルターやソートが変わると無効化されるように)
              // 引数 (arg) を含めて、パラメータが変わったら別のリストとして扱う
              { type: 'Task', id: 'LIST', params: arg ?? {} }
            ]
          : // データがない場合はリストタグのみ (パラメータ付き)
            [{ type: 'Task', id: 'LIST', params: arg ?? {} }]
    }),

    // エンドポイント定義: addTask (作成)
    addTask: builder.mutation<Task, CreateTaskInput>({
      // <返り値の型, 引数の型>
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask // リクエストボディ
      }),
      transformResponse: (response: { data: Task }) => response.data,
      // キャッシュを無効化 (リストを再取得させる)
      invalidatesTags: [{ type: 'Task', id: 'LIST' }]
    }),

    // エンドポイント定義: updateTask (更新 - PUT)
    updateTask: builder.mutation<Task, { taskId: string; body: PutTaskInput }>({
      // <返り値の型, 引数>
      query: ({ taskId, body }) => ({
        url: `/tasks/${taskId}`,
        method: 'PUT',
        body: body
      }),
      transformResponse: (response: { data: Task }) => response.data,
      // 特定のタスクとリストのキャッシュを無効化
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Task', id: taskId },
        { type: 'Task', id: 'LIST' }
      ]
    }),

    // エンドポイント定義: deleteTask (削除)
    deleteTask: builder.mutation<void, string>({
      // <返り値の型 (void), 引数の型 (taskId)>
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE'
      }),
      // 特定のタスクとリストのキャッシュを無効化
      invalidatesTags: (result, error, taskId) => [
        { type: 'Task', id: taskId },
        { type: 'Task', id: 'LIST' }
      ]
    })
  })
})

// 自動生成されたフックをエクスポート (コンポーネントで使用)
// 例: `useGetTasksQuery`, `useAddTaskMutation`, etc.
export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = tasksApi
