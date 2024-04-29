<script setup lang="ts">
import InputSwitch from "primevue/inputswitch";
import { RouterLink } from "vue-router";
import MenuLogo from "./MenuLogo.vue";

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
</script>

<template>
    <header class="topbar flex justify-content-between align-items-center pt-1 pr-2 pb-1 pl-2 z-2">
        <div class="topbar-logo flex align-items-center" :class="{ 'visible': isMenuVisible }">
            <PrimeButton type="Button" class="btn-no-shadow text-6xl" icon="bi-filter-left" text rounded @click="$emit('openDrawer')" />
            <MenuLogo />
        </div>
        <div class="flex gap-2">
            <div class="flex align-items-center gap-2">
                <i v-if="isDarkMode" class="bi-moon" />
                <i v-if="!isDarkMode" class="bi-sun" />
                <InputSwitch class="mr-2" v-model="isDarkMode" @click="$emit('toggleTheme')" />
            </div>            
            <RouterLink class="text-color no-underline bg-primary pr-3 pl-3 border-round-3xl" to="login">
                <div class="flex align-items-center gap-2 p-2 border-round-sm">
                    <i class="bi-person-fill text-2xl"/>
                    <span class="font-bold">Login</span>
                </div>
            </RouterLink>
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
