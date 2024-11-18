// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/element-plus-index.css'
import './style.css'
import './styles/index.scss'
import '@/router/permission'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')
