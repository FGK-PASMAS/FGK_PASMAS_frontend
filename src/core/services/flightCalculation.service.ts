import type { Flight } from "@/data/flight/flight.interface";
import type { Passenger } from "@/data/passenger/passenger.interface";

export const getTotalPassengersWeight = (passengers?: Passenger[]): number => {
    if (!passengers) {
        return 0;
    }

    return passengers.reduce((accumulator, passenger) => accumulator + (passenger.Weight ?? 0), 0);
}

export const isSeatPayloadValid = (flight: Flight, passengers?: Passenger[]): boolean => {
    let isValid = true;
    
    if (!passengers) { 
        return isValid;
    }

    if (!flight.Plane?.MaxSeatPayload) {
        return isValid;
    }

    if (flight.Plane.MaxSeatPayload === -1) {
        return isValid;
    }

    passengers.every((passenger) => {
        if (passenger.Weight! > flight.Plane!.MaxSeatPayload!) {
            isValid = false;
            return false;
        }
    });

    return isValid;
}

/**
 * Get intermediate takeoff weight (ITOW) of a flight.
 * ITOW doesn't account for the pilot; it only calculates the weight based on the plane and passengers.
 * 
 * @param flight 
 * @param passengers 
 * @returns Intermediate takeoff weight
 */
export const getITOW = (flight: Flight, passengers?: Passenger[]): number => {
    const passengersWeight = getTotalPassengersWeight(passengers);
    let fuel = 0;
    let etow = 0;

    if (!flight.Plane?.EmptyWeight) {
        return etow;
    }

    if (flight.FuelAtDeparture === undefined) {
        return etow;
    }

    if (flight.FuelAtDeparture >= 0 && flight.Plane.FuelConversionFactor) {
        fuel = flight.FuelAtDeparture * flight.Plane.FuelConversionFactor;
    }

    etow = flight.Plane.EmptyWeight + passengersWeight + fuel;

    return etow;
}

/**
 * Get effective takeoff weight (ETOW) of a flight.
 * 
 * @param flight 
 * @param passengers 
 * @returns Effective takeoff weight
 */
export const getETOW = (flight: Flight, passengers?: Passenger[]): number => {
    let etow = 0;

    if (!flight.Pilot?.Weight) {
        return etow;
    }

    etow = getITOW(flight, passengers) + flight.Pilot.Weight;

    return etow;
}

export const setOptimalPilot = (flight: Flight, passengers?: Passenger[]): void => {
    const initialPilot = flight.Pilot;
    
    if (!flight.Plane?.MTOW) {
        return;
    }

    if (initialPilot) {
        if (getETOW(flight, passengers) <= flight.Plane.MTOW) {
            return;
        }
    }

    if (!flight.Plane.AllowedPilots) {
        return;
    }

    flight.Plane.AllowedPilots.some((allowedPilot) => {
        flight.PilotId = allowedPilot.ID;
        flight.Pilot = allowedPilot;

        if (getETOW(flight, passengers) <= flight.Plane!.MTOW!) {
            return true;
        }

        flight.PilotId = initialPilot?.ID;
        flight.Pilot = initialPilot;
    });
}

export const isFuelEnough = (flight: Flight): boolean => {
    if (!flight.Plane?.FuelMaxCapacity || flight.Plane.FuelMaxCapacity === -1) {
        return true;
    }

    if (!flight.FuelAtDeparture || !flight.Plane.FuelburnPerFlight) {
        return false;
    }

    if ((flight.FuelAtDeparture - flight.Plane.FuelburnPerFlight) < 0) {
        return false;
    }

    return true;
}

export const compareFlights = (a: Flight, b: Flight): number => {
    if (!a.DepartureTime && !b.DepartureTime) {
        return 0;
    }

    if (a.DepartureTime && !b.DepartureTime) {
        return 1;
    }

    if (!a.DepartureTime && b.DepartureTime) {
        return -1;
    }

    if (a.DepartureTime! > b.DepartureTime!) {
        return 1;
    }

    if (a.DepartureTime! < b.DepartureTime!) {
        return -1;
    }

    if (!a.Plane && !b.Plane) {
        return 0;
    }

    if (a.Plane && !b.Plane) {
        return 1;
    }

    if (!a.Plane && b.Plane) {
        return -1;
    }

    if (!a.Plane?.AircraftType && !b.Plane?.AircraftType) {
        return 0;
    }

    if (a.Plane?.AircraftType && !b.Plane?.AircraftType) {
        return 1;
    }

    if (!a.Plane?.AircraftType && b.Plane?.AircraftType) {
        return -1;
    }

    return a.Plane!.AircraftType!.localeCompare(b.Plane!.AircraftType!);
}
