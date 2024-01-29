<script setup lang="ts">
import { ref, onBeforeMount, inject } from "vue";
import { bookingStore } from "@/stores/booking";
import type { Division } from "@/data/division/division.interface";
import { getDivisions } from "@/data/division/division.service";
import PassengerEditInline from "@/components/PassengerEditInline.vue";

const bookingUpdated = inject<Function>("bookingUpdated");

const dropDown = ref(null);

const store = bookingStore();
const divisions = ref<Division[]>([]);

onBeforeMount(async () => {
    divisions.value = await getDivisions();
});

function initPassengers(): void
{
    store.seats = [];

    if (!store.division) {
        bookingUpdated!();
        return;
    }

    for (let i = 0; i < store.division.PassengerCapacity; i++) {
        store.seats.push({
            LastName: undefined,
            FirstName: undefined,
            Weight: undefined
        });
    }

    bookingUpdated!();
}
</script>

<template>
    <div class="flex flex-column gap-4">
        <div v-if="divisions.length > 0">
            <h4>Flugtyp auswählen</h4>
            <PrimeDropdown class="w-full md:w-20rem" ref="dropDown" v-model="store.division" :options="divisions" optionLabel="Name" placeholder="Flugtyp" showClear @change="initPassengers()" />
        </div>
        <div v-if="store.seats.length > 0">
            <h4 v-if="store.seats.length === 1">Passagier hinzufügen</h4>
            <h4 v-else>Passagiere hinzufügen</h4>
            <div class="flex flex-column gap-4">
                <PassengerEditInline v-for="i in store.division?.PassengerCapacity" :key="i" :seat-number="i" v-model:passenger="store.seats[i-1]" :required="{ LastName: false, FirstName: false, Weight: true }" @passenger-changed="bookingUpdated!()" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
