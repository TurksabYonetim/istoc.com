import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command }) => {
  const frappeBackend = process.env.VITE_FRAPPE_BACKEND || 'http://localhost:8000'
  const frappeSocketio = process.env.VITE_FRAPPE_SOCKETIO || 'http://localhost:9000'

  return {
    base: command === 'build' ? '/Frappe_Marketplace/' : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 8082,
      strictPort: true,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: frappeBackend,
          changeOrigin: true,
          secure: false,
          headers: {
            Host: 'tradehub.localhost',
          },
        },
        '/assets': {
          target: frappeBackend,
          changeOrigin: true,
          secure: false,
          headers: {
            Host: 'tradehub.localhost',
          },
        },
        '/socket.io': {
          target: frappeSocketio,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
