<script setup lang="ts">
import { ref, type PropType, onBeforeMount, inject } from "vue";
import { bookingStore } from "@/stores/booking";
import { type Division } from "@/data/division/division.interface";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getDivisions } from "@/data/division/division.service";
import PassengerEditInline from "@/components/PassengerEditInline.vue";

const dropDown = ref(null);

const store = bookingStore();

const divisions = ref<Division[]>([]);
const selectedDivision = defineModel({
    type: Object as PropType<Division>
});

onBeforeMount(async () => {
    divisions.value = await getDivisions();

    const index: number = divisions.value.findIndex((division) => { return division.ID === store.division?.ID });
    selectedDivision.value = divisions.value[index];
});

const bookingUpdated = inject<Function>("bookingUpdated");

function setDivision()
{
    if (!selectedDivision.value) {
        store.resetBooking();
        bookingUpdated!();
        return;
    }

    store.division = selectedDivision.value;
    store.passengers = [];

    for (let i = 0; i < selectedDivision.value.PassengerCapacity; i++) {
        store.passengers.push({});
    }

    bookingUpdated!();
}

function updateStore(passengerId: number, passenger: Passenger)
{
    store.passengers[passengerId - 1] = passenger;

    bookingUpdated!();
}
</script>

<template>
    <div class="flex flex-column gap-4">
        <div>
            <h4>Flugtyp auswählen</h4>
            <PrimeDropdown class="w-full md:w-20rem" ref="dropDown" v-model="selectedDivision" :options="divisions" optionLabel="Name" placeholder="Flugtyp" showClear @change="setDivision()" />
        </div>
        <div>
            <h4 v-if="selectedDivision">Passagiere hinzufügen</h4>
            <div class="flex flex-column gap-4">
                <PassengerEditInline v-for="n in store.passengers.length" :key="n" :seatNumber="n" @passenger-updated="(passenger) => updateStore(n, passenger)" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
