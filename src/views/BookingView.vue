<script setup lang="ts">
import { onBeforeMount, provide, ref } from "vue";
import { useRouter } from "vue-router";
import { type MenuItem } from "primevue/menuitem";
import { useToast } from "primevue/usetoast";
import { bookingStore } from "@/stores/booking";
import { ToastInfo } from "@/utils/toasts/ToastInfo";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";

const router = useRouter();

const toast = useToast();

const store = bookingStore();

const items: MenuItem[] = [
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

    toast.add(new ToastInfo("Buchung wurde abgebrochen"));
}
</script>

<template>
    <main>
        <div class="flex justify-content-between">
            <ContentHeader title="Flug buchen" />
            <PrimeButton class="align-self-center text-color" text @click="cancelBooking()">Abbrechen</PrimeButton>
        </div>
        <MenuStepper :items="items" :is-next-disabled="isNextDisabled" />
    </main>
</template>

<style scoped lang="scss">
</style>
