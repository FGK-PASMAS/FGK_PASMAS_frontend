<script setup lang="ts">
import { bookingStore } from '@/stores/booking';
import { ref } from 'vue';
import AppDialog from './AppDialog.vue';
import FlightInfo from './FlightInfo.vue';

const booking = bookingStore();

const isOverviewDialogOpen = ref(false);

function openOverview() 
{
    isOverviewDialogOpen.value = true;
}

function cancelFlight()
{
    booking.flight=undefined;
    isOverviewDialogOpen.value = false;
}
</script>

<template>
<div class="flex flex-column">
    <div class="flex justify-content-between align-items-center border-1 border-round border-primary surface-100 p-3 cursor-pointer" @click="openOverview()">
        <div class="flex flex-wrap column-gap-4 row-gap-2 ">
            <div class="flex align-items-center gap-2">
                <i class="bi-ticket-detailed-fill text-xl" />
                <span>{{ booking.division?.Name }}</span>
            </div>
            <div class="hidden md:flex align-items-center gap-2">
                <i class="bi-people-fill text-xl" />
                <div class="flex gap-1">
                    <span>{{ booking.passengers.length }}</span>
                    <span v-if="booking.passengers.length === 1">Passagier</span>
                    <span v-else>Passagiere</span>
                    <span>{{ "(" + booking.totalPassengersWeight + "kg)" }}</span>
                </div>
            </div>
            <div class="hidden md:flex align-items-center gap-2">
                <i class="bi-clock-fill" />
                <div v-if="booking.flight" class="flex gap-1">
                    <span>{{ booking.flight?.DepartureTime?.toFormat("HH:mm") }}</span>
                    <span> - </span>
                    <span>{{ booking.flight?.ArrivalTime?.toFormat("HH:mm") }}</span>
                    <span>|</span>
                    <span>{{ booking.flight?.DepartureTime?.toFormat("dd.LL.yyyy") }}</span>
                </div>
                <span v-else>-</span>
            </div>
            <div class="hidden md:flex align-items-center gap-2">
                <i class="bi-airplane-fill" />
                <div v-if="booking.flight?.Plane" class="flex gap-1">
                    <span>{{ booking.flight?.Plane?.AircraftType }}</span>
                    <span>{{ "(" + booking.flight?.Plane?.Registration + ")" }}</span>
                </div>
                <span v-else>-</span>
            </div>
        </div>
        <div class="flex gap-2 ml-4">
            <i class="bi-info-circle-fill" />
            <span>Details</span>
        </div>
    </div>
    <AppDialog v-model:isOpen="isOverviewDialogOpen">
        <FlightInfo :division="booking.division" :passengers="booking.passengers" :flight="booking.flight" @flightCanceled="cancelFlight()" />
    </AppDialog>
</div>
</template>

<style scoped lang="scss">
</style>
