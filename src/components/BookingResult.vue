<script setup lang="ts">
import type { Flight } from '@/data/flight/flight.interface';
import { bookingStore } from '@/stores/booking';
import type { PropType } from 'vue';

const booking = bookingStore();

defineProps({
    flight: {
        type: Object as PropType<Flight>
    }
});

function newBooking(): void
{
    booking.resetStore();
}
</script>

<template>
    <div class="h-full flex flex-column">
        <div class="flex-grow-1">
            <span>Ergebnis der Buchung hier!</span>
        </div>
        <PrimeDivider />
        <PrimeButton type="button" class="flex justify-content-center text-color font-bold" @click="newBooking()">Neue Buchung erfassen</PrimeButton>
    </div>
</template>

<style scoped lang="scss">
</style>
