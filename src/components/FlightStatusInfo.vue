<script setup lang="ts">
import { FlightStatus, FlightStatusColor, FlightStatusDisplayName } from '@/data/flight/flight.interface';
import { computed, type PropType } from 'vue';

const props = defineProps({
    flightStatus: {
        type: String as PropType<FlightStatus>
    }
});

const displayedStatus = computed(() => {
    let status = "Noch offen";
    let color = FlightStatusColor.UNKNOWN;

    switch (props.flightStatus) {
        case FlightStatus.BLOCKED:
            status = FlightStatusDisplayName.BLOCKED;
            color = FlightStatusColor.BLOCKED;
            break;
        case FlightStatus.BOOKED:
            status = FlightStatusDisplayName.BOOKED;
            color = FlightStatusColor.BOOKED;
            break;
        case FlightStatus.OK:
            status = FlightStatusDisplayName.OK;
            color = FlightStatusColor.OK;
            break;
        case FlightStatus.OVERLOADED:
            status = FlightStatusDisplayName.OVERLOADED;
            color = FlightStatusColor.OVERLOADED;
            break;
        case FlightStatus.OVERLOADED_SEAT:
            status = FlightStatusDisplayName.OVERLOADED_SEAT;
            color = FlightStatusColor.OVERLOADED_SEAT;
            break;
        case FlightStatus.RESERVED:
            status = FlightStatusDisplayName.RESERVED;
            color = FlightStatusColor.RESERVED;
            break;
        case FlightStatus.UNKNOWN:
            status = FlightStatusDisplayName.UNKNOWN;
            color = FlightStatusColor.UNKNOWN;
            break;
    }

    return {
        "status": status,
        "color": color
    }
});
</script>

<template>
    <div class="flex align-items-center gap-2">
        <i class="bi-circle-fill" :class="displayedStatus.color" />
        <span>Status: {{ displayedStatus.status }}</span>
    </div>
</template>

<style scoped lang="scss">
</style>
