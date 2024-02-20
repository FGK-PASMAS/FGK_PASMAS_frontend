<script setup lang="ts">
import type { Division } from '@/data/division/division.interface';
import type { Flight } from '@/data/flight/flight.interface';
import type { Passenger } from '@/data/passenger/passenger.interface';
import type { PropType } from 'vue';
import PassengerInfoMinimal from './PassengerInfoMinimal.vue';
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import { deleteFlight } from '@/data/flight/flight.service';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
    division: {
        type: Object as PropType<Division>
    },
    passengers: {
        type: Array as PropType<Passenger[]>
    },
    flight: {
        type: Object as PropType<Flight>
    }
});

const emit = defineEmits([
    "flightCanceled"
]);

async function cancelFlight()
{
    if (!props.flight) {
        return;
    }

    const response = await useValidateAPIData(deleteFlight(props.flight), toast);

    if (response) {
        emit("flightCanceled");
    }
}
</script>

<template>
    <div class="flex flex-column pr-1 overflow-auto">
        <div class="flex justify-content-between align-items-center">
            <h1>Buchungsübersicht</h1>
            <PrimeButton v-if="flight" class="text-color" @click="cancelFlight()">Stornieren</PrimeButton>
        </div>
        <div>
            <h2>Passagiere</h2>
            <PassengerInfoMinimal v-for="(passenger, index) in passengers" :key="index" :seatNumber="index" :passenger="passenger"></PassengerInfoMinimal>
        </div>
        <div>
            <h2>Flugtyp</h2>
            <p>{{ division }}</p>
        </div>
        <div>
            <h2>Flug</h2>
            <p>{{ flight }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
