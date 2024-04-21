<script setup lang="ts">
import { useFlightStatusDisplayData, type FlightStatusDisplayData } from "@/composables/useFlightStatusDisplayData";
import { FlightStatus } from "@/data/flight/flight.interface";
import { computed, type PropType } from "vue";

const props = defineProps({
    flightStatus: {
        type: String as PropType<FlightStatus>
    }
});

const displayedStatus = computed((): FlightStatusDisplayData => {
    return useFlightStatusDisplayData(props.flightStatus);
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
