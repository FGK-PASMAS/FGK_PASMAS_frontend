import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-dark-green/theme.css';
import 'primeflex/primeflex.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/main.scss'

import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ScrollPanel from 'primevue/scrollpanel';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app
    .component('PrimeButton', Button)
    .component('PrimeDivider', Divider)
    .component('PrimeScrollPanel', ScrollPanel);

app.mount('#app');
