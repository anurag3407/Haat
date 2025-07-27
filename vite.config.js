import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations for production
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', 'framer-motion', 'styled-components'],
          utils: ['@tanstack/react-query', 'react-hot-toast']
        }
      }
    },
    // Generate sourcemaps for production debugging
    sourcemap: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    proxy: {
      // Proxy API calls to backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Environment variables configuration
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
