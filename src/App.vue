<script setup lang="ts">
import { onBeforeMount, onErrorCaptured, ref } from "vue";
import { useRouter } from "vue-router";
import { usePrimeVue } from "primevue/config";
import Toast from "primevue/toast";
import MenuDrawer from "./components/MenuDrawer.vue";
import MenuItem from "./components/MenuItem.vue";
import MenuTopbar from "./components/MenuTopbar.vue";

const router = useRouter();
const PrimeVue = usePrimeVue();

// Error Handling
const hasError = ref(false);
const errorMessage = ref("");

// Theme
const lightTheme = "lara-light-green";
const darkTheme = "lara-dark-green";
const isDarkMode = ref(false);
let currentTheme = lightTheme;
let localTheme: string | null;

// MenuDrawer
const isOpen = ref(false);
const isClosed = ref(false);

// Not Found
const isNotFound = ref(false);

onErrorCaptured((error) => {
    console.log("Error catched in App component");
    
    hasError.value = true;
    errorMessage.value = error.message;
});

onBeforeMount(() => {
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
    if (to.name === "notFound") {
        isNotFound.value = true;
    } else {
        isNotFound.value = false;
    }
});

function closeErrorMessage(): void
{
    hasError.value = false;
    errorMessage.value = "";
}

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
        <MenuDrawer v-if="!isNotFound" v-model:isOpen="isOpen" v-model:isClosed="isClosed" >
            <MenuItem icon="bi-book" item="Buchen" to="/" />
            <MenuItem icon="bi-airplane" item="Flüge" to="/flights" />
            <MenuItem icon="bi-people" item="Passagiere" to="/passengers" />
            <MenuItem icon="bi-gear" item="Einstellungen" to="/settings" />
        </MenuDrawer>
        <PrimeScrollPanel style="height: 100%; width: 100%;">
            <MenuTopbar v-if="!isNotFound" :is-menu-visible="isClosed" v-model="isDarkMode" @toggleTheme="toggleTheme()" @openDrawer="openDrawer()" />
            <PrimeMessage v-if="hasError" class="ml-2 md:ml-8 mr-2 md:mr-8" severity="error" @close="closeErrorMessage()">{{ errorMessage }}</PrimeMessage>
            <RouterView class="ml-2 md:ml-8 mr-2 md:mr-8 mb-4" />
        </PrimeScrollPanel>
    </div>
</template>

<style lang="scss">
</style>
