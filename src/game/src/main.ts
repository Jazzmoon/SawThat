import { createApp } from 'vue'
import App from './App.vue'
import RadialProgress from "vue3-radial-progress";

import './assets/main.css'

const app = createApp(App)
app.use(RadialProgress);

app.mount('#app')
