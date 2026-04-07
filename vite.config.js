import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        board: './pages/board.html',
        detailPost: './pages/detailPost.html',
        mypage: './pages/mypage.html',
        myparty: './pages/myparty.html',
        pokedex: './pages/pokedex.html',
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.fullstackfamily.com',
        changeOrigin: true,
      },
    },
  },
})