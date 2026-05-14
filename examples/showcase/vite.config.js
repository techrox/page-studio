import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for the showcase example. Port 5174 keeps it out of the way
// of the Page Studio legacy frontend (which uses 5173).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: false },
  preview: { port: 5174 },
})
