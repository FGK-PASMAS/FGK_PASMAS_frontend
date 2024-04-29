<script setup lang="ts">
import MenuLogo from "./MenuLogo.vue";

const appName = import.meta.env.VITE_APP_NAME;
const appVersion = import.meta.env.VITE_APP_VERSION;

const isOpen = defineModel("isOpen", { 
        type: Boolean,
        default: false
});

const isClosed = defineModel("isClosed", { 
    type: Boolean, 
    default: false 
});

function closeDrawer(): void
{
    isClosed.value = true;
    isOpen.value = false;
}
</script>

<template>
    <div class="h-full z-3">
        <div class="shade md:hidden" :class="{ 'hidden': !isOpen }" @click="closeDrawer()"></div>
        <div class="drawer h-full md:static fixed flex-shrink-0 flex flex-column justify-content-between min-w-max" :class="{ 'closed': isClosed, 'open': isOpen }">
            <div class="flex flex-column">
                <div class="flex justify-content-between align-items-center pt-1 pr-2 pb-1 pl-2">
                    <MenuLogo />
                    <PrimeButton type="button" class="btn-no-shadow" icon="bi-x-lg" text rounded @click="closeDrawer()" />
                </div>
                <div class="p-2">
                    <slot></slot>
                </div>
            </div>
            <div class="p-2">
                <PrimeDivider />
                <div class="text-center">
                    <p>v{{ appVersion }}</p>
                    <i class="bi-c-circle" />
                    <span>{{ " " + appName }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

$menu-drawer-width: 256px;

.shade {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.drawer {
    width: $menu-drawer-width;
    background-color: var(--surface-100);
    margin-left: calc(-1 * $menu-drawer-width);
    transition: margin-left 0.3s ease;
}

.open {
    margin-left: 0;
    transition: margin-left 0.3s ease;
}

@media screen and (min-width: $md) {
    .drawer {
        margin-left: 0;
        transition: margin-left 0.3s ease;
    }

    .closed {
        margin-left: calc(-1 * $menu-drawer-width);
        transition: margin-left 0.3s ease;
    }
}
</style>
