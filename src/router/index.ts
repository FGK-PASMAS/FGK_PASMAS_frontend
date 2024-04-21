import BookingView from "@/views/BookingView.vue";
import FlightsView from "@/views/FlightsView.vue";
import HomeViewVue from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import PassengersView from "@/views/PassengersView.vue";
import SettingsView from "@/views/SettingsView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/:pathMAth(.*)",
            name: "notFound",
            component: NotFoundView
        }, {
            path: "/",
            name: "home",
            component: HomeViewVue
        }, {
            path: "/booking",
            name: "booking",
            component: BookingView
        }, {
            path: "/flights",
            name: "flights",
            component: FlightsView
        }, {
            path: "/passengers",
            name: "passengers",
            component: PassengersView
        }, {
            path: "/settings",
            name: "settings",
            component: SettingsView
        },
    ],
    scrollBehavior: () => {
        document.getElementById("content")!.scrollTop = 0;
    }
});

export default router;
