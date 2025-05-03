import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
    host: true,
    allowedHosts: ['quiz-io-4k16.onrender.com'],
  },
})
