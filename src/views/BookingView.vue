<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import MenuStepper from "@/components/MenuStepper.vue";
import NavigationGuardDialog from "@/components/NavigationGuardDialog.vue";
import { bookingStore } from "@/stores/booking";
import type { PrimeMenuItem } from "@/utils/interfaces/menuItem.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, provide, ref } from "vue";
import type { RouteRecordName } from "vue-router";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from "vue-router";

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

const isAllowedToLeave = ref(false);
const isNavDialogOpen = ref(false);
const isNextDisabled = ref(true);

provide("bookingUpdated", onBookingUpdate);

onBeforeMount(() => {
    store.resetStore();
});

onBeforeRouteUpdate((to) => {
    setBookingState(to.name);
});

onBeforeRouteLeave(() => {
    if (store.isEmpty) {
        isAllowedToLeave.value = true;
    } else {
        isNavDialogOpen.value = true;
    }

    if (isAllowedToLeave.value) {
        window.removeEventListener("beforeunload", onBeforeUnload);
    }
});

function onBeforeUnload(event: BeforeUnloadEvent): void
{
    event.preventDefault();
}

function onBookingUpdate(): void
{
    setBookingState();

    if (!store.isEmpty) {
        window.addEventListener("beforeunload", onBeforeUnload);
    } else {
        window.removeEventListener("beforeunload", onBeforeUnload);
    }
}

function setBookingState(route?: RouteRecordName | null | undefined): void
{
    if (!route) {
        route = router.currentRoute.value.name;
    }

    switch (route) {
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
    store.resetStore();
    window.removeEventListener("beforeunload", onBeforeUnload);
    router.replace({ name: "booking_passengers" });

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
        <div class="flex justify-content-between">
            <ContentHeader title="Buchen" />
            <PrimeButton type="button" class="align-self-center mr-1 text-color" text @click="cancelBooking()">Abbrechen</PrimeButton>
        </div>
        <MenuStepper class="flex-grow-1" :items="items" :is-next-disabled="isNextDisabled" />
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
