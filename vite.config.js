import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for our React app
// This sets up fast development with hot module reloading
export default defineConfig({
  plugins: [react()],
})
