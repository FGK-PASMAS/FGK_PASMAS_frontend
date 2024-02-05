<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const icon = import.meta.env.VITE_APP_ICON;
</script>

<template>
    <div class="h-full flex flex-column justify-content-center align-items-center gap-6">
        <i class="text-8xl" :class="icon" />
        <div class="text-center">
            <p class="text-4xl font-bold">Error 404</p>
            <p class="text-2xl font-bold">Page not found</p>
            <PrimeButton type="button" class="text-color font-bold" @click="router.replace({ name: 'home' });">Zurück</PrimeButton>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .error-page i {
        font-size: 8rem;
    }

    .error-page p {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0px;
    }
</style>
