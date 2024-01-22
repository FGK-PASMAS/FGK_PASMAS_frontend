import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type Passenger } from "@/data/passenger/passenger.interface";
import { type Division } from "@/data/division/division.interface";

export const bookingStore = defineStore("booking", () => {
    const division = ref<Division>();
    const passengers = ref<Passenger[]>([]);
    const totalWeight = computed(() => passengers.value.reduce( (accumulator, passenger) => accumulator + (passenger.Weight ?? 0), 0));

    function resetBooking() {
        division.value = undefined;
        passengers.value = [];
    }

    return { division, passengers, totalWeight, resetBooking };
});
