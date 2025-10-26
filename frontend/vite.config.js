import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const apiKey = env.VITE_BACKEND_REGISTER_API
  const apiUrl = env.VITE_BACKEND_URL_API

  return {
    server: {
      hmr: { overlay: true },
      match: {
        usePolling: true
      },
      port: 5173
    },
    plugins: [vue(), vueJsx(), svgLoader()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      'process.env': {
        VITE_BACKEND_REGISTER_API: JSON.stringify(apiKey),
        VITE_BACKEND_URL_API: JSON.stringify(apiUrl)
      }
    },
    build: {
      outDir: 'dist'
    }
  }
})