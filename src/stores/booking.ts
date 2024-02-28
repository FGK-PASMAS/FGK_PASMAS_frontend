import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Division } from "@/data/division/division.interface";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { deleteFlight, updateFlight } from "@/data/flight/flight.service";
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

    const isPassengerStepOk = computed(() => {
        return totalWeight.value > 0;
    });

    const isFlightStepOk = computed(() => {
        return flight.value ? true : false;
    });

    const isConfirmationStepOk = computed(() => {
        const passengerCheck = passengers.value.every((passenger) => {
            return passenger.Weight && passenger.LastName && passenger.FirstName;
        });

        return passengerCheck && isFlightStepOk;
    });

    async function confirmBooking(toast: ToastServiceMethods): Promise<void>
    {
        if(!isConfirmationStepOk.value) {
            return;
        }

        flight.value!.Status = FlightStatus.BOOKED;
        flight.value!.Passengers = passengers.value;

        flight.value = await useValidateAPIData(updateFlight(flight.value!), toast);

        seats.value = flight.value!.Passengers!;
    }

    async function cancelBooking(toast: ToastServiceMethods): Promise<void>
    {
        if (!flight.value) {
            resetStore();
            return;
        }

        await useValidateAPIData(deleteFlight(flight.value), toast);
        resetStore();
    }

    function resetStore(): void
    {
        division.value = undefined;
        seats.value = [];
        flight.value = undefined;
    }

    return { division, flight, seats, passengers, totalWeight, isEmpty, isPassengerStepOk, isFlightStepOk, isConfirmationStepOk, confirmBooking, cancelBooking, resetStore };
});
