
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import router from './router' 
import { initAuth } from './services/authStore'
import App from './App.vue'
import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

const app = createApp(App)

registerPlugins(app)
app.use(router)

initAuth() 

app.mount('#app')
