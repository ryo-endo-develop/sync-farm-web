import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { User } from '../../generated/api'

// ユーザー関連 API の Slice 定義
export const usersApi = createApi({
  reducerPath: 'usersApi', // Store 内でのキー
  // ベースとなるクエリ設定 (tasksApi と同じものを指定)
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  // キャッシュタグの種類を定義
  tagTypes: ['User'],
  // API エンドポイントを定義
  endpoints: (builder) => ({
    // getMembers エンドポイント (ユーザー一覧取得)
    getMembers: builder.query<User[], void>({
      // <返り値の型, 引数の型 (今回は引数なし)>
      query: () => '/members', // GET /api/v1/members を呼び出す
      // APIレスポンスの { data: User[] } から User[] を取り出す
      transformResponse: (response: { data: User[] }) => response.data,
      // キャッシュタグを提供 (個々のユーザーとリスト全体)
      // これにより、将来ユーザー情報が更新された場合にキャッシュを効率的に扱える
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' }
            ]
          : [{ type: 'User', id: 'LIST' }]
    })
    // 必要に応じて他のユーザー関連エンドポイントを追加 (例: getUserById, updateUser など)
    // getUserById: builder.query<User, string>({
    //   query: (userId) => `/users/${userId}`, // 仮のパス
    //   transformResponse: (response: { data: User }) => response.data,
    //   providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    // }),
  })
})

// 自動生成されたフックをエクスポート
// これをコンポーネント (例: TaskForm) で使ってユーザー一覧を取得する
export const {
  useGetMembersQuery
  // useGetUserByIdQuery, // 他のエンドポイントを追加した場合
} = usersApi
