<script setup lang="ts">
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import BookingFlights from "@/components/BookingFlights.vue";
import BookingPassengers from "@/components/BookingPassengers.vue";
import BookingResult from "@/components/BookingResult.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { bookingStore } from "@/stores/booking";
import type { MenuStepperItemInterface } from "@/utils/interfaces/menuStepperItem.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
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
const isNavDialogOpen = ref(false);
const isNextNavEnabled = ref(false);

onBeforeMount(() => {
    booking.resetStore();
});

onBeforeRouteLeave(() => {
    if (booking.isEmpty) {
        isAllowedToLeave.value = true;
    } else {
        isNavDialogOpen.value = true;
    }

    if (isAllowedToLeave.value) {
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

function onBookingUpdate(currentStep?: string): void
{
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
    window.removeEventListener("beforeunload", onBeforeUnload);
}

async function cancelBooking(): Promise<void>
{
    await booking.cancelBooking(toast);

    stepper.value.resetStepper();
    window.removeEventListener("beforeunload", onBeforeUnload);
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
        <Transition>    
            <div v-if="!isDataLoaded" class="absolute top-0 w-full h-full flex justify-content-center align-items-center surface-100 border-round">
                <PrimeProgressSpinner strokeWidth="4" />
            </div>
        </Transition>
    </div>
    <NavigationGuardDialog 
        v-model:isOpen="isNavDialogOpen" 
        v-model:isAllowedToLeave="isAllowedToLeave" 
        description="Du bist gerade dabei den Buchungsprozess zu verlassen. Bist du sicher?" 
        @confirm="showCancelBookingToast()" 
    />
</main>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
    transition-delay: 0.3s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
