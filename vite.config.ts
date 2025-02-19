import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    },
    host: '0.0.0.0',  // This is important for ngrok
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '9442-103-152-159-185.ngrok-free.app'  // Add your specific ngrok URL here
    ]
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  build: {
    commonjsOptions: {
      include: [/three/, /@react-three/]
    }
  }
})
