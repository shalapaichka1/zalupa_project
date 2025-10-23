import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from "firebase/app";

import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyAkAVqh68vBS5M9gDkOGfvZCgc730jpynE",
    authDomain: "zalupaweb.firebaseapp.com",
    projectId: "zalupaweb",
    storageBucket: "zalupaweb.appspot.com",
    messagingSenderId: "628677278411",
    appId: "1:628677278411:web:aeaa5a532fb7b6ca83394e",
    measurementId: "G-YL879M1LCH"
   };

initializeApp(firebaseConfig)
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')