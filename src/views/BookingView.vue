<script setup lang="ts">
import { onBeforeMount, provide, ref } from "vue";
import { useRouter } from "vue-router";
import { type MenuItem } from "primevue/menuitem";
import { bookingStore } from "@/stores/booking";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";

const router = useRouter();

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

function onBookingUpdate()
{
    setBookingState();
}

function setBookingState()
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

function cancelBooking()
{
    store.resetBooking();
    router.push("/");
}
</script>

<template>
    <main>
        <div class="flex justify-content-between">
            <ContentHeader title="Planung" />
            <PrimeButton class="align-self-center text-color" text @click="cancelBooking()">Abbrechen</PrimeButton>
        </div>
        <MenuStepper :items="items" :is-next-disabled="isNextDisabled" />
    </main>
</template>

<style scoped lang="scss">
</style>
