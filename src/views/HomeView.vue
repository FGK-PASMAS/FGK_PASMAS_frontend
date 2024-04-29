<script setup lang="ts">
import { authStore } from '@/stores/auth';

const appName = import.meta.env.VITE_APP_NAME;

const auth = authStore();
</script>

<template>
    <main>
        <h1>Home</h1>
        <p v-if="!auth.isAuthenticated">Melde dich bitte an, falls du {{ appName }} nutzen möchtest!</p>
        <p v-else>Willkommen bei {{ appName }}!</p>
    </main>
</template>

<style scoped lang="scss">
h1 {
    margin: 1rem 0;
}
</style>
