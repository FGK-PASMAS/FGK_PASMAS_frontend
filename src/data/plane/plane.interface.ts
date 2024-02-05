import type { Division } from "../division/division.interface";
import type { Flight } from "../flight/flight.interface";
import type { Pilot } from "../pilot/pilot.interface";

export interface Plane {
    ID?: number;
    Registration?: string;
    AircraftType?: string;
    FlightDuration?: number;
    FuelMaxCapacity?: number;
    FuelburnPerFlight?: number;
    FuelConversionFactor?: number;
    MTOW?: number;
    EmptyWeight?: number;
    MaxSeatPayload?: number;
    Division?: Division;
    AllowedPilots?: Pilot[];
    PrefPilotId?: number;
    PrefPilot?: Pilot;
    Flights?: Flight[];
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
