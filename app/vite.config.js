import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from the repo root; adjust if using a subpath
  base: '/',
  resolve: {
    alias: {
      // Allow imports of engine JSON from data directory
      '/../../data': path.resolve(__dirname, '../data'),
      '/data-root': path.resolve(__dirname, '..'),
    },
  },
  build: {
    outDir: '../docs/app',
    emptyOutDir: true,
  },
})
