<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import { bookingStore } from "@/stores/booking";
import type { PrimeMenuItem } from "@/utils/interfaces/menuItem.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, provide, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toast = useToast();

const store = bookingStore();

const items: PrimeMenuItem[] = [
    { 
        label: "Passagiere",
        icon: "bi-people",
        route: "booking_passengers",
    }, { 
        label: "Reservierung",
        icon: "bi-airplane",
        route: "booking_prebooking",
    }, { 
        label: "Buchung",
        icon: "bi-check-lg",
        route: "booking_confirm",
    }
];

const isNextDisabled = ref(true);

provide("bookingUpdated", onBookingUpdate);

onBeforeMount(() => {
    store.resetBooking();
});

router.afterEach(() => {
    setBookingState();
});

function onBookingUpdate(): void
{
    setBookingState();
}

function setBookingState(): void
{
    switch (router.currentRoute.value.name) {
        case "booking_passengers":
            if (store.totalWeight > 0) {
                isNextDisabled.value = false;
            } else {
                isNextDisabled.value = true;
            }
            break;
    
        default:
            isNextDisabled.value = true;
            break;
    }
}

function cancelBooking(): void
{
    store.resetBooking();
    router.push("/");
    
    toast.add(new InfoToast({ detail: "Buchung wurde abgebrochen "}));
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <div class="flex justify-content-between">
            <ContentHeader title="Buchen" />
            <PrimeButton class="align-self-center text-color" text @click="cancelBooking()">Abbrechen</PrimeButton>
        </div>
        <MenuStepper class="flex-grow-1" :items="items" :is-next-disabled="isNextDisabled" />
    </main>
</template>

<style scoped lang="scss">
</style>
