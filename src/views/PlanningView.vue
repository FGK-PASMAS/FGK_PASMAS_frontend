<script setup lang="ts">
import { type MenuItem } from 'primevue/menuitem';
import MenuStepper from '@/components/MenuStepper.vue';

const items: MenuItem[] = [
    { 
        label: "Passagiere",
        icon: "bi-people",
        route: "passenger_data",
    }, { 
        label: "Reservierung",
        icon: "bi-airplane",
        route: "prebooking",
    }, { 
        label: "Buchung",
        icon: "bi-check-lg",
        route: "booking",
    }
];
</script>

<template>
    <main>
        <h1 class="mb-4">Planung</h1>
        <MenuStepper :items="items" />
    </main>
</template>

<style lang="scss">
</style>
