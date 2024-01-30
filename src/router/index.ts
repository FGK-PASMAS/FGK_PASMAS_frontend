import BookingConfirmView from "@/views/BookingConfirmView.vue";
import BookingPassengersView from "@/views/BookingPassengersView.vue";
import BookingPrebookingView from "@/views/BookingPrebookingView.vue";
import BookingView from "@/views/BookingView.vue";
import FlightsView from "@/views/FlightsView.vue";
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
        },
        {
            path: "/",
            name: "booking",
            component: BookingView,
            children: [
                {
                    path: "/",
                    name: "booking_passengers",
                    component: BookingPassengersView,
                    meta: {
                        prev: undefined,
                        next: "booking_prebooking"
                    }
                },
                {
                    path: "prebooking",
                    name: "booking_prebooking",
                    component: BookingPrebookingView,
                    meta: {
                        prev: "booking_passengers",
                        next: "booking_confirm"
                    }

                },
                {
                    path: "confirm",
                    name: "booking_confirm",
                    component: BookingConfirmView,
                    meta: {
                        prev: "booking_prebooking",
                        next: undefined
                    }
                }
            ]
        },
        {
            path: "/flights",
            name: "flights",
            component: FlightsView
        },
        {
            path: "/passengers",
            name: "passengers",
            component: PassengersView
        },
        {
            path: "/settings",
            name: "settings",
            component: SettingsView
        },
    ]
})

export default router;
