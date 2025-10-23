import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const apiKey = env.VITE_API_KEY
  const apiUrl = env.VITE_API_URL

  return {
    server: {
      hmr: { overlay: true },
      match: {
        usePolling: true
      }
    },
    plugins: [vue(), vueJsx(), svgLoader()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      'process.env': {
        VITE_API_KEY: JSON.stringify(apiKey),
        VITE_API_URL: JSON.stringify(apiUrl)
      }
    }
  }
})