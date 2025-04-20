import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { store } from './store'

// MSWの初期化を関数に切り出す
async function initializeMSW() {
  console.log('🔍 ENV:', import.meta.env.DEV ? 'Development' : 'Production')

  if (import.meta.env.DEV) {
    console.log('🔄 Preparing to start MSW...')

    try {
      // Service Workerファイルの存在チェック
      const swResponse = await fetch('/mockServiceWorker.js')
      if (swResponse.ok) {
        console.log('✅ mockServiceWorker.js found!')
      } else {
        console.error(
          '❌ mockServiceWorker.js not found! Status:',
          swResponse.status
        )
        return
      }

      const { setupMockServiceWorker } = await import('./mocks/setup')
      await setupMockServiceWorker()
    } catch (err) {
      console.error('❌ Failed to initialize MSW:', err)
    }
  }
}

// アプリのレンダリング
async function renderApp() {
  // MSWを初期化
  await initializeMSW()

  // Reactアプリをレンダリング
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  )
}

// アプリ起動
void renderApp()
