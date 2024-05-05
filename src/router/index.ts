import BookingView from "@/views/BookingView.vue";
import FlightsView from "@/views/FlightsView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import PassengersView from "@/views/PassengersView.vue";
import SettingsBlockerView from "@/views/SettingsBlockerView.vue";
import SettingsOverviewView from "@/views/SettingsOverviewView.vue";
import SettingsPlaneView from "@/views/SettingsPlaneView.vue";
import SettingsUserView from "@/views/SettingsUserView.vue";
import SettingsView from "@/views/SettingsView.vue";
import { createRouter, createWebHistory } from "vue-router";

export enum RouteGuard {
    ADMIN,
    VENDOR,
    USER,
    NON_AUTH
}

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/:pathMAth(.*)",
            name: "notFound",
            component: NotFoundView,
            meta: {
                auth: false,
                guard: undefined
            }
        }, {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                auth: false,
                guard: undefined
            }
        }, {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: {
                auth: false,
                guard: RouteGuard.NON_AUTH
            }
        }, {
            path: "/booking",
            name: "booking",
            component: BookingView,
            meta: {
                auth: true,
                guard: RouteGuard.VENDOR
            }
        }, {
            path: "/flights",
            name: "flights",
            component: FlightsView,
            meta: {
                auth: true,
                guard: RouteGuard.USER
            }
        }, {
            path: "/passengers",
            name: "passengers",
            component: PassengersView,
            meta: {
                auth: true,
                guard: RouteGuard.USER
            }
        }, {
            path: "/settings",
            name: "settings",
            component: SettingsView,
            children: [
                {
                    path: "",
                    name: "settings.overview",
                    component: SettingsOverviewView
                }, {
                    path: "users",
                    name: "settings.user",
                    component: SettingsUserView
                }, {
                    path: "blockers",
                    name: "settings.blocker",
                    component: SettingsBlockerView
                }, {
                    path: "planes",
                    name: "settings.plane",
                    component: SettingsPlaneView
                },
            ],
            meta: {
                auth: true,
                guard: RouteGuard.ADMIN
            }
        },
    ],
    scrollBehavior: () => {
        document.getElementById("content")!.scrollTop = 0;
    }
});
