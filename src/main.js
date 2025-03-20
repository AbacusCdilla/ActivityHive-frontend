// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Router import karo

const app = createApp(App);

app.use(router); // Router use karo
app.mount('#app');
