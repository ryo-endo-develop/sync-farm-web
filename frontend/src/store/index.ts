import { configureStore } from '@reduxjs/toolkit'
// import tasksReducer from './slices/tasks.slice'; // 通常のSlice (必要なら)

export const store = configureStore({
  reducer: {
    // tasks: tasksReducer,
    // ★ API Slice の reducer を登録
    [tasksApi.reducerPath]: tasksApi.reducer
  },
  // ★ API ミドルウェアを追加 (キャッシュ、ポーリング、無効化など)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware)
})

// 型定義 (変更なし)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 型付きフック (コメントアウト解除して利用推奨)
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { tasksApi } from './api/taskApi'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
