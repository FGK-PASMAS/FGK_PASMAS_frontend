<script setup lang="ts">
import { ref } from 'vue';
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
const isNextDisabled = ref(true);
</script>

<template>
    <main>
        <ContentHeader title="Planung" />
        <MenuStepper :items="items" :is-next-disabled="isNextDisabled" />
    </main>
</template>

<style lang="scss">
</style>
