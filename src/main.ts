
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

initAuth() // Initializes the authentication state management system, ensuring that user authentication status is correctly established before the app is mounted
router.isReady().then(() => app.mount('#app')) // Ensures that the app is only mounted after the router is fully initialized, preventing potential navigation issues on initial load
