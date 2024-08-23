import { createApp } from 'vue'
import "bootstrap/dist/css/bootstrap.css"
import './style.scss'
import App from './App.vue'
// fontawesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


import { router } from './router' 

import "bootstrap/dist/js/bootstrap.js"
// import * as bootstrap from 'bootstrap'

createApp(App).use(router).mount('#app')