import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://vibechat-production-24a1.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'wss://vibechat-production-24a1.up.railway.app',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
