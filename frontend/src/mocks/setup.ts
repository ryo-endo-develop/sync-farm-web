// frontend/src/mocks/setup.ts
import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

/**
 * MSWワーカーを設定し、開発環境で起動する
 */
export async function setupMockServiceWorker(): Promise<void> {
  // コンソールにMSWの開始を記録
  console.log('🔄 MSW: Creating worker instance...')

  const worker = setupWorker(...handlers)

  // リクエストのインターセプトをログに残す
  const originalUse = worker.use.bind(worker)
  worker.use = function (...handlers) {
    return originalUse(...handlers)
  }

  console.log('🔄 MSW: Starting worker...')

  try {
    await worker.start({
      onUnhandledRequest: 'warn' // 'bypass'から'warn'に変更してログを出力
    })
    console.log('✅ MSW: Worker started successfully!')
  } catch (error) {
    console.error('❌ MSW: Worker failed to start:', error)
    throw error
  }
}
