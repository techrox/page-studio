import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
}))
