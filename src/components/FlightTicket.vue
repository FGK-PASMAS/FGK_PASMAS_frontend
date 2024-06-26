<script setup lang="ts">
import { useFlightStatusDisplayData, type FlightStatusDisplayData } from '@/core/composables/useFlightStatusDisplayData';
import { FlightStatus, type Flight } from '@/data/flight/Flight';
import { useBookingStore } from '@/stores/bookingStore';
import { useToast } from 'primevue/usetoast';
import { computed, type PropType } from 'vue';

const booking = useBookingStore();

const flight = defineModel("flight", {
    type: Object as PropType<Flight>,
    required: true
});

const displayedStatus = computed((): FlightStatusDisplayData => {
    return useFlightStatusDisplayData(flight.value?.Status);
});

defineEmits([
    "showInfo"
]);

const toast = useToast();

async function reserveFlight(): Promise<void>
{
    await booking.reserveFlight(flight.value, toast);
}

async function cancelFlight(): Promise<void>
{
    await booking.cancelFlight(toast);
}
</script>

<template>
    <div class="w-full flex border-1 border-round border-primary cursor-pointer" @click="$emit('showInfo')">
        <div class="flex-grow-1 flex flex-column gap-2 p-2">
            <div class="flex flex-wrap gap-1">
                <span class="font-bold">{{ flight.DepartureTime!.toFormat("HH:mm") }}</span>
                <span class="font-bold"> - </span>
                <span class="font-bold">{{ flight.ArrivalTime!.toFormat("HH:mm") }}</span>
                <span>|</span>
                <span>{{ flight.DepartureTime!.toFormat("dd.LL.yyyy") }}</span>
                <span class="hidden md:block">|</span>
                <span class="hidden md:block">{{ flight!.ArrivalTime!.diff(flight!.DepartureTime!, "minutes").toFormat("mm") }}min</span>
            </div>
            <div class="flex gap-2 ml-3">
                <i class="bi-airplane-fill" />
                <span>{{ flight.Plane!.AircraftType }}</span>
                <span>({{ flight.Plane!.Registration }})</span>
            </div>
        </div>
        <i class="bi-info-circle-fill p-2" />
        <PrimeButton v-if="flight.ID === booking.flight?.ID && flight.Status === FlightStatus.RESERVED"
            type="button" 
            severity="danger" 
            class="w-3 min-width flex justify-content-center align-items-center text-color border-noround-left" 
            @click.stop="cancelFlight()">
            Stornieren
        </PrimeButton>
        <div v-else-if="flight.Status === FlightStatus.OK" class="w-3 min-width cursor-auto" @click.stop>
            <PrimeButton
                type="button" 
                class="h-full w-full flex justify-content-center align-items-center text-color border-noround-left" 
                @click.stop="reserveFlight()" 
                :disabled="booking.flight">
                Reservieren
            </PrimeButton>
        </div>
        <div v-else class="status-box w-3 min-width flex justify-content-center align-items-center text-center text-color border-round-right" :class="displayedStatus.bgColor" @click.stop>{{ displayedStatus.status }}</div>
    </div>
</template>

<style scoped lang="scss">
button:focus {
    box-shadow: none;
}

.status-box {
    cursor: default;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
}

.min-width {
    min-width: 128px;
}
</style>
