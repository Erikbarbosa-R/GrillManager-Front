import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'grillmanager-back-production.up.railway.app',
      '.railway.app'
    ]
  },
  preview: {
    allowedHosts: [
      'grillmanager-back-production.up.railway.app',
      '.railway.app'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})