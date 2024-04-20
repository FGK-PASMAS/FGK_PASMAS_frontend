import { FlightStatus, type Flight } from "@/data/flight/flight.interface";
import type { Pilot } from "@/data/pilot/pilot.interface";
import type { Plane } from "@/data/plane/plane.interface";
import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { bookingStore } from "./booking";
import { configStore } from "./config";

export const flightsStore = defineStore("flights", () => {
    const config = configStore();
    const booking = bookingStore();

    const eventStartTime: DateTime = config.eventStartTime!;
    const eventEndTime: DateTime = config.eventEndTime!;

    const offsetStartTime: number = 10;
    const upcomingStartTime: Ref<DateTime> = ref(DateTime.now().plus({ minutes: offsetStartTime }));

    const planes: Ref<Plane[]> = ref([]);
    const existingFlights: Ref<Flight[]> = ref([]);

    const flights = computed(() => {
        const flights: Flight[] = [];

        planes.value.forEach((plane) => {
            const duration = plane.FlightDuration! / 1000000000;
            let i = eventStartTime;

            while (i < eventEndTime) {
                let departure: DateTime = i;

                if (!i.equals(eventStartTime)) {
                    departure = departure.plus({ minutes: 1 });
                }

                const arrival = departure.plus({ seconds: duration });

                if (arrival < upcomingStartTime.value) {
                    i  = arrival;

                    continue;
                }

                const existingFlight = existingFlights.value.find((flight) => isExistingFlightInTimeSlot(flight, plane.ID!, departure, arrival));

                if (existingFlight) {
                    i = existingFlight.ArrivalTime!;

                    if (i > upcomingStartTime.value) {
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

    function calculateVirtualFlight(virtualFlight: Flight): Flight
    {
        let etow = 0;

        virtualFlight.Status = FlightStatus.UNKNOWN;
        virtualFlight.FuelAtDeparture = getFuelOfVirtualFlight(virtualFlight);

        etow = getETOWOfVirutalFlight(virtualFlight);

        if (etow === 0) {
            return virtualFlight;
        }

        virtualFlight.Pilot = getPilotOfVirtualFlight(virtualFlight, etow);

        if (!virtualFlight.Pilot) {
            return virtualFlight;
        }

        virtualFlight.PilotId = virtualFlight.Pilot!.ID;
        etow = etow + virtualFlight.Pilot.Weight!;

        if (etow > virtualFlight.Plane!.MTOW!) {
            virtualFlight.Status = FlightStatus.OVERLOADED;
            return virtualFlight;
        }

        if (!isSeatPayloadValid(virtualFlight)) {
            virtualFlight.Status = FlightStatus.OVERLOADED_SEAT;
            return virtualFlight;
        }

        virtualFlight.Status = FlightStatus.OK;

        return virtualFlight;
    }

    function getETOWOfVirutalFlight(virtualFlight: Flight): number
    {
        const plane = virtualFlight.Plane!;
        const passengersWeight = booking.totalPassengersWeight;
        let etow = 0;
        let fuel = 0;

        if (virtualFlight.FuelAtDeparture === undefined) {
            return etow;
        }

        if (virtualFlight.FuelAtDeparture > 0) {
            fuel = virtualFlight.FuelAtDeparture * plane.FuelConversionFactor!;
        }

        etow = plane.EmptyWeight! + passengersWeight + fuel;

        return etow;
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

    function getPilotOfVirtualFlight(virtualFlight: Flight, etow: number): Pilot | undefined
    {
        const plane = virtualFlight.Plane!;
        let pilot: Pilot | undefined = plane.PrefPilot;

        if (pilot) {
            if (etow + pilot.Weight! <= plane.MTOW!) {
                return pilot;
            }
        }

        if (!plane.AllowedPilots) {
            return pilot;
        }

        plane.AllowedPilots.some((allowedPilot) => {
            if (etow + allowedPilot.Weight! <= plane.MTOW!) {
                pilot = allowedPilot;
                return true;
            }
        });

        if (!pilot) {
            pilot = plane.AllowedPilots.reduce((pilot, allowedPilot) => {
                return (allowedPilot.Weight! < pilot.Weight!) ? allowedPilot : pilot;
            });
        }

        return pilot;
    }

    function isSeatPayloadValid(virtualFlight: Flight): boolean
    {
        const plane = virtualFlight.Plane!;
        let isValid = true;

        if (plane.MaxSeatPayload! === -1) {
            return isValid;
        }

        booking.passengers.every((passenger) => {
            if (passenger.Weight! > plane.MaxSeatPayload!) {
                isValid = false;
                return false;
            }
        });

        return isValid;
    }

    function compareFlights(a: Flight, b: Flight): number
    {
        if (!a.DepartureTime || !b.DepartureTime) {
            return 0;
        }

        if (a.DepartureTime < b.DepartureTime) {
            return -1;
        }
    
        if (a.DepartureTime > b.DepartureTime) {
            return 1;
        }
        
        if (a.Plane && b.Plane) {
            return a.Plane.AircraftType!.localeCompare(b.Plane.AircraftType!);
        }

        return 0;
    }

    function resetStore() 
    {
        planes.value = [];
        existingFlights.value = [];
    }

    return { upcomingStartTime, planes, existingFlights, flights, resetStore };
});
