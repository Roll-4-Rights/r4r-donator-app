// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import router from './router' // 1. Added explicit import for router

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'
import './styles/tailwind.css'
import './styles/main.scss'

const app = createApp(App)

// 2. Pass the router into registerPlugins or use it directly
registerPlugins(app)
app.use(router) 

app.mount('#app')
