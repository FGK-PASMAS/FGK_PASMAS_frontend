<script setup lang="ts">
import FlightInfoMinimal from "@/components/FlightInfoMinimal.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { FlightEventHandler } from "@/data/flight/flight.eventHandler";
import { type Flight } from "@/data/flight/flight.interface";
import { createFlight, getFlights, getFlightsByDivisionStream } from "@/data/flight/flight.service";
import { getPlanes } from "@/data/plane/plane.service";
import { bookingStore } from "@/stores/booking";
import { flightsStore } from "@/stores/flights";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref } from "vue";

const toast = useToast();

const booking = bookingStore();
const flights = flightsStore();

const eventHandler = new FlightEventHandler();
let eventSource: EventSource;

const isDataLoaded = ref(false);

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

    eventSource = getFlightsByDivisionStream(booking.division!.ID!);

    eventSource.onopen = async () => {
            flights.existingFlights = await useValidateAPIData(getFlights({
            byDivisionId: booking.division!.ID!,
            includePlane: true,
            includePilot: true,
            includePassengers: true,
        }), toast);
    }

    eventSource.onmessage = (event) => {
        eventHandler.onEntityEvent(event, flights.existingFlights, toast);
    }

    eventSource.onerror = () => {
        eventHandler.onErrorEvent(toast);
    }

    isDataLoaded.value = true;
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

// ToDo: Implement functionality
async function test(flight: Flight)
{
    const reservedFlight = await useValidateAPIData(createFlight(flight), toast);
    booking.flight = reservedFlight;
}
</script>

<template>
    <div class="flex flex-column gap-4 overflow-hidden">
        <FlightInfoMinimal />
        <div class="relative w-full h-full overflow-auto">
            <Transition>
            <div v-if="isDataLoaded">
                
                <!--ToDo: Implement component-->
                <div v-for="(flight, index) in flights.flights" :key="index" class="flex flex-wrap gap-4 p-1 border-1 ">
                    <span>{{ flight?.Status }}</span>
                    <span>{{ flight.DepartureTime!.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                    <span>{{ flight.ArrivalTime!.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                    <span>{{ flight.Plane?.AircraftType }}</span>
                    <span>{{ flight.Plane?.Registration }}</span>
                    <span>{{ flight.Plane?.MTOW }}</span>
                    <span>{{ flight.Plane?.MaxSeatPayload }}</span>
                    <PrimeButton @click="test(flight)" :disabled="booking.flight">Reservieren (Test)</PrimeButton>
                </div>
                <!--ToDo: Implement component-->

            </div>
            <div v-else class="absolute top-0 w-full h-full flex justify-content-center align-items-center surface-100 border-round">
                <PrimeProgressSpinner strokeWidth="4" />
            </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>
