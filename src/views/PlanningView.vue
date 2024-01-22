<script setup lang="ts">
import { onBeforeMount, provide, ref } from "vue";
import { type MenuItem } from "primevue/menuitem";
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import { bookingStore } from "@/stores/booking";
import { useRouter } from "vue-router";

const items: MenuItem[] = [
    { 
        label: "Passagiere",
        icon: "bi-people",
        route: "passenger_data",
    }, { 
        label: "Reservierung",
        icon: "bi-airplane",
        route: "prebooking",
    }, { 
        label: "Buchung",
        icon: "bi-check-lg",
        route: "booking",
    }
];

const router = useRouter();

const store = bookingStore();

const isNextDisabled = ref(true);

onBeforeMount(() => {
    store.resetBooking();
});

router.afterEach(() => {
    setBookingState();
});

provide("bookingUpdated", onBookingUpdate);

function onBookingUpdate()
{
    setBookingState();
}

function setBookingState()
{
    switch (router.currentRoute.value.name) {
        case "passenger_data":
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
</script>

<template>
    <main>
        <ContentHeader title="Planung" />
        <MenuStepper :items="items" :is-next-disabled="isNextDisabled" />
    </main>
</template>

<style scoped lang="scss">
</style>
