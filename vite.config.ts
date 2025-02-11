import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.sofascore.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Origin': 'https://www.sofascore.com',
          'Referer': 'https://www.sofascore.com/'
        },
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}) 