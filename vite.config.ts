import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'StocksSnapshot',
      fileName: (format) => `stocks.bundle.${format}.js`,
    },
    rollupOptions: {},
  },
  plugins: [tailwindcss()],
})
