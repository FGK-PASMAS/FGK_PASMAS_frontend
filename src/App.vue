<script setup lang="ts">
import { usePrimeVue } from "primevue/config";
import Toast from "primevue/toast";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import MenuDrawer from "./components/MenuDrawer.vue";
import MenuDrawerItem from "./components/MenuDrawerItem.vue";
import MenuTopbar from "./components/MenuTopbar.vue";
import { authStore } from "./stores/auth";
import { configStore } from "./stores/config";
import { RouteGuard } from "./router";

const router = useRouter();
const auth = authStore();
const config = configStore();
const PrimeVue = usePrimeVue();

// Theme
const lightTheme = "lara-light-green";
const darkTheme = "lara-dark-green";
const isDarkMode = ref(false);
let currentTheme = lightTheme;
let localTheme: string | null;

// MenuDrawer
const isOpen = ref(false);
const isClosed = ref(false);

// Hide menu drawer and topbar
const hideMenu = ref(false);

onBeforeMount(() => {
    auth.init();
    config.init();

    localTheme = localStorage.getItem("theme");

    if (localTheme) {
        applyTheme(localTheme);
    } else {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            applyTheme(darkTheme);
        }
    }
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (localTheme) {
        return;
    }

    const theme = event.matches ? darkTheme : lightTheme;

    applyTheme(theme);
});

router.beforeEach((to) => {
    const routeAuth = to.meta.auth;
    const routeGuard = to.meta.guard;

    if (!routeAuth && routeGuard === RouteGuard.NON_AUTH && auth.isAuthenticated) {
        router.replace({ name: "home" });
        return false;
    }

    if (routeAuth && !auth.isAuthenticated) {
        router.replace({ name: "home" });
        return false;
    }

    if (routeGuard === RouteGuard.VENDOR && !auth.isVendor) {
        router.replace({ name: "home" });
        return false;
    }

    if (routeGuard === RouteGuard.ADMIN && !auth.isAdmin) {
        router.replace({ name: "home" });
        return false;
    }

    if (to.name === "login" || to.name === "notFound") {
        hideMenu.value = true;
    } else {
        hideMenu.value = false;
    }
});

function applyTheme(nextTheme: string): void
{
    PrimeVue.changeTheme(currentTheme, nextTheme, "theme-link", () => {});
    currentTheme = nextTheme;

    if (currentTheme === darkTheme) {
        isDarkMode.value = true;
    } else {
        isDarkMode.value = false;
    }
}

function toggleTheme(): void
{
    let nextTheme = darkTheme;

    if (currentTheme === nextTheme) {
        nextTheme = lightTheme;
    }

    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
}

function openDrawer(): void
{
    isOpen.value = true;
    isClosed.value = false;
}
</script>

<template>
    <div class="h-full flex">
        <Toast />
        <MenuDrawer v-if="!hideMenu" v-model:isOpen="isOpen" v-model:isClosed="isClosed" >
            <MenuDrawerItem icon="bi-house-door" item="Home" :to="{ name: 'home' }" />
            <MenuDrawerItem v-if="auth.isVendor" icon="bi-book" item="Buchen" :to="{ name: 'booking' }" />
            <MenuDrawerItem v-if="auth.isAuthenticated" icon="bi-airplane" item="Flüge" :to="{ name: 'flights' }" />
            <MenuDrawerItem v-if="auth.isAdmin" icon="bi-people" item="Passagiere" :to="{ name: 'passengers' }" />
            <MenuDrawerItem v-if="auth.isAdmin" icon="bi-gear" item="Einstellungen" :to="{ name: 'settings.overview' }" />
        </MenuDrawer>
        <div id="content" class="h-full w-full flex flex-column overflow-hidden">
            <MenuTopbar v-if="!hideMenu" v-model:isDarkMode="isDarkMode" :isMenuVisible="isClosed" @toggleTheme="toggleTheme()" @openDrawer="openDrawer()" />
            <div class="flex-grow-1 flex flex-column overflow-auto">
                <RouterView class="flex-grow-1 ml-2 md:ml-4 mr-2 md:mr-4 mb-2" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
// ToDo: Fix layout in mobile landscape - MenuDrawer doesnt overlay correctly on certain devices
</style>
