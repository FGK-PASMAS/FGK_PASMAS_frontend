<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <RouterLink class="menu-logo-link" to="/">
        <div class="menu-logo">
            <i class="bi-feather menu-icon"/>
            <h1>PASMAS</h1>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
    .menu-logo-link {
        color: inherit;
        text-decoration: none;
    }

    .menu-logo {
        display: flex;
        align-items: center;
        gap: 10px;
    }
</style>
