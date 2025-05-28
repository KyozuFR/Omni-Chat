import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.component('PrimeCard', Card)
app.component('PrimeTag', Tag)

app.mount('#app')
