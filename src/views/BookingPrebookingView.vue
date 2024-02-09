<script setup lang="ts">
import BookingInfoMinimal from "@/components/BookingInfoMinimal.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { getFlights } from "@/data/flight/flight.service";
import { getPlanes } from "@/data/plane/plane.service";
import { bookingStore } from "@/stores/booking";
import { flightsStore } from "@/stores/flights";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";

const toast = useToast();

const booking = bookingStore();
const flights = flightsStore();

onMounted(async () => {
    flights.resetStore();

    flights.planes = await useValidateAPIData(getPlanes({
        byDivisionId: booking.division!.ID!,
        includePrefPilot: true,
        includePilots: true,
        includeFlights: true
    }), toast);

    flights.existingFlights = await useValidateAPIData(getFlights({
        byDivisionId: booking.division!.ID!,
        includePlane: true,
        includePilot: true,
        includePassengers: true,
    }), toast);
});
</script>

<template>
    <div class="flex flex-column gap-4 overflow-hidden">
        <BookingInfoMinimal />
        <div class="overflow-auto">
            
            <div v-for="flight in flights.flights" :key="flight.ID" class="flex gap-4">
                <span>{{ flight?.Status }}</span>
                <span>{{ flight.DepartureTime.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                <span>{{ flight.ArrivalTime.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                <span>{{ flight.Plane?.AircraftType }}</span>
                <span>{{ flight.Plane?.Registration }}</span>
                <span>{{ flight.Plane?.MTOW }}</span>
                <span>{{ flight.Plane?.MaxSeatPayload }}</span>
            </div>

        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
