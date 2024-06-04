<script setup lang="ts">
import AppDialog from "@/components/AppDialog.vue";
import FlightInfo from "@/components/FlightInfo.vue";
import FlightInfoMinimal from "@/components/FlightInfoMinimal.vue";
import { useValidateAPIData } from "@/core/composables/useValidateAPIData";
import { FlightEventHandler } from "@/data/flight/flight.eventHandler";
import type { Flight } from "@/data/flight/flight.interface";
import { getFlights, getFlightsByDivisionStream } from "@/data/flight/flight.service";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getPlanes } from "@/data/plane/plane.service";
import { useBookingStore } from '@/stores/bookingStore';
import { useFlightStore } from "@/stores/flightStore";
import { EventSource } from "extended-eventsource";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref } from "vue";
import FlightTicket from "./FlightTicket.vue";
import TransitionLoading from "./TransitionLoading.vue";

const toast = useToast();

const booking = useBookingStore();
const flights = useFlightStore();

let eventSource: EventSource;
const eventHandler = new FlightEventHandler();

const isDataLoaded = ref(false);
const flightIndex = ref(0);
const isFlightInfoOpen = ref(false);
const noFlightsMsg = "Es konnten keine Flüge ermittelt werden. Das liegt oft daran, dass der Flugzeitraum abgelaufen ist. Bitte wende dich an deinen Administrator!";

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

function getPassengers(flight: Flight): Passenger[]
{
    if (flight.Passengers && flight.Passengers.length > 0) {
        return flight.Passengers;
    }

    return booking.passengers;
}

function openFlightInfo(index: number): void
{
    flightIndex.value = index;
    isFlightInfoOpen.value = true;
}

function onFlightInfoEvent(): void
{
    isFlightInfoOpen.value = false;
}
</script>

<template>
    <div class="flex flex-column gap-3 overflow-hidden">
        <FlightInfoMinimal />
        <div class="relative flex-grow-1 overflow-auto">
            <TransitionLoading v-if="flights.flights.length > 0" :isDataLoaded="isDataLoaded">
                <FlightTicket v-for="(flight, index) in flights.flights" :key="index" v-model:flight="flights.flights[index]" class="mt-1 mb-1" @showInfo="openFlightInfo(index)" />
            </TransitionLoading>
            <div v-else>
                {{ noFlightsMsg }}
            </div>
        </div>
        <AppDialog v-model:isOpen="isFlightInfoOpen">
            <FlightInfo :isBooking="true" :division="booking.division" :passengers="getPassengers(flights.flights[flightIndex])" v-model:flight="flights.flights[flightIndex]" @flightReserved="onFlightInfoEvent()" @flightCanceled="onFlightInfoEvent()" />
        </AppDialog>
    </div>
</template>

<style scoped lang="scss">
</style>
