import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 開発時は /api をSpring Boot(8080)へプロキシし、CORS設定を不要にする
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 使用中なら別ポートにずらさず失敗させる(ポート競合防止)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
