<script setup lang="ts">
import { RouterLink } from 'vue-router';

const icon = import.meta.env.VITE_APP_ICON;
const name = import.meta.env.VITE_APP_NAME;
</script>

<template>
    <RouterLink class="menu-logo" to="/">
        <div class="flex align-items-center gap-2">
            <i :class="icon" />
            <span class="font-bold text-2xl">{{ name }}</span>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
    .menu-logo {
        color: inherit;
        text-decoration: none;
    }
</style>
