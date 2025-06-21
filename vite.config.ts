import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // base: '/erpquick_coffee_ordering/static/src/react_app/',
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
  },

  // This is the part you need to add/modify
  server: {
    // Use port 5173 as shown in your screenshot
    port: 5173, 
    proxy: {
      // Proxy requests that start with these paths to your Odoo server
      '/web': {
        target: 'http://localhost:8069', // Your Odoo server address
        changeOrigin: true,
      },
      '/longpolling': {
        target: 'http://localhost:8069',
        changeOrigin: true,
      },
      '/session': {
        target: 'http://localhost:8069',
        changeOrigin: true,
      },
      // Add a proxy for any custom API routes you create in Odoo
      '/api': {
        target: 'http://localhost:8069',
        changeOrigin: true,
      },
    }
  }
})