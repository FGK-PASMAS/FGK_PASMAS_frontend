<script setup lang="ts">
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import { FlightStatus, type Flight } from '@/data/flight/flight.interface';
import { createFlight, deleteFlight } from '@/data/flight/flight.service';
import type { Passenger } from '@/data/passenger/passenger.interface';
import { DateTime } from 'luxon';
import { useToast } from 'primevue/usetoast';
import { computed, ref, type PropType } from 'vue';
import FlightStatusInfo from './FlightStatusInfo.vue';
import PassengerInfoMinimal from './PassengerInfoMinimal.vue';

const toast = useToast();

const isButtonDisabled = ref(false);

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
    "flightReserved",
    "flightCanceled"
]);

const isReserveable = computed(() => {
    return props.flight?.Status === FlightStatus.OK;
});

const isCanceable = computed(() => {
    return props.flight?.Status === FlightStatus.RESERVED;
});

async function reserveFlight(): Promise<void>
{
    if (!props.flight) {
        return;
    }

    isButtonDisabled.value = true;

    const reservedFlight = await useValidateAPIData(createFlight(props.flight), toast);

    if (reservedFlight) {
        emit("flightReserved", reservedFlight);
    }

    isButtonDisabled.value = false;
}

async function cancelFlight(): Promise<void>
{
    if (!props.flight) {
        return;
    }

    isButtonDisabled.value = true;

    const response = await useValidateAPIData(deleteFlight(props.flight), toast);

    if (response) {
        emit("flightCanceled");
    }

    isButtonDisabled.value = false;
}
</script>

<template>
    <div class="flex flex-column pr-2 overflow-auto">
        <div class="flex flex-wrap justify-content-between align-items-center">
            <h1 class="m-0">Flugübersicht</h1>
            <FlightStatusInfo :flightStatus="flight?.Status" />
            <PrimeDivider />
        </div>
        <div class="flex flex-column gap-4">
            <div>
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-ticket-detailed-fill text-xl" />
                    <h3 class="m-0">Flugtyp</h3>
                </div>
                <span class="ml-1">{{ division?.Name }}</span>
            </div>
            <div>
                <div class="flex flex-wrap align-items-center gap-2 row-gap-1 mb-1">
                    <i class="bi-people-fill text-xl" />
                    <h3 class="m-0">Passagiere</h3>
                    <h3 class="m-0">(Max. {{ division?.PassengerCapacity }} {{ division?.PassengerCapacity === 1 ? "Passagier" : "Passagiere" }})</h3>
                    <h3 v-if="flight?.Plane?.MaxSeatPayload && flight?.Plane?.MaxSeatPayload > 0" class="m-0">(Max. {{ flight!.Plane!.MaxSeatPayload }}kg pro Sitz)</h3>
                </div>
                <div class="flex flex-column gap-1 ml-1">
                    <PassengerInfoMinimal v-for="(passenger, index) in passengers" :key="index" :passenger="passenger" :seatNumber="index" :seatPayload="flight?.Plane?.MaxSeatPayload" />
                </div>
            </div>
            <div>
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-clock-fill text-xl" />
                    <h3 class="m-0">Flug</h3>
                </div>
                <div v-if="flight" class="flex flex-column gap-3 ml-1">
                    <div class="flex gap-2">
                        <span>{{ flight!.DepartureTime!.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                        <span>-</span>
                        <span>{{ flight!.ArrivalTime!.toLocaleString(DateTime.DATETIME_SHORT) }}</span>
                        <span>(Dauer: {{ flight!.ArrivalTime!.diff(flight!.DepartureTime!, "minutes").toFormat("mm") }}min)</span>
                    </div>
                    <div v-if="flight!.Description" class="flex gap-2">
                        <i class="bi-info-circle-fill text-red-400" />
                        <span class="text-red-400 word-break-all">{{ flight!.Description }}</span>
                    </div>
                </div>
                <span v-else>-</span>
            </div>
            <div>
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-airplane-fill text-xl" />
                    <h3 class="m-0">Flugzeug</h3>
                </div>
                <div v-if="flight" class="flex flex-column gap-1 ml-1">                    
                    <span>Aktueller Treibstoff {{ flight!.FuelAtDeparture }}</span>
                    <span>Pilot {{ flight!.Pilot!.LastName + ", " + flight!.Pilot!.FirstName + "(" + flight!.Pilot!.Weight + "kg)" }}</span>
                    <span>Typ {{ flight!.Plane!.AircraftType }}</span>
                    <span>Leergewicht {{ flight!.Plane!.EmptyWeight }}</span>
                    <span>MTOW {{ flight!.Plane!.MTOW }}</span>
                    <span>Kennzeichen {{ flight!.Plane!.Registration }}</span>
                </div>
                <span v-else>-</span>
            </div>
            <PrimeButton v-if="isReserveable" label="Reservieren" class="text-color" @click="reserveFlight()" :disabled="isButtonDisabled"
                :pt="{
                    label: { class: 'font-normal' }
                }"
            />
            <PrimeButton v-if="isCanceable" label="Stornieren" severity="danger" class="text-color" @click="cancelFlight()" :disabled="isButtonDisabled" 
                :pt="{
                    label: { class: 'font-normal' }
                }"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
