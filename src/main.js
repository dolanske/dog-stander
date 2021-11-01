// Framework imports
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from 'vue-router'

// Setting up
import App from './App.vue'
import { setupRouter } from './router'

const router = createRouter(setupRouter)
const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
