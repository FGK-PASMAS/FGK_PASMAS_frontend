import type { Division } from "@/data/division/division.interface";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const bookingStore = defineStore("booking", () => {
    const division: Ref<Division | undefined> = ref();
    const seats: Ref<Passenger[]> = ref([]);

    const passengers = computed(() => {
        return seats.value.filter((passenger) => passenger.Weight);
    });

    const totalWeight = computed(() => {
        return passengers.value.reduce((accumulator, passenger) => accumulator + (passenger.Weight ?? 0), 0);
    });
    
    const isEmpty = computed(() => {
        if (division.value) {
            return false;
        }

        if (seats.value.length > 0) {
            return false;
        }

        return true;
    });

    function resetStore() {
        division.value = undefined;
        seats.value = [];
    }

    return { division, seats, passengers, totalWeight, isEmpty, resetStore };
});
