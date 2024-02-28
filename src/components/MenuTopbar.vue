<script setup lang="ts">
import InputSwitch from "primevue/inputswitch";
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
    <header class="topbar flex justify-content-between align-items-center pl-2 pr-2 z-2">
        <div class="not-visible flex align-items-center" :class="{ 'visible': isMenuVisible }">
            <PrimeButton type="Button" class="btn-no-shadow text-6xl" icon="bi-filter-left" text rounded @click="$emit('openDrawer')" />
            <MenuLogo />
        </div>
        <div class="flex align-items-center gap-2">
            <i v-if="isDarkMode" class="bi-moon" />
            <i v-if="!isDarkMode" class="bi-sun" />
            <InputSwitch class="mr-2" v-model="isDarkMode" @click="$emit('toggleTheme')" />
        </div>
    </header>
</template>

<style scoped lang="scss">
.topbar {
    background-color: var(--surface-50);
    opacity: 0.95;
}
</style>
