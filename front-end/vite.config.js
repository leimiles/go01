import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/assets-lib': {
        target: 'https://webgl.sofunny.io',
        changeOrigin: true
      }
    }
  }
})
