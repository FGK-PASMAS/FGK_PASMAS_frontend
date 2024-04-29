<script setup lang="ts">
import { bookingStore } from '@/stores/booking';
import PassengerEditMinimal from './PassengerEditMinimal.vue';

const booking = bookingStore();
</script>

<template>
    <!-- ToDo: Template is almost identical to the FlightInfo components template -->
    <div class="flex flex-column gap-5">
        <div>
            <div class="flex align-items-center gap-2 mb-1">
                <i class="bi-ticket-detailed-fill text-xl" />
                <h4 class="m-0">Flugtyp</h4>
            </div>
            <span class="ml-3">{{ booking.division!.Name }}</span>
        </div>
        <div>
            <div class="flex align-items-center gap-2 mb-3">
                <i class="bi-people-fill text-xl" />
                <h4 v-if="booking.passengers.length === 1" class="m-0">Passagier</h4>
                <h4 v-else class="m-0">Passagiere</h4>
            </div>
            <div class="flex flex-column gap-4">
                <PassengerEditMinimal v-for="(passenger, index) in booking.passengers" :key="index"
                    v-model:passenger="booking.passengers[index]"
                    :seat-number="index + 1" 
                    :required="{ LastName: true, FirstName: true, Weight: true }" 
                    :disabled="{ LastName: false, FirstName: false, Weight: true }" 
                />
            </div>
        </div>
        <div>
            <div class="flex align-items-center gap-2 mb-1">
                <i class="bi-clock-fill text-xl" />
                <h4 class="m-0">Flug</h4>
            </div>
            <div class="flex flex-column gap-2 ml-3">
                <div class="flex flex-wrap gap-2">
                    <span>{{ booking.flight!.DepartureTime!.toFormat("HH:mm") }}</span>
                    <span>-</span>
                    <span>{{ booking.flight!.ArrivalTime!.toFormat("HH:mm") }}</span>
                    <span>|</span>
                    <span>{{ booking.flight!.DepartureTime!.toFormat("cccc, dd LLLL yyyy") }}</span>
                </div>
                <span><span class="font-bold">Dauer:</span> {{ booking.flight!.ArrivalTime!.diff(booking.flight!.DepartureTime!, "minutes").toFormat("mm") }}min</span>
                <div class="flex flex-wrap gap-1">
                    <span><span class="font-bold">ETOW:</span> {{ booking.etow }}kg</span>
                </div>
                <div v-if="booking.flight!.Description" class="flex gap-2">
                    <i class="bi-info-circle-fill text-red-400" />
                    <span class="text-red-400 word-break-all">{{ booking.flight!.Description }}</span>
                </div>
            </div>
        </div>
        <div>
            <div class="flex align-items-center gap-2 mb-1">
                <i class="bi-airplane-fill text-xl" />
                <h3 class="m-0">Flugzeug</h3>
            </div>
            <div class="flex flex-column gap-1 ml-3">
                <span><span class="font-bold">Typ:</span> {{ booking.flight!.Plane!.AircraftType }}</span>
                <span><span class="font-bold">Kennzeichen:</span> {{ booking.flight!.Plane!.Registration }}</span>
                <span><span class="font-bold">Leergewicht:</span> {{ booking.flight!.Plane!.EmptyWeight }}kg</span>
                <span v-if="booking.flight!.FuelAtDeparture! >= 0"><span class="font-bold">Treibstoff:</span> {{ booking.flight!.FuelAtDeparture }}L</span>
            </div>
        </div>
        <div>
            <div class="flex align-items-center gap-2 mb-1">
                <i class="bi-person-vcard-fill text-xl" />
                <h3 class="m-0">Pilot</h3>
            </div>
            <div class="flex flex-column gap-1 ml-3">
                <span>{{ booking.flight!.Pilot!.LastName + ", " + booking.flight!.Pilot!.FirstName + " (" + booking.flight!.Pilot!.Weight + "kg)" }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
