<script setup lang="ts">
import type { Flight } from '@/data/flight/flight.interface';
import { useBookingStore } from '@/stores/bookingStore';
import type { PropType } from 'vue';

const booking = useBookingStore();

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
    <div class="flex-grow-1 h-full flex flex-column">
        <h3>Buchung erfolgreich!</h3>
        <div class="flex-grow-1 flex flex-column gap-5">
            <div class="flex flex-column gap-1">
                <div class="flex align-items-center gap-2">
                    <i class="bi-ticket-fill text-xl" />
                    <h4 class="m-0">Tickets</h4>
                </div>
                <div v-for="(passenger, index) in flight!.Passengers!" :key="index" class="flex align-items-center gap-2 ml-3">
                    <i class="bi-ticket-detailed-fill text-xl" />
                    <span class="font-bold">#{{ passenger.PassNo }}</span>
                    <span>-</span>
                    <span>{{ passenger.LastName }}, {{ passenger.FirstName }}</span>
                </div>
            </div>
            <div class="flex flex-column gap-1">
                <div class="flex align-items-center gap-2">
                    <i class="bi-clock-fill text-xl" />
                    <h4 class="m-0">Flug #{{ flight!.FlightNo }}</h4>
                </div>
                <div class="flex flex-wrap gap-2 ml-3">
                    <span>{{ flight!.DepartureTime!.toFormat("HH:mm") }}</span>
                    <span>-</span>
                    <span>{{ flight!.ArrivalTime!.toFormat("HH:mm") }}</span>
                    <span>|</span>
                    <span>{{ flight!.DepartureTime!.toFormat("cccc, dd LLLL yyyy") }}</span>
                </div>
            </div>
            <div v-if="flight!.Description" class="flex gap-2">
                <i class="bi-info-circle-fill" />
                <span class="word-break-all">{{ flight!.Description }}</span>
            </div>
            <div class="flex flex-column gap-1">
                <div class="flex align-items-center gap-2">
                    <i class="bi-airplane-fill text-xl" />
                    <h4 class="m-0">Flugzeug</h4>
                </div>
                <span class="ml-3">{{ flight!.Plane!.AircraftType }} ({{ flight!.Plane!.Registration }})</span>
            </div>
        </div>
        <PrimeDivider />
        <PrimeButton type="button" class="flex justify-content-center text-color font-bold" @click="newBooking()">Neue Buchung erfassen</PrimeButton>
    </div>
</template>

<style scoped lang="scss">
</style>
