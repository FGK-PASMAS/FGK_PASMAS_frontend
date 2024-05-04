import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Division } from "@/data/division/division.interface";
import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import { createFlight, deleteFlight, updateFlight } from "@/data/flight/flight.service";
import { type Passenger } from "@/data/passenger/passenger.interface";
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

    const totalPassengersWeight = computed(() => {
        return passengers.value.reduce((accumulator, passenger) => accumulator + (passenger.Weight ?? 0), 0);
    });

    // ToDo: This calculation is used in the flight store for virtual flights as well
    const etow = computed(() => {
        let etow = 0;
        let fuel = 0;

        if (!flight.value?.Plane || flight.value?.FuelAtDeparture === undefined || !flight.value.Pilot) {
            return etow;
        }

        if (flight.value.FuelAtDeparture > 0) {
            fuel = flight.value.FuelAtDeparture * flight.value.Plane.FuelConversionFactor!;
        }

        etow = flight.value.Plane.EmptyWeight! + totalPassengersWeight.value + fuel + flight.value.Pilot.Weight!;

        return etow;
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

    const isPassengersOk = computed(() => {
        return passengers.value.length > 0 && totalPassengersWeight.value > 0;
    });

    const isPassengersWeightOk = computed(() => {
        if (!flight.value) {
            return true;
        }

        if (etow.value > flight.value.Plane!.MTOW!) {
            return false;
        }

        if (!flight.value.Plane?.MaxSeatPayload || flight.value.Plane?.MaxSeatPayload < 0) {
            return true;
        }

        let isValid = true;

        passengers.value.every((passenger) => {
            if (passenger.Weight! > flight.value!.Plane!.MaxSeatPayload!) {
                isValid = false;
                return false;
            }
        });

        return isValid;
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

    async function reserveFlight(flightToReserve: Flight, toast: ToastServiceMethods): Promise<void>
    {
        flightToReserve.Passengers = passengers.value;

        const reservedFlight = await useValidateAPIData(createFlight(flightToReserve), toast);

        if (!reservedFlight) {
            return;
        }

        flight.value = reservedFlight;
    }

    async function cancelFlight(toast: ToastServiceMethods): Promise<Flight | undefined>
    {
        if (!flight.value) {
            return;
        }

        const deletedFlight = flight.value;

        await useValidateAPIData(deleteFlight(flight.value), toast);
        flight.value = undefined;

        return deletedFlight;
    }

    async function confirmBooking(toast: ToastServiceMethods): Promise<Flight | undefined>
    {
        flight.value!.Status = FlightStatus.BOOKED;
        flight.value!.Passengers = passengers.value;

        const bookedFlight = await useValidateAPIData(updateFlight(flight.value!), toast);

        return bookedFlight;
    }

    async function cancelBooking(toast: ToastServiceMethods): Promise<void>
    {
        if (!flight.value) {
            resetStore();
            return;
        }

        if (flight.value.Status === FlightStatus.RESERVED) {
            await useValidateAPIData(deleteFlight(flight.value), toast);
        }

        resetStore();
    }

    function resetStore(): void
    {
        division.value = undefined;
        seats.value = [];
        flight.value = undefined;
    }

    return { 
        division, 
        flight, 
        seats, 
        passengers, 
        totalPassengersWeight, 
        etow, 
        isEmpty, 
        isPassengersOk, 
        isPassengersWeightOk, 
        isFlightStepOk, 
        isConfirmationStepOk,
        reserveFlight, 
        cancelFlight, 
        confirmBooking, 
        cancelBooking, 
        resetStore 
    };
});
