<script setup lang="ts">
import { bookingStore } from '@/stores/booking';

const store = bookingStore();
</script>

<template>
    <h4>Reservierung hier!</h4>
    <span v-if="store.passengers.length === 1">{{ store.passengers.length }} Passagier mit Gesamtgewicht {{ store.totalWeight }}kg</span>
    <span v-else>{{ store.passengers.length }} Passagiere mit Gesamtgewicht {{ store.totalWeight }}kg</span>
</template>

<style scoped lang="scss">
</style>
