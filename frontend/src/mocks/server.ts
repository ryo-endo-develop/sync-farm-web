import { setupServer } from 'msw/node'

import { handlers } from './handlers'

// サーバー用のモックを設定（Jest等のテスト環境で使用）
export const server = setupServer(...handlers)
