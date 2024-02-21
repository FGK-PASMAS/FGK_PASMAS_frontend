<script setup lang="ts">
import { FlightStatus } from '@/data/flight/flight.interface';
import { ref, type PropType } from 'vue';

const props = defineProps({
    flightStatus: {
        type: String as PropType<FlightStatus>
    }
});

const displayedStatus = ref("Noch offen");
const displayedStatusColor = ref("text-bluegray-400");

switch (props.flightStatus) {
    case FlightStatus.BLOCKED:
        displayedStatus.value = "Geblockt";
        displayedStatusColor.value = "text-yellow-400";
        break;
    case FlightStatus.BOOKED:
        displayedStatus.value = "Gebucht";
        displayedStatusColor.value = "text-blue-400";
        break;
    case FlightStatus.OK:
        displayedStatus.value = "Ok";
        displayedStatusColor.value = "text-primary-400";
        break;
    case FlightStatus.OVERLOADED:
        displayedStatus.value = "Überladen";
        displayedStatusColor.value = "text-red-400";
        break;
    case FlightStatus.OVERLOADED_SEAT:
        displayedStatus.value = "Sitz überladen";
        displayedStatusColor.value = "text-red-400";
        break;
    case FlightStatus.RESERVED:
        displayedStatus.value = "Reserviert";
        displayedStatusColor.value = "text-blue-400";
        break;
}
</script>

<template>
    <div class="flex align-items-center gap-2">
        <i class="bi-circle-fill" :class="displayedStatusColor" />
        <span>Status: {{ displayedStatus }}</span>
    </div>
</template>

<style scoped lang="scss">
</style>
