<script setup lang="ts">
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import BookingFlights from "@/components/BookingFlights.vue";
import BookingPassengers from "@/components/BookingPassengers.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import { bookingStore } from "@/stores/booking";
import type { MenuStepperItemInterface } from "@/utils/interfaces/menuStepperItem.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const booking = bookingStore();

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

function onBookingUpdate(): void
{
    if (!booking.isEmpty) {
        window.addEventListener("beforeunload", onBeforeUnload);
    } else {
        window.removeEventListener("beforeunload", onBeforeUnload);
    }

    if (!stepper.value) {
        return;
    }

    isNextNavEnabled.value = false;

    switch (stepper.value.getCurrentStepKey()) {
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
    await booking.confirmBooking(toast);

    // ToDo: Display succesful booking
    alert("WIP: BOOKED!")
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
            <PrimeButton type="button" text class="align-self-center text-color mr-1" @click="cancelBooking()">Abbrechen</PrimeButton>
        </div>
        <MenuStepper ref="stepper" :items="items" :isNextNavEnabled="isNextNavEnabled" class="flex-grow-1" @stepChanged="onBookingUpdate()" @confirm="confirmBooking()"/>
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
</style>
