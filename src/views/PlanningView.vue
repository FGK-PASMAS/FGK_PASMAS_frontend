<script setup lang="ts">
import { type MenuItem } from 'primevue/menuitem';
import ContentHeader from '@/components/ContentHeader.vue';
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
        <ContentHeader title="Planung" />
        <MenuStepper :items="items" />
    </main>
</template>

<style lang="scss">
</style>
