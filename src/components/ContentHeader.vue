<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps([
    "title"
]);
</script>

<template>
    <header class="flex align-items-center gap-5 mb-2">
        <PrimeButton class="text-4xl btn-no-shadow" icon="bi-arrow-left" text rounded @click="router.back()" />
        <h1>{{ title }}</h1>
    </header>
</template>

<style lang="scss">
</style>
