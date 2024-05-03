<script setup lang="ts">
import AppDialog from "@/components/AppDialog.vue";
import FlightInfo from "@/components/FlightInfo.vue";
import FlightInfoMinimal from "@/components/FlightInfoMinimal.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { FlightEventHandler } from "@/data/flight/flight.eventHandler";
import { getFlights, getFlightsByDivisionStream } from "@/data/flight/flight.service";
import { getPlanes } from "@/data/plane/plane.service";
import { bookingStore } from "@/stores/booking";
import { flightsStore } from "@/stores/flights";
import { EventSource } from "extended-eventsource";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref } from "vue";
import FlightTicket from "./FlightTicket.vue";
import TransitionLoading from "./TransitionLoading.vue";

const toast = useToast();

const booking = bookingStore();
const flights = flightsStore();

let eventSource: EventSource;
const eventHandler = new FlightEventHandler();

const isDataLoaded = ref(false);
const flightIndex = ref(0);
const isFlightInfoOpen = ref(false);

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

function openFlightInfo(index: number): void
{
    flightIndex.value = index;
    isFlightInfoOpen.value = true;
}

function onFlightReservation(): void
{
    isFlightInfoOpen.value = false;
}

function onFlightCancellation(): void
{
    isFlightInfoOpen.value = false;
}
</script>

<template>
    <div class="flex flex-column gap-3 overflow-hidden">
        <FlightInfoMinimal />
        <div class="relative flex-grow-1 overflow-auto">
            <TransitionLoading :isDataLoaded="isDataLoaded">
                <FlightTicket v-for="(flight, index) in flights.flights" :key="index" v-model:flight="flights.flights[index]" class="mt-1 mb-1" @showInfo="openFlightInfo(index)" />
            </TransitionLoading>
        </div>
        <AppDialog v-model:isOpen="isFlightInfoOpen">
            <FlightInfo :division="booking.division" :passengers="booking.passengers" v-model:flight="flights.flights[flightIndex]" @flightReserved="onFlightReservation()" @flightCanceled="onFlightCancellation()" />
        </AppDialog>
    </div>
</template>

<style scoped lang="scss">
</style>
