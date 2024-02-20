<script setup lang="ts">
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import type { Flight } from '@/data/flight/flight.interface';
import { deleteFlight } from '@/data/flight/flight.service';
import type { Passenger } from '@/data/passenger/passenger.interface';
import { useToast } from 'primevue/usetoast';
import { ref, type PropType } from 'vue';
import PassengerInfoMinimal from './PassengerInfoMinimal.vue';

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

const isCancelDisabled = ref(false);

async function cancelFlight()
{
    if (!props.flight) {
        return;
    }

    isCancelDisabled.value = true;

    const response = await useValidateAPIData(deleteFlight(props.flight), toast);

    if (response) {
        emit("flightCanceled");
    }

    isCancelDisabled.value = false;
}
</script>

<template>
    <div class="flex flex-column pr-1 overflow-auto">
        <div class="flex flex-wrap justify-content-between align-items-center gap-2">
            <h1 class="m-0">Buchungsübersicht</h1>
            <PrimeButton v-if="flight" label="Stornieren" icon="bi-calendar2-x" class="text-color" @click="cancelFlight()" :disabled="isCancelDisabled" 
                :pt="{
                    label: { class: 'font-normal' }
                }"
            />
            <PrimeDivider />
        </div>
        <div>
            <h2>Passagiere</h2>
            <PassengerInfoMinimal v-for="(passenger, index) in passengers" :key="index" :seatNumber="index" :passenger="passenger"></PassengerInfoMinimal>
        </div>
        <div>
            <h2>Flugtyp</h2>
            <p>{{ division?.Name }}</p>
        </div>
        <div>
            <h2>Maximale Passgieranzahl</h2>
            <p>{{ division?.PassengerCapacity }}</p>
        </div>
        <div>
            <h2>Flug</h2>
            <p>Flugstart {{ flight?.ArrivalTime }}</p>
            <p>Flugende {{ flight?.DepartureTime }}</p>
            <p>Beschreibung {{ flight?.Description }}</p>
            <p>Aktueller Treibstoff {{ flight?.FuelAtDeparture }}</p>
            <p>Pilot {{ flight?.Pilot?.LastName + ", " + flight?.Pilot?.FirstName + "(" + flight?.Pilot?.Weight + "kg)" }}</p>
            <h3>Flugzeug</h3>
            <p>Typ {{ flight?.Plane?.AircraftType }}</p>
            <p>Leergewicht {{ flight?.Plane?.EmptyWeight }}</p>
            <p>Flugzeit {{ flight?.Plane?.FlightDuration }}ns</p>
            <p>MTOW {{ flight?.Plane?.MTOW }}</p>
            <p v-if="flight?.Plane?.MaxSeatPayload !== -1">Maxmiales Sitzgewicht {{ flight?.Plane?.MaxSeatPayload }}</p>
            <p>Kennzeichen {{ flight?.Plane?.Registration }}</p>
            <p>Status {{ flight?.Status }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
