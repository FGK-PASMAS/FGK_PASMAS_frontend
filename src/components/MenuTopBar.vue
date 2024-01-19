<script setup lang="ts">
import InputSwitch from "primevue/inputswitch";
import MenuLogo from "./MenuLogo.vue";

const isLightMode = defineModel({ 
    type: Boolean, 
    default: true 
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
    <header class="topbar sticky top-0 left-0 flex justify-content-between align-items-center p-2 z-2">
        <div class="topbar-menu flex align-items-center" :class="{ 'topbar-menu-visible': isMenuVisible }">
            <PrimeButton class="btn-no-shadow text-6xl" icon="bi-filter-left" text rounded @click="$emit('openDrawer')" />
            <MenuLogo />
        </div>
        <div class="flex align-items-center gap-2">
            <i v-if="!isLightMode" class="bi-moon" />
            <i v-if="isLightMode" class="bi-sun" />
            <InputSwitch class="mr-2" v-model="isLightMode" @click="$emit('toggleTheme')" />
        </div>
    </header>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.topbar {
    background-color: var(--surface-50);
}

@media screen and (min-width: $md) {
    .topbar-menu {
        visibility: hidden;
    }
}

.topbar-menu-visible {
    visibility: visible;
}
</style>
