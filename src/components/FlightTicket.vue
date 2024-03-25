<script setup lang="ts">
import { useFlightStatusDisplayData, type FlightStatusDisplayData } from '@/composables/useFlightStatusDisplayData';
import type { Flight } from '@/data/flight/flight.interface';
import { computed, type PropType } from 'vue';

const props = defineProps({
    flight: {
        type: Object as PropType<Flight>,
        required: true
    }
});

const displayedStatus = computed((): FlightStatusDisplayData => {
    return useFlightStatusDisplayData(props.flight?.Status);
});
</script>

<template>
    <div class="w-full flex border-1 border-round border-primary">
        <div class="flex-grow-1 flex flex-column gap-2 p-2">
            <div class="flex flex-wrap gap-1">
                <span class="font-bold">{{ flight.DepartureTime!.toFormat("HH:mm") }}</span>
                <span class="font-bold"> - </span>
                <span class="font-bold">{{ flight.ArrivalTime!.toFormat("HH:mm") }}</span>
                <span>|</span>
                <span>{{ flight.DepartureTime!.toFormat("dd.LL.yyyy") }}</span>
                <span>|</span>
                <span>{{ flight!.ArrivalTime!.diff(flight!.DepartureTime!, "minutes").toFormat("mm") }}min</span>
            </div>
            <div class="flex gap-2 ml-1">
                <i class="bi-airplane-fill" />
                <span>{{ flight.Plane!.AircraftType }}</span>
                <span>({{ flight.Plane!.Registration }})</span>
            </div>
        </div>
        <i class="bi-info-circle-fill p-2" />

        <!-- ToDo: Hier weiter -->
        <PrimeButton class="w-3 text-color" :class="displayedStatus.bgColor">{{ displayedStatus.status }}</PrimeButton>
    </div>
</template>

<style scoped lang="scss">
</style>
