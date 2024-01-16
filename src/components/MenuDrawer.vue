<script setup lang="ts">
import MenuLogo from './MenuLogo.vue';

const name = import.meta.env.VITE_APP_NAME;
const version = import.meta.env.VITE_APP_VERSION;
const isOpen = defineModel({ type: Boolean, default: true});

function closeDrawer()
{
    isOpen.value = false;
}
</script>

<template>
    <div class="drawer h-full flex flex-column min-w-max z-5" :class="{ 'open': isOpen, 'closed': !isOpen }">
        <div class="flex justify-content-between align-items-center p-2">
            <MenuLogo />
            <PrimeButton class="btn-close" icon="bi-x-lg" text rounded aria-label="Close" @click="closeDrawer()" />
        </div>
        <div class="p-2">
            <slot></slot>
        </div>
        <div class="flex-grow-1"></div>
        <div class="p-2">
            <PrimeDivider />
            <div class="text-center">
                <p>v{{ version }}</p>
                <i class="bi-c-circle" />
                <span>{{ " " + name }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$menu-drawer-width: 256px;

.drawer {
    width: $menu-drawer-width;
    background-color: var(--surface-100);
}

.btn-close:focus {
    box-shadow: none;
}

.open {
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;
}

.closed {
    margin-left: calc(-1 * $menu-drawer-width);
    transition: margin-left 0.3s ease-in-out;
}
</style>
