<script setup lang="ts">
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import BookingFlights from "@/components/BookingFlights.vue";
import BookingPassengers from "@/components/BookingPassengers.vue";
import BookingResult from "@/components/BookingResult.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import type { Division } from "@/data/division/division.interface";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { PassengerAction, type Passenger } from "@/data/passenger/passenger.interface";
import { bookingStore } from "@/stores/booking";
import type { MenuStepperItemInterface } from "@/utils/interfaces/menuStepperItem.interface";
import { parseAPIResponse } from "@/utils/services/fetch.service";
import { InfoToast } from "@/utils/toasts/info.toast";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, ref, toRaw, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const booking = bookingStore();
const bookedFlight: Ref<Flight | undefined> = ref();

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

    if (!booking.flight) {
        if (booking.seats) {
            booking.seats.forEach(seat => {
                seat.Action = PassengerAction.CREATE;
            });

            prevSeats!.forEach(seat => {
                seat.Action = PassengerAction.CREATE;
            });
        }
    }

    if (booking.flight) {
        if (DateTime.now() >= booking.flight.DepartureTime!) {
            await booking.cancelBooking(toast);
        }
    }

    if (!booking.isEmpty) {
        isBookingExistsDialogOpen.value = true;
    }
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

booking.$subscribe(() => {
    onBookingUpdate();
});

function onBeforeUnload(event: BeforeUnloadEvent): void
{
    event.preventDefault();
}

function onContinueExistingBooking(): void
{
    if (booking.isPassengerStepOk) {
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

    if (!booking.isPassengerWeightOk) {
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
            if (booking.isPassengerStepOk) {
                isNextNavEnabled.value = true;
            }

            break;
        case "flights":
            if(booking.isFlightStepOk) {
                isNextNavEnabled.value = true;
            }

            break;
        case "confirmation":
            if (booking.isConfirmationStepOk) {
                isNextNavEnabled.value = true;
            }

            break;
    }
}

function onStepChanged(currentStep: string): void
{
    booking.updateFlightData(toast);

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
    <div class="flex-grow-1 flex flex-column overflow-hidden">
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
        <MenuStepper v-if="isDataLoaded && (booking.flight?.Status === undefined || booking.flight?.Status === FlightStatus.RESERVED)"
            ref="stepper" 
            :items="items" 
            :isNextNavEnabled="isNextNavEnabled" 
            class="flex-grow-1" 
            @stepChanged="onStepChanged" 
            @confirm="confirmBooking()"
        />
        <BookingResult v-else-if="isDataLoaded && booking.flight?.Status === FlightStatus.BOOKED" :flight="bookedFlight" />
    </div>
    <Transition name="fade">    
        <div v-if="!isDataLoaded" class="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center surface-200 border-round">
            <PrimeProgressSpinner strokeWidth="4" />
        </div>
    </Transition>
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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
    transition-delay: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
