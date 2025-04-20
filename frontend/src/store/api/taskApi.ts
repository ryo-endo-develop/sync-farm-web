import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { CreateTaskInput, PutTaskInput,Task } from '../../generated/api' // 生成された型をインポート
// import { TasksService } from '../../generated/api'; // 生成されたサービス関数 (直接使う場合はインポート)

// API Slice の定義
export const tasksApi = createApi({
  reducerPath: 'tasksApi', // Store 内でのキー
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }), // ベース URL を設定
  tagTypes: ['Task'], // キャッシュタグの種類を定義 (キャッシュ無効化に使用)
  endpoints: (builder) => ({
    // エンドポイント定義: getTasks (一覧取得)
    getTasks: builder.query<Task[], void>({
      // <返り値の型, 引数の型>
      // query: () => '/tasks', // シンプルなGETリクエストの場合
      // 生成されたサービス関数を使う場合 (型安全性が高まる)
      // queryFn: async () => {
      //   try {
      //     // ここで TasksService.getTasksList() などを呼び出す
      //     // NOTE: openapi-typescript-codegen の出力によっては services.ts ではなく
      //     //       より詳細な名前のファイル (e.g., Tasks.ts) になっている可能性あり
      //     // const result = await TasksService.getTasksList(); // 例
      //     // return { data: result.data }; // SuccessResponse の data を返す
      //     // ★↓ 下記は直接 fetch する例 (サービス関数がうまく使えない場合など)
      //     const response = await fetch('/api/v1/tasks');
      //     if (!response.ok) throw new Error('Failed to fetch tasks');
      //     const result: { data: Task[] } = await response.json();
      //     return { data: result.data };
      //   } catch (error) {
      //     return { error: error instanceof Error ? error.message : 'Unknown error' };
      //   }
      // },
      // ★ シンプルな query プロパティを使う場合 (推奨):
      query: () => ({
        url: '/tasks',
        method: 'GET'
      }),
      // ★ レスポンスから {data: ...} のラップを解除する
      transformResponse: (response: { data: Task[] }) => response.data,
      // キャッシュタグを提供 (他の操作でキャッシュを無効化するため)
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' } // リスト全体のタグ
            ]
          : [{ type: 'Task', id: 'LIST' }]
    }),

    // エンドポイント定義: addTask (作成)
    addTask: builder.mutation<Task, CreateTaskInput>({
      // <返り値の型, 引数の型>
      query: (newTask) => ({
        url: '/tasks',
        method: 'POST',
        body: newTask // リクエストボディ
      }),
      transformResponse: (response: { data: Task }) => response.data, // data を抽出
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
      transformResponse: (response: { data: Task }) => response.data, // data を抽出
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
