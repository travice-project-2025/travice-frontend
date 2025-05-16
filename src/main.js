// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/variables.css'
import '@/assets/styles/base.css'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css'

const app = createApp(App)
app.use(router)
app.use(VCalendar, {})
app.mount('#app')