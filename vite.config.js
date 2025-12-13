import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/adhd-task-game/', // ★リポジトリ名に合わせる
})