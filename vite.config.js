import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // <-- Importe o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	resolve: {
    alias: {
      // Esta linha define que '@' agora aponta para o diretório 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
