import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Division } from "@/data/division/division.interface";
import type { Flight } from "@/data/flight/flight.interface";
import { deleteFlight } from "@/data/flight/flight.service";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { defineStore } from "pinia";
import type { ToastServiceMethods } from "primevue/toastservice";
import { computed, ref, type Ref } from "vue";

export const bookingStore = defineStore("booking", () => {
    const division: Ref<Division | undefined> = ref();
    const seats: Ref<Passenger[]> = ref([]);
    const flight: Ref<Flight | undefined> = ref();

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

    async function cancelBooking(toast: ToastServiceMethods) {
        if (!flight.value) {
            resetStore();
            return;
        }

        await useValidateAPIData(deleteFlight(flight.value), toast);
        resetStore();
    }

    function resetStore() {
        division.value = undefined;
        seats.value = [];
        flight.value = undefined;
    }

    return { division, flight, seats, passengers, totalWeight, isEmpty, cancelBooking, resetStore };
});
