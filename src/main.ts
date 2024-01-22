import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ToastService from "primevue/toastservice";

import PrimeVue from "primevue/config";
import "primeflex/primeflex.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/main.scss"

import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import ScrollPanel from "primevue/scrollpanel";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    // Report to log service
    console.log("Handling error globally:");
    
    console.log(err);
    console.log(instance);
    console.log(info);
}

app.use(createPinia());
app.use(router);
app.use(ToastService);
app.use(PrimeVue);

app
    .component("PrimeButton", Button)
    .component("PrimeColumn", Column)
    .component("PrimeDataTable", DataTable)
    .component("PrimeDivider", Divider)
    .component("PrimeDropdown", Dropdown)
    .component("PrimeInputNumber", InputNumber)
    .component("PrimeInputText", InputText)
    .component("PrimeMessage", Message)
    .component("PrimeScrollPanel", ScrollPanel);

app.mount("#app");
