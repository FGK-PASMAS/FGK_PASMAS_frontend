<script setup lang="ts">
import { authStore } from "@/stores/auth";
import InputSwitch from "primevue/inputswitch";
import { RouterLink, useRouter } from "vue-router";
import MenuLogo from "./MenuLogo.vue";
import { useToast } from "primevue/usetoast";
import { InfoToast } from "@/utils/toasts/info.toast";

const router = useRouter();
const auth = authStore();
const toast = useToast();

const isDarkMode = defineModel("isDarkMode", { 
    type: Boolean, 
    default: false 
});

defineProps({
    isMenuVisible: { 
        type: Boolean, 
        default: true 
    }
});

defineEmits([
    "openDrawer",
    "toggleTheme"
]);

function logout(): void
{
    auth.revoke();
    router.push({name: "home" });

    toast.add(new InfoToast({detail: "Du wurdest erfolgreich abgemeldet!"}));
}
</script>

<template>
    <header class="topbar flex justify-content-between align-items-center pt-1 pr-2 pb-1 pl-2 z-2">
        <div class="topbar-logo flex align-items-center" :class="{ 'visible': isMenuVisible }">
            <PrimeButton type="Button" class="btn-no-shadow text-6xl" icon="bi-filter-left" text rounded @click="$emit('openDrawer')" />
            <MenuLogo />
        </div>
        <div class="flex gap-4">
            <div class="flex align-items-center gap-2">
                <i v-if="isDarkMode" class="bi-moon" />
                <i v-if="!isDarkMode" class="bi-sun" />
                <InputSwitch class="mr-2" v-model="isDarkMode" @click="$emit('toggleTheme')" />
            </div>            
            <RouterLink v-if="!auth.isAuthenticated" to="login">
                <PrimeButton icon="bi-person-fill" label="Login" rounded class="text-color" />
            </RouterLink>
            <div v-else class="flex align-items-center gap-2">
                <span>{{ auth.user?.Username }}</span>
                <PrimeButton icon="bi-box-arrow-right" severity="danger" rounded @click="logout()" class="text-color" />
            </div>
        </div>
    </header>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.topbar {
    background-color: var(--surface-50);
    opacity: 0.95;
}

@media screen and (min-width: $md) {
    .topbar-logo {
        visibility: hidden;
    }
}
</style>
