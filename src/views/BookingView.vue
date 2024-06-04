<script setup lang="ts">
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import BookingFlights from "@/components/BookingFlights.vue";
import BookingPassengers from "@/components/BookingPassengers.vue";
import BookingResult from "@/components/BookingResult.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import TransitionLoading from "@/components/TransitionLoading.vue";
import { parseAPIResponse } from "@/core/composables/useFetch";
import type { MenuStepperItemInterface } from "@/core/interfaces/MenuStepperItemInterface";
import { InfoToast } from '@/core/toasts/InfoToast';
import { WarningToast } from "@/core/toasts/WarningToast";
import type { Division } from "@/data/division/division.interface";
import { FlightEventHandler } from "@/data/flight/flight.eventHandler";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { getFlightsByDivisionStream } from "@/data/flight/flight.service";
import { type Passenger } from "@/data/passenger/passenger.interface";
import { PlaneEventHandler } from "@/data/plane/plane.eventHandler";
import { getPlanesStream } from "@/data/plane/plane.service";
import { useAuthStore } from "@/stores/authStore";
import { useBookingStore } from '@/stores/bookingStore';
import type { EventSource } from "extended-eventsource";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onUnmounted, ref, toRaw, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const auth = useAuthStore();
const booking = useBookingStore();
const bookedFlight: Ref<Flight | undefined> = ref();

// Observers to watch changes to the booking state due to administrator intervention
let bookedFlightEventSource: EventSource | undefined;
const bookedFlightEventHandler = new FlightEventHandler();

let bookedPlaneEventSource: EventSource | undefined;
const bookedPlaneEventHandler = new PlaneEventHandler();

// Remember previous setting to offer the possiblity to revert
let prevDivision: Division | undefined;
let prevSeats: Passenger[] | undefined;

const stepper = ref();
const toast = useToast();

const items: MenuStepperItemInterface[] = [
    { 
        key: "passengers",
        label: "Passagiere",
        icon: "bi-people",
        component: BookingPassengers
    }, { 
        key: "flights",
        label: "Flug",
        icon: "bi-airplane",
        component: BookingFlights
    }, { 
        key: "confirmation",
        label: "Buchung",
        icon: "bi-check-lg",
        component: BookingConfirmation
    }
];

const isDataLoaded = ref(true);
const isAllowedToLeave = ref(false);
const isBookingExistsDialogOpen = ref(false);
const isBookingValidDialogOpen = ref(false);
const isNavDialogOpen = ref(false);
const isNextNavEnabled = ref(false);

const bookingDivisionInvalidMsg = "Durch die Änderung des Flugtypes wird die aktuelle Reservierung storniert. Fortfahren?";
const bookingWeightInvalidMsg = "Durch die Gewichtsänderung ist die aktuelle Reservierung nicht mehr valide. Soll die Reservierung storniert werden?";
const bookingInvalidMsg = ref("");

onBeforeMount(async () => {
    booking.resetStore();

    const existingBooking = localStorage.getItem("booking");

    if (!existingBooking) {
        return;
    }

    const existingBookingParsed = parseAPIResponse(JSON.parse(existingBooking));

    booking.division = existingBookingParsed.division;
    booking.seats = existingBookingParsed.seats ?? [];
    booking.flight = existingBookingParsed.flight;

    prevDivision = existingBookingParsed.division;
    prevSeats = existingBookingParsed.seats ?? [];

    if (booking.flight) {
        if (DateTime.now() >= booking.flight.DepartureTime!) {
            await booking.cancelBooking(toast);
        }
    }

    if (!booking.isEmpty) {
        isBookingExistsDialogOpen.value = true;
    }
});

onUnmounted(() => {
    stopBookingOberservers();
});

onBeforeRouteLeave(async () => {
    if (booking.isEmpty) {
        isAllowedToLeave.value = true;
    } else {
        isNavDialogOpen.value = true;
    }

    if (isAllowedToLeave.value) {
        await booking.cancelBooking(toast);

        localStorage.removeItem("booking");
        window.removeEventListener("beforeunload", onBeforeUnload);
    }
});

booking.$subscribe((mutation, state) => {
    if(!state.flight || state.flight.Status === FlightStatus.BOOKED) {
        stopBookingOberservers();
    } else {
        startBookingOberservers();
    }

    onBookingUpdate();
});

function startBookingOberservers(): void
{
    if (bookedFlightEventSource || bookedPlaneEventSource) {
        return;
    }

    // Obeserve flights
    bookedFlightEventSource = getFlightsByDivisionStream(booking.division!.ID!);

    bookedFlightEventSource.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (auth.user?.Username === message?.actionUser?.Username) {
            return;
        }

        if (booking.flight?.ID !== message?.data?.ID) {
            return;
        }

        if (message.action === "DELETED") {
            booking.resetStore();
        }

        await cancelBooking();

        toast.add(new WarningToast({ detail: "Vorgang wurde durch einen Administrator abgebrochen." }));
    }

    bookedFlightEventSource.onerror = () => {
        bookedFlightEventHandler.onErrorEvent(toast);
    }

    // Observe planes
    bookedPlaneEventSource = getPlanesStream();

    bookedPlaneEventSource.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (auth.user?.Username === message?.actionUser?.Username) {
            return;
        }

        if (booking.flight?.Plane?.ID !== message?.data?.ID) {
            return;
        }

        await cancelBooking();

        toast.add(new WarningToast({ detail: "Vorgang wurde durch einen Administrator abgebrochen." }));
    }

    bookedPlaneEventSource.onerror = () => {
        bookedPlaneEventHandler.onErrorEvent(toast);
    }
}

function stopBookingOberservers(): void
{
    if (bookedFlightEventSource) {
        bookedFlightEventSource.close();
        bookedFlightEventSource = undefined;
    }

    if (bookedPlaneEventSource) {
        bookedPlaneEventSource.close();
        bookedPlaneEventSource = undefined;
    }
}

function onBeforeUnload(event: BeforeUnloadEvent): void
{
    event.preventDefault();
}

function onContinueExistingBooking(): void
{
    if (booking.isPassengersOk) {
        isNextNavEnabled.value = true;
    }
}

async function onCancelExistingBooking(): Promise<void>
{
    await booking.cancelBooking(toast);

    localStorage.removeItem("booking");
    window.removeEventListener("beforeunload", onBeforeUnload);
}

function onBookingUpdate(currentStep?: string): void
{
    if (booking.flight) {
        if (!booking.division || booking.division.ID != prevDivision!.ID) {
            bookingInvalidMsg.value = bookingDivisionInvalidMsg;
            isBookingValidDialogOpen.value = true;
            return;
        }
    }

    if (!booking.isPassengersWeightOk) {
        bookingInvalidMsg.value = bookingWeightInvalidMsg;
        isBookingValidDialogOpen.value = true;
        return;
    }

    localStorage.setItem("booking", JSON.stringify({
        "division": booking.division,
        "seats": booking.seats,
        "flight": booking.flight
    }));

    if (!booking.isEmpty) {
        window.addEventListener("beforeunload", onBeforeUnload);
    } else {
        window.removeEventListener("beforeunload", onBeforeUnload);
    }

    if (!stepper.value) {
        return;
    }

    if (!currentStep) {
        currentStep = stepper.value.getCurrentStepKey();
    }

    isNextNavEnabled.value = false;

    switch (currentStep) {
        case "passengers":
            if (booking.isPassengersOk) {
                isNextNavEnabled.value = true;
            }

            break;
        case "flights":
            if(booking.isFlightOk) {
                isNextNavEnabled.value = true;
            }

            break;
        case "confirmation":
            if (booking.isConfirmationOk) {
                isNextNavEnabled.value = true;
            }

            break;
    }
}

function onStepChanged(currentStep: string): void
{
    // Clone object - structuredClone doesn't work on Luxon objects currently
    prevDivision = parseAPIResponse(JSON.parse(JSON.stringify((toRaw(booking.division)))));
    prevSeats = parseAPIResponse(JSON.parse(JSON.stringify((toRaw(booking.seats)))));

    onBookingUpdate(currentStep);
}

async function confirmFlightCancellation(): Promise<void>
{
    const deletedFlight = await booking.cancelFlight(toast);
    const departure = deletedFlight!.DepartureTime!.toFormat("HH:mm dd.LL.yyyy");
    
    toast.add(new InfoToast({ detail: "Reservierung um " + departure + " wurde storniert." }));
}

function cancelFlightCancellation(): void
{
    if (!prevDivision || !prevSeats) {
        return;
    }

    booking.division = parseAPIResponse(JSON.parse(JSON.stringify(prevDivision)));
    booking.seats = parseAPIResponse(JSON.parse(JSON.stringify(prevSeats)));
}

async function confirmBooking(): Promise<void>
{
    stopBookingOberservers();

    isDataLoaded.value = false;
    bookedFlight.value = await booking.confirmBooking(toast);
    isDataLoaded.value = true;

    isAllowedToLeave.value = true;
    localStorage.removeItem("booking");
    window.removeEventListener("beforeunload", onBeforeUnload);
}

async function cancelBooking(): Promise<void>
{
    await booking.cancelBooking(toast);

    prevDivision = undefined;
    prevSeats = undefined;

    localStorage.removeItem("booking");
    window.removeEventListener("beforeunload", onBeforeUnload);
    stepper.value.resetStepper();

    showCancelBookingToast();
}

function showCancelBookingToast(): void
{
    toast.add(new InfoToast({ detail: "Buchung wurde abgebrochen "}));
}
</script>

<template>
<main class="flex flex-column overflow-hidden">
    <div class="flex-grow-1 flex flex-column overflow-auto">
        <div class="flex justify-content-between mb-1">
            <ContentHeader title="Buchen" />
            <PrimeButton v-if="isDataLoaded && (booking.flight?.Status === undefined || booking.flight?.Status === FlightStatus.RESERVED)" 
                type="button" 
                text 
                class="align-self-center text-color mr-1" 
                @click="cancelBooking()">
                Abbrechen
            </PrimeButton>
        </div>
        <TransitionLoading :isDataLoaded="isDataLoaded" class="flex-grow-1 flex overflow-hidden">
            <MenuStepper v-if="isDataLoaded && (booking.flight?.Status === undefined || booking.flight?.Status === FlightStatus.RESERVED)"
                ref="stepper" 
                :items="items" 
                :isNextNavEnabled="isNextNavEnabled"  
                @stepChanged="onStepChanged" 
                @confirm="confirmBooking()"
                class="flex-grow-1"
            />
            <BookingResult v-else-if="isDataLoaded && booking.flight?.Status === FlightStatus.BOOKED" :flight="bookedFlight" />
        </TransitionLoading>
    </div>
    <ConfirmDialog
        v-model:isOpen="isBookingExistsDialogOpen"
        description="Es ist eine Buchung vorhanden. Möchtest du mit dieser fortfahren?"
        @confirm="onContinueExistingBooking()"
        @cancel="onCancelExistingBooking()"
    />
    <ConfirmDialog
        v-model:isOpen="isBookingValidDialogOpen"
        :description="bookingInvalidMsg"
        @confirm="confirmFlightCancellation()"
        @cancel="cancelFlightCancellation()"
    />
    <NavigationGuardDialog 
        v-model:isOpen="isNavDialogOpen" 
        v-model:isAllowedToLeave="isAllowedToLeave" 
        description="Du bist gerade dabei den Buchungsprozess zu verlassen. Bist du sicher?" 
        @confirm="showCancelBookingToast()" 
    />
</main>
</template>

<style scoped lang="scss">
</style>
