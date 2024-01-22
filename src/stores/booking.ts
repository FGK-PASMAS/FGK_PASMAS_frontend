import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type Division } from "@/data/division/division.interface";
import { type Passenger } from "@/data/passenger/passenger.interface";

export const bookingStore = defineStore("booking", () => {
    const division = ref<Division>();
    const seats = ref<Passenger[]>([]);
    const passengers = computed(() => seats.value.filter((passenger) => passenger.Weight));
    const totalWeight = computed(() => passengers.value.reduce( (accumulator, passenger) => accumulator + (passenger.Weight ?? 0), 0));

    function resetBooking() {
        division.value = undefined;
        seats.value = [];
    }

    return { division, seats, passengers, totalWeight, resetBooking };
});
