import type { Flight } from "@/data/flight/flight.interface";
import type { Plane } from "@/data/plane/plane.interface";
import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const flightsStore = defineStore("flights", () => {
    // ToDo Configure time interval
    const startTime: DateTime = DateTime.fromISO("2024-02-06T11:00:00.000000Z");
    const endTime: DateTime = DateTime.fromISO("2024-02-06T18:00:00.000000Z");

    const planes: Ref<Plane[]> = ref([]);
    const existingFlights: Ref<Flight[]> = ref([]);

    const flights = computed(() => {
        const flights: Flight[] = [];

        planes.value.forEach((plane) => {
            if (!plane.FlightDuration) {
                return;
            }

            const duration = plane.FlightDuration / 1000000000;

            let i = startTime;

            while (i < endTime) {
                let departure = i;

                if (!i.equals(startTime)) {
                    departure = departure.plus({ minutes: 1 });
                }

                const arrival = departure.plus({ seconds: duration });

                const existingFlight = existingFlights.value.find((flight) => isFlightInTimeSlot(flight, plane.ID!, departure, arrival));

                if (existingFlight) {
                    flights.push(existingFlight);
                    i = existingFlight.ArrivalTime;

                    continue;
                }

                const virtualFlight: Flight = {
                    Status: "OK",
                    DepartureTime: departure,
                    ArrivalTime: arrival,
                    PlaneId: plane.ID!,
                    Plane: plane
                }
                
                flights.push(virtualFlight);
                i = arrival;
            }
        });

        flights.sort(compareFlights);

        return flights;
    });

    function isFlightInTimeSlot(flight: Flight, planeId: number, departure: DateTime, arrival: DateTime): boolean {    
        if (flight.PlaneId === planeId && flight.ArrivalTime >= departure && flight.DepartureTime <= arrival) {
            return true;
        }
    
        return false;
    }

    function compareFlights(a: Flight, b: Flight): number {
        if (a.DepartureTime < b.DepartureTime) {
            return -1;
        }
    
        if (a.DepartureTime > b.DepartureTime) {
            return 1;
        }
        
        if (a.Plane && b.Plane) {
            return a.Plane.AircraftType.localeCompare(b.Plane.AircraftType)
        }

        return 0;
    }

    function resetStore() {
        planes.value = [];
        existingFlights.value = [];
    }

    return { planes, existingFlights, flights, isFlightInTimeSlot, compareFlights, resetStore };
});
