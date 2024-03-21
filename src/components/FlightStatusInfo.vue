<script setup lang="ts">
import { FlightStatus, FlightStatusColor, FlightStatusDisplayName } from '@/data/flight/flight.interface';
import { ref, type PropType } from 'vue';

const props = defineProps({
    flightStatus: {
        type: String as PropType<FlightStatus>
    }
});

const displayedStatus = ref("Noch offen");
const displayedStatusColor = ref(FlightStatusColor.UNKNOWN);

switch (props.flightStatus) {
    case FlightStatus.BLOCKED:
        displayedStatus.value = FlightStatusDisplayName.BLOCKED;
        displayedStatusColor.value = FlightStatusColor.BLOCKED;
        break;
    case FlightStatus.BOOKED:
        displayedStatus.value = FlightStatusDisplayName.BOOKED;
        displayedStatusColor.value = FlightStatusColor.BOOKED;
        break;
    case FlightStatus.OK:
        displayedStatus.value = FlightStatusDisplayName.OK;
        displayedStatusColor.value = FlightStatusColor.OK;
        break;
    case FlightStatus.OVERLOADED:
        displayedStatus.value = FlightStatusDisplayName.OVERLOADED;
        displayedStatusColor.value = FlightStatusColor.OVERLOADED;
        break;
    case FlightStatus.OVERLOADED_SEAT:
        displayedStatus.value = FlightStatusDisplayName.OVERLOADED_SEAT;
        displayedStatusColor.value = FlightStatusColor.OVERLOADED_SEAT;
        break;
    case FlightStatus.RESERVED:
        displayedStatus.value = FlightStatusDisplayName.RESERVED;
        displayedStatusColor.value = FlightStatusColor.RESERVED;
        break;
    default:
        displayedStatus.value = FlightStatusDisplayName.UNKNOWN;
        displayedStatusColor.value = FlightStatusColor.UNKNOWN;
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
