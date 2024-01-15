<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
    router.back();
}
</script>

<template>
    <div class="error-page">
        <i class="bi-feather"/>
        <p>Error 404</p>
        <p>Page not found</p>
        <PrimeButton @click="goBack()">Zurück</PrimeButton>
    </div>
</template>

<style scoped>
    .error-page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }

    .error-page i {
        font-size: 8rem;
    }

    .error-page p {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0px;
    }
</style>
