import { createSSRApp } from 'vue'
import App from './App'
import store from './store'
import { http } from './api'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.config.globalProperties.$store = store
  app.config.globalProperties.$http = http
  app.config.globalProperties.$apiUrl = 'https://api.example.com'
  return {
    app
  }
}
