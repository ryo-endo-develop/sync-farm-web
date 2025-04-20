import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // ★ API Slice の reducer を登録
    [tasksApi.reducerPath]: tasksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  // ★ API ミドルウェアを追加 (キャッシュ、ポーリング、無効化など)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tasksApi.middleware)
      .concat(usersApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { tasksApi } from './api/taskApi'
import { usersApi } from './api/usersApi'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
