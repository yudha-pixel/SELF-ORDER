import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/erpquick_coffee_ordering/static/src/react_app/',
  plugins: [react(), tailwindcss()],

  // Konfigurasi untuk Path Alias '@'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Konfigurasi untuk Production Build (Integrasi Odoo)
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})