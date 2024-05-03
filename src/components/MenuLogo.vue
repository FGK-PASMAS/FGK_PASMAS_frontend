<script setup lang="ts">
import { RouterLink } from "vue-router";

const appIcon = import.meta.env.VITE_APP_ICON;
const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
    <RouterLink class="menu-logo w-min" :to="{ name: 'home' }">
        <div class="w-min flex align-items-center gap-2">
            <i :class="appIcon" />
            <span class="font-bold text-2xl">{{ appName }}</span>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
    .menu-logo {
        color: inherit;
        text-decoration: none;
    }
</style>
