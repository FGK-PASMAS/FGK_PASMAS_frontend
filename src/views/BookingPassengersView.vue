<script setup lang="ts">
import PassengerEditMinimal from "@/components/PassengerEditMinimal.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Division } from "@/data/division/division.interface";
import { getDivisions } from "@/data/division/division.service";
import { bookingStore } from "@/stores/booking";
import { useToast } from "primevue/usetoast";
import { inject, onBeforeMount, ref, type Ref } from "vue";

const bookingUpdated = inject<Function>("bookingUpdated");

const toast = useToast();
const dropDown = ref(null);

const booking = bookingStore();
const divisions: Ref<Division[]> = ref([]);

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);
});

function initPassengers(): void
{
    booking.seats = [];

    if (!booking.division) {
        bookingUpdated!();
        return;
    }

    if (!booking.division.PassengerCapacity) {
        bookingUpdated!();
        return;
    }

    for (let i = 0; i < booking.division.PassengerCapacity; i++) {
        booking.seats.push({
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
            <PrimeDropdown class="w-full md:w-20rem" ref="dropDown" v-model="booking.division" :options="divisions" optionLabel="Name" placeholder="Flugtyp" showClear @change="initPassengers()" />
        </div>
        <div v-if="booking.seats.length > 0">
            <h4 v-if="booking.seats.length === 1">Passagier hinzufügen</h4>
            <h4 v-else>Passagiere hinzufügen</h4>
            <div class="flex flex-column gap-4">
                <PassengerEditMinimal v-for="(seat, index) in booking.seats" :key="index" :seat-number="index + 1" v-model:passenger="booking.seats[index]" :required="{ LastName: false, FirstName: false, Weight: true }" @passenger-changed="bookingUpdated!()" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
