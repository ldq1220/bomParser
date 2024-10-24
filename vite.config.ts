import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import proxy from './src/config/proxy'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/variable.scss";'
      }
    }
  },
  server: {
    port: 5188,
    proxy: proxy
  }
})
