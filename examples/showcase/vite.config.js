import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Vite config for the showcase example. Port 5174 keeps it out of the way
// of the Page Studio legacy frontend (which uses 5173).
//
// `base` is set to `/page-studio/` for production builds so the deployed
// GitHub Pages site at https://techrox.github.io/page-studio/ resolves
// hashed asset URLs correctly. Dev and preview keep `/` so local servers
// stay at the root.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/page-studio/' : '/',
  server: { port: 5174, strictPort: false },
  preview: { port: 5174 },
  resolve: {
    alias: {
      '@techrox/page-studio/styles.css': path.resolve(__dirname, '../../packages/editor/src/styles.css'),
      '@techrox/page-studio-blocks/styles.css': path.resolve(__dirname, '../../packages/blocks/src/styles.css'),
      '@techrox/page-studio-form/styles.css': path.resolve(__dirname, '../../packages/form/src/styles.css'),
      '@techrox/page-studio': path.resolve(__dirname, '../../packages/editor/src/index.js'),
      '@techrox/page-studio-blocks': path.resolve(__dirname, '../../packages/blocks/src/index.js'),
      '@techrox/page-studio-renderer': path.resolve(__dirname, '../../packages/renderer/src/index.js'),
      '@techrox/page-studio-form': path.resolve(__dirname, '../../packages/form/src/index.js'),
    },
  },
}))
