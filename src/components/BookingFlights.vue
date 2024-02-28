<script setup lang="ts">
import FlightInfoMinimal from "@/components/FlightInfoMinimal.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { FlightEventHandler } from "@/data/flight/flight.eventHandler";
import { type Flight } from "@/data/flight/flight.interface";
import { createFlight, deleteFlight, getFlights, getFlightsByDivisionStream } from "@/data/flight/flight.service";
import { getPlanes } from "@/data/plane/plane.service";
import { bookingStore } from "@/stores/booking";
import { flightsStore } from "@/stores/flights";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const toast = useToast();

const booking = bookingStore();
const flights = flightsStore();

let eventSource: EventSource;
const eventHandler = new FlightEventHandler();

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
import AppDialog from "@/components/AppDialog.vue";
import FlightInfo from "@/components/FlightInfo.vue";

const flightTest: Ref<Flight | undefined> = ref();
const flightInfoOpenTest = ref(false);

async function reserveTest(flight: Flight)
{
    const reservedFlight = await useValidateAPIData(createFlight(flight), toast);
    booking.flight = reservedFlight;
}

async function cancelPersistedTest(flight: Flight)
{
    const response = await useValidateAPIData(deleteFlight(flight), toast);

    if (response) {
        booking.flight = undefined;
    }
}

function onReservedFlightTest(flight: Flight)
{
    flightInfoOpenTest.value = false;
    booking.flight = flight; 
}

function openInfoTest(flight: Flight)
{
    flightTest.value = flight;
    flightInfoOpenTest.value = true;
}

function cancelTest()
{
    flightInfoOpenTest.value = false; 
    booking.flight = undefined;
}
</script>

<template>
    <div class="flex flex-column gap-3 overflow-hidden">
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
                    <PrimeButton v-if="flight.Status === 'RESERVED'" severity="danger" @click="cancelPersistedTest(flight)">Stornieren (Test)</PrimeButton>
                    <PrimeButton v-else @click="reserveTest(flight)" :disabled="flight?.Status !== 'OK'">Reservieren (Test)</PrimeButton>
                    <PrimeButton @click="openInfoTest(flight)">Info (Test)</PrimeButton>
                </div>
                <AppDialog v-model:isOpen="flightInfoOpenTest">
                    <FlightInfo :division="booking.division" :passengers="booking.passengers" :flight="flightTest" @flightReserved="(reservedFlight) => onReservedFlightTest(reservedFlight)" @flightCanceled="cancelTest()" />
                </AppDialog>
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
