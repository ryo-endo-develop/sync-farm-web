import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  server: {
    proxy: {
      // '/api' で始まるパスへのリクエストをプロキシする
      '/api': {
        target: 'http://localhost:8000', // ★ 転送先のバックエンドサーバー
        changeOrigin: true // オリジンを変更して CORS エラーを防ぐ
        // secure: false, // HTTPS で自己署名証明書を使っている場合など
        // rewrite: (path) => path.replace(/^\/api/, ''), // パスから '/api' を削除する場合 (今回は不要)
      }
      // 必要に応じて他のパスのプロキシ設定を追加
      // '/socket.io': {
      //   target: 'ws://localhost:8000',
      //   ws: true,
      // },
    }
    // (任意) デフォルトのポートを変更する場合
    // port: 3000,
  }
})
