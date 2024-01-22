<script setup lang="ts">
import { bookingStore } from '@/stores/booking';

const store = bookingStore();
</script>

<template>
    <h4>Reservierung hier!</h4>
    <span>{{ store.passengers.length }} Passagier(e) mit Gesamtgewicht {{ store.totalWeight }}kg</span>
</template>

<style scoped lang="scss">
</style>
