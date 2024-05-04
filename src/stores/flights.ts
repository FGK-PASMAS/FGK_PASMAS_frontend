import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import type { Plane } from "@/data/plane/plane.interface";
import { compareFlights, getETOW, getITOW, isSeatPayloadValid, setOptimalPilot } from "@/utils/services/flightCalculation.service";
import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { bookingStore } from "./booking";

export const flightsStore = defineStore("flights", () => {
    const booking = bookingStore();

    const planes: Ref<Plane[]> = ref([]);
    const existingFlights: Ref<Flight[]> = ref([]);

    const flights = computed(() => {
        const flights: Flight[] = [];

        planes.value.forEach((plane) => {
            const slotStartTime = plane.SlotStartTime;
            const slotEndTime = plane.SlotEndTime;
            const upcomingStartTime = DateTime.now();

            if (!slotStartTime || !slotEndTime) {
                return;
            }

            const duration = plane.FlightDuration! / 1000000000;
            let i = slotStartTime;

            while (i < slotEndTime) {
                let departure: DateTime = i;

                if (!i.equals(slotStartTime)) {
                    departure = departure.plus({ minutes: 1 });
                }

                const arrival = departure.plus({ seconds: duration });

                if (departure < upcomingStartTime) {
                    i  = arrival;

                    continue;
                }

                const existingFlight = existingFlights.value.find((flight) => isExistingFlightInTimeSlot(flight, plane.ID!, departure, arrival));

                if (existingFlight) {
                    i = existingFlight.ArrivalTime!;

                    if (i > upcomingStartTime) {
                        flights.push(existingFlight);
                    }
                
                    continue;
                }

                let virtualFlight: Flight = {
                    DepartureTime: departure,
                    ArrivalTime: arrival,
                    PlaneId: plane.ID!,
                    Plane: plane
                }

                virtualFlight = calculateVirtualFlight(virtualFlight);
                
                flights.push(virtualFlight);
                i = arrival;
            }
        });

        flights.sort(compareFlights);

        return flights;
    });

    function isExistingFlightInTimeSlot(flight: Flight, planeId: number, departure: DateTime, arrival: DateTime): boolean
    {   
        if (!flight.ArrivalTime || !flight.DepartureTime) {
            return false;
        }
        
        if (flight.PlaneId === planeId && flight.ArrivalTime >= departure && flight.DepartureTime <= arrival) {
            return true;
        }
    
        return false;
    }

    function getPreviousExistingFlight(virtualFlight: Flight): Flight | undefined
    {
        return existingFlights.value.findLast((existingFlight) => {
            if (!existingFlight.ArrivalTime || !virtualFlight.DepartureTime) {
                return false;
            }

            if (existingFlight.PlaneId === virtualFlight.PlaneId && existingFlight.ArrivalTime < virtualFlight.DepartureTime) {
                return true;
            }

            return false;
        });
    }

    function getFuelOfVirtualFlight(virtualFlight: Flight): number
    {
        const plane = virtualFlight.Plane!;
        let fuel = -1;
        let prevFlight: Flight | undefined = undefined;

        if (plane.FuelMaxCapacity === -1) {
            return fuel;
        }

        prevFlight = getPreviousExistingFlight(virtualFlight);

        if (prevFlight) {
            fuel = prevFlight.FuelAtDeparture! - plane.FuelburnPerFlight!;
        } else {
            fuel = plane.FuelStartAmount!;
        }

        return fuel;
    }

    function calculateVirtualFlight(virtualFlight: Flight): Flight
    {
        virtualFlight.Status = FlightStatus.UNKNOWN;
        virtualFlight.FuelAtDeparture = getFuelOfVirtualFlight(virtualFlight);

        const itow = getITOW(virtualFlight, booking.passengers);

        if (itow === 0) {
            return virtualFlight;
        }

        if (!virtualFlight.Plane?.PrefPilot) {
            return virtualFlight;
        }

        virtualFlight.Pilot = virtualFlight.Plane.PrefPilot;
        setOptimalPilot(virtualFlight, booking.passengers);

        if (getETOW(virtualFlight, booking.passengers) > virtualFlight.Plane!.MTOW!) {
            virtualFlight.Status = FlightStatus.OVERLOADED;
            return virtualFlight;
        }

        if (!isSeatPayloadValid(virtualFlight, booking.passengers)) {
            virtualFlight.Status = FlightStatus.OVERLOADED_SEAT;
            return virtualFlight;
        }

        virtualFlight.Status = FlightStatus.OK;

        return virtualFlight;
    }

    function resetStore() 
    {
        planes.value = [];
        existingFlights.value = [];
    }

    return { planes, existingFlights, flights, resetStore };
});
