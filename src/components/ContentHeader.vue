<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
    title: { 
        type: String,
        required: true 
    }
});
</script>

<template>
    <header class="flex align-items-center gap-5">
        <PrimeButton type="button" class="text-4xl btn-no-shadow" icon="bi-arrow-left" text rounded @click="router.back()" />
        <h1>{{ title }}</h1>
    </header>
</template>

<style scoped lang="scss">
h1 {
    margin: 1rem 0;
}
</style>
