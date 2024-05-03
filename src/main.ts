import "bootstrap-icons/font/bootstrap-icons.css";
import { Settings } from "luxon";
import { createPinia } from "pinia";
import "primeflex/primeflex.css";
import Button from "primevue/button";
import Column from "primevue/column";
import PrimeVue from "primevue/config";
import DataTable from "primevue/datatable";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import InputGroup from "primevue/inputgroup";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import ProgressSpinner from "primevue/progressspinner";
import TabMenu from "primevue/tabmenu";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.scss";
import { router } from "./router";

Settings.defaultLocale = "de";

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
app.use(PrimeVue, {
    locale: {
        startsWith: "Beginnt mit",
        contains: "Enthält",
        notContains: "Enthält nicht",
        endsWith: "Endet mit",
        equals: "Ist gleich",
        notEquals: "Ist nicht gleich",
        noFilter: "Kein Filter",
        dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        dayNamesMin: ["So","Mo","Di","Mi","Do","Fr","Sa"],
        monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
        monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        today: "Heute",
        clear: "Zurücksetzen",
        weekHeader: "KW",
        firstDayOfWeek: 1,
        dateFormat: "dd.mm.yy",
    }
});

app
    .component("PrimeButton", Button)
    .component("PrimeColumn", Column)
    .component("PrimeDataTable", DataTable)
    .component("PrimeDivider", Divider)
    .component("PrimeDropdown", Dropdown)
    .component("PrimeInputGroup", InputGroup)
    .component("PrimeInputNumber", InputNumber)
    .component("PrimeInputText", InputText)
    .component("PrimePanel", Panel)
    .component("PrimeProgressSpinner", ProgressSpinner)
    .component("PrimeTabMenu", TabMenu);

app.mount("#app");
