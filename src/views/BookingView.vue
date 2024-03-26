<script setup lang="ts">
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import BookingFlights from "@/components/BookingFlights.vue";
import BookingPassengers from "@/components/BookingPassengers.vue";
import BookingResult from "@/components/BookingResult.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { bookingStore } from "@/stores/booking";
import type { MenuStepperItemInterface } from "@/utils/interfaces/menuStepperItem.interface";
import { parseAPIResponse } from "@/utils/services/fetch.service";
import { InfoToast } from "@/utils/toasts/info.toast";
import { DateTime } from "luxon";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, ref, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const booking = bookingStore();
const bookedFlight: Ref<Flight | undefined> = ref();

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
const isConfirmDialogOpen = ref(false);
const isNavDialogOpen = ref(false);
const isNextNavEnabled = ref(false);

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

    if (booking.flight) {
        if (DateTime.now() >= booking.flight.DepartureTime!) {
            await booking.cancelBooking(toast);
        }
    }

    if (!booking.isEmpty) {
        isConfirmDialogOpen.value = true;
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
            <PrimeButton v-if="isDataLoaded && (booking.flight?.Status === undefined || booking.flight.Status === FlightStatus.RESERVED)" 
                type="button" 
                text 
                class="align-self-center text-color mr-1" 
                @click="cancelBooking()">
                Abbrechen
            </PrimeButton>
        </div>
        <MenuStepper v-if="isDataLoaded && (booking.flight?.Status === undefined || booking.flight.Status === FlightStatus.RESERVED)"
            ref="stepper" 
            :items="items" 
            :isNextNavEnabled="isNextNavEnabled" 
            class="flex-grow-1" 
            @stepChanged="onBookingUpdate" 
            @confirm="confirmBooking()"
        />
        <BookingResult v-else-if="isDataLoaded && booking.flight!.Status === FlightStatus.BOOKED" :flight="bookedFlight" />
        <Transition name="fade">    
            <div v-if="!isDataLoaded" class="absolute top-0 w-full h-full flex justify-content-center align-items-center surface-100 border-round">
                <PrimeProgressSpinner strokeWidth="4" />
            </div>
        </Transition>
    </div>
    <ConfirmDialog
        v-model:isOpen="isConfirmDialogOpen"
        description="Es ist eine Buchung vorhanden. Möchtest du mit dieser fortfahren?"
        @confirm="onContinueExistingBooking()"
        @cancel="onCancelExistingBooking()"
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
