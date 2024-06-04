<script setup lang="ts">
import PassengerEditMinimal from "@/components/PassengerEditMinimal.vue";
import { useValidateAPIData } from "@/core/composables/useValidateAPIData";
import type { Division } from "@/data/division/Division";
import { getDivisions } from "@/data/division/useDivision";
import { useBookingStore } from '@/stores/bookingStore';
import { useToast } from "primevue/usetoast";
import { onBeforeMount, ref, type Ref } from "vue";

const toast = useToast();
const booking = useBookingStore();

const dropDown = ref(null);
const divisions: Ref<Division[]> = ref([]);

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);
});

function initPassengers(): void
{
    booking.seats = [];

    if (!booking.division) {
        return;
    }

    if (!booking.division.PassengerCapacity) {
        return;
    }

    for (let i = 0; i < booking.division.PassengerCapacity; i++) {
        booking.seats.push({
            LastName: undefined,
            FirstName: undefined,
            Weight: undefined
        });
    }
}
</script>

<template>
    <div class="flex flex-column gap-3">
        <div v-if="divisions.length > 0">
            <div class="flex gap-2 align-items-center">
                <i class="bi-ticket-detailed-fill text-xl" />
                <h4>Flugtyp auswählen</h4>
            </div>
            <PrimeDropdown ref="dropDown" v-model="booking.division" :options="divisions" optionLabel="Name" placeholder="Flugtyp" showClear class="w-full md:w-20rem" @change="initPassengers()" />
        </div>
        <div v-if="booking.seats.length > 0">
            <div class="flex gap-2 align-items-center">
                <i class="bi-people-fill text-xl" />
                <h4 v-if="booking.seats.length === 1">Passagier hinzufügen</h4>
                <h4 v-else>Passagiere hinzufügen (Min. 1 Passagier ist erforderlich)</h4>
            </div>
            <div class="flex flex-column gap-4">
                <PassengerEditMinimal v-for="(seat, index) in booking.seats" :key="index" :seat-number="index + 1" v-model:passenger="booking.seats[index]" :required="{ LastName: false, FirstName: false, Weight: true }" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
