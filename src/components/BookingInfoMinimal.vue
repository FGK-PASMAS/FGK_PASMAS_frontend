<script setup lang="ts">
import { bookingStore } from '@/stores/booking';
import { DateTime } from 'luxon';
import { ref } from 'vue';
import AppDialog from './AppDialog.vue';
import BookingInfo from './BookingInfo.vue';

const booking = bookingStore();

const isOverviewDialogOpen = ref(false);

function openOverview() {
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
                <i class="bi-ticket-fill text-xl" />
                <span>{{ booking.division?.Name }}</span>
            </div>
            <div class="flex align-items-center gap-2">
                <i class="bi-people-fill text-xl" />
                <div class="flex gap-1">
                    <span>{{ booking.passengers.length }}</span>
                    <span v-if="booking.passengers.length === 1">Passagier</span>
                    <span v-else>Passagiere</span>
                    <span>{{ "(" + booking.totalWeight + "kg)" }}</span>
                </div>
            </div>
            <div class="flex align-items-center gap-2">
                <i class="bi-airplane-fill" />
                <div v-if="booking.flight?.Plane" class="flex gap-1">
                    <span>{{ booking.flight?.Plane?.AircraftType }}</span>
                    <span>{{ "(" + booking.flight?.Plane?.Registration + ")" }}</span>
                </div>
                <span v-else>-</span>
            </div>
            <div class="flex align-items-center gap-2">
                <i class="bi-clock-fill" />
                <div v-if="booking.flight" class="flex gap-1">
                    <span>{{ booking.flight?.DepartureTime?.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                    <span>-</span>
                    <span>{{ booking.flight?.ArrivalTime?.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
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
        <BookingInfo :division="booking.division" :passengers="booking.passengers" :flight="booking.flight" @flightCanceled="cancelFlight()"></BookingInfo>
    </AppDialog>
</div>
</template>

<style scoped lang="scss">
</style>
