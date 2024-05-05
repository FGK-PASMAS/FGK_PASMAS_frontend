<script setup lang="ts">
import type { Division } from '@/data/division/division.interface';
import { FlightStatus, type Flight } from '@/data/flight/flight.interface';
import { type Passenger } from '@/data/passenger/passenger.interface';
import { bookingStore } from '@/stores/booking';
import { getETOW, getTotalPassengersWeight } from '@/utils/services/flightCalculation.service';
import { useToast } from 'primevue/usetoast';
import { computed, ref, type PropType } from 'vue';
import FlightStatusInfo from './FlightStatusInfo.vue';
import PassengerInfoMinimal from './PassengerInfoMinimal.vue';

const booking = bookingStore();

const flight = defineModel("flight", {
    type: Object as PropType<Flight>
});

const props = defineProps({
    isBooking: {
        type: Boolean,
        default: false
    },
    division: {
        type: Object as PropType<Division>
    },
    passengers: {
        type: Array as PropType<Passenger[]>
    }
});

const totalPassengersWeight = computed(() => {
    return getTotalPassengersWeight(props.passengers);
});

const etow = computed(() => {
    if (!flight.value) {
        return 0;
    }

    return getETOW(flight.value, props.passengers);
});

const overload = computed(() => {
    if (!flight.value?.Plane?.MTOW) {
        return -1;
    }

    const overload = etow.value - flight.value.Plane.MTOW;

    if (overload > 0) {
        return overload;
    }

    return 0;
});

const isReserveable = computed(() => {
    return !booking.flight && flight.value?.Status === FlightStatus.OK;
});

const isCanceable = computed(() => {
    return booking.flight?.ID === flight.value?.ID && flight.value?.Status === FlightStatus.RESERVED;
});

const emit = defineEmits([
    "flightReserved",
    "flightCanceled"
]);

const toast = useToast();
const isButtonDisabled = ref(false);

async function reserveFlight(): Promise<void>
{
    if (!flight.value) {
        return;
    }

    isButtonDisabled.value = true;

    await booking.reserveFlight(flight.value, toast);
    emit("flightReserved");

    isButtonDisabled.value = false;
}

async function cancelFlight(): Promise<void>
{
    isButtonDisabled.value = true;

    await booking.cancelFlight(toast);
    emit("flightCanceled");

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
        <div class="flex flex-column gap-5">
            <div v-if="division">
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-ticket-detailed-fill text-xl" />
                    <h3 class="m-0">Flugtyp</h3>
                </div>
                <span class="ml-3">{{ division?.Name }}</span>
            </div>
            <div v-if="passengers && passengers.length > 0">
                <div class="flex flex-wrap align-items-center gap-2 row-gap-1 mb-1">
                    <i class="bi-people-fill text-xl" />
                    <h3 class="m-0">Passagiere</h3>
                    <h3 class="m-0">(Max.: {{ division?.PassengerCapacity }} {{ division?.PassengerCapacity === 1 ? "Passagier" : "Passagiere" }})</h3>
                    <h3 v-if="flight?.Plane?.MaxSeatPayload && flight?.Plane?.MaxSeatPayload > 0" class="m-0">(Max.: {{ flight!.Plane!.MaxSeatPayload }}kg pro Sitz)</h3>
                </div>
                <div class="flex flex-column gap-2 ml-3">
                    <div class="flex flex-column gap-1">
                        <PassengerInfoMinimal v-for="(passenger, index) in passengers" :key="index" :passenger="passenger" :seatNumber="index + 1" :seatPayload="flight?.Plane?.MaxSeatPayload" />
                    </div>
                    <span><span class="font-bold">Gesamt:</span> {{ totalPassengersWeight }}kg</span>
                </div>
            </div>
            <div>
                <div class="flex flex-wrap align-items-center gap-2 row-gap-1 mb-1">
                    <i class="bi-clock-fill text-xl" />
                    <h3 class="m-0">Flug <span v-if="flight?.FlightNo">#{{ flight.FlightNo }}</span></h3>
                    <h3 v-if="flight?.Plane?.MTOW" class="m-0">(MTOW: {{ flight!.Plane!.MTOW }}kg)</h3>
                </div>
                <div v-if="flight" class="flex flex-column gap-2 ml-3">
                    <div class="flex flex-wrap gap-2">
                        <span>{{ flight.DepartureTime!.toFormat("HH:mm") }}</span>
                        <span>-</span>
                        <span>{{ flight.ArrivalTime!.toFormat("HH:mm") }}</span>
                        <span>|</span>
                        <span>{{ flight.DepartureTime!.toFormat("cccc, dd LLLL yyyy") }}</span>
                    </div>
                    <span><span class="font-bold">Dauer:</span> {{ flight!.ArrivalTime!.diff(flight!.DepartureTime!, "minutes").toFormat("mm") }}min</span>
                    <div class="flex flex-wrap gap-1">
                        <span><span class="font-bold">ETOW:</span> {{ etow }}kg</span>
                        <span v-if="overload > 0" class="text-red-400">(+{{ overload }}kg)</span>
                        <i v-else-if="overload !== -1" class="bi-check2 text-primary-400" />
                    </div>
                    <div v-if="flight!.Description" class="flex gap-2">
                        <i class="bi-info-circle-fill" />
                        <span class="word-break-all">{{ flight!.Description }}</span>
                    </div>
                </div>
                <span v-else>-</span>
            </div>
            <div>
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-airplane-fill text-xl" />
                    <h3 class="m-0">Flugzeug</h3>
                </div>
                <div v-if="flight" class="flex flex-column gap-1 ml-3">
                    <span><span class="font-bold">Kennzeichen:</span> {{ flight.Plane!.Registration }}</span>
                    <span><span class="font-bold">Typ:</span> {{ flight.Plane!.AircraftType }}</span>
                    <span><span class="font-bold">Leergewicht:</span> {{ flight.Plane!.EmptyWeight }}kg</span>
                    <span v-if="flight.Plane!.FuelMaxCapacity! > 0"><span class="font-bold">Treibstoff:</span> {{ flight.FuelAtDeparture }}L</span>
                </div>
                <span v-else>-</span>
            </div>
            <div v-if="flight?.Pilot">
                <div class="flex align-items-center gap-2 mb-1">
                    <i class="bi-person-vcard-fill text-xl" />
                    <h3 class="m-0">Pilot</h3>
                </div>
                <div class="flex flex-column gap-1 ml-3">
                    <span>{{ flight!.Pilot!.LastName + ", " + flight!.Pilot!.FirstName + " (" + flight!.Pilot!.Weight + "kg)" }}</span>
                </div>
            </div>
            <div v-if="isBooking" class="flex flex-column">
                <PrimeButton v-if="isReserveable" type="button" label="Reservieren" class="text-color" @click="reserveFlight()" :disabled="isButtonDisabled"
                    :pt="{
                        label: { class: 'font-normal' }
                    }"
                />
                <PrimeButton v-if="isCanceable" type="button" label="Stornieren" severity="danger" class="text-color" @click="cancelFlight()" :disabled="isButtonDisabled" 
                    :pt="{
                        label: { class: 'font-normal' }
                    }"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
