import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// UI Library
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-dark-green/theme.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Button from 'primevue/button';
import Divider from 'primevue/divider';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

// Global components
app.component('PrimeButton', Button);
app.component('PrimeDivider', Divider);

app.mount('#app');
