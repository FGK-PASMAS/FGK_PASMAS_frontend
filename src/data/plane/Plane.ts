import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Division } from "@/data/division/Division";
import type { Flight } from "@/data/flight/Flight";
import type { Pilot } from "@/data/pilot/Pilot";
import type { DateTimeMaybeValid } from "luxon";

export interface Plane extends EntityInterface {
    Registration?: string;
    AircraftType?: string;
    FlightDuration?: number;
    FuelMaxCapacity?: number;
    FuelStartAmount?: number;
    FuelburnPerFlight?: number;
    FuelConversionFactor?: number;
    MTOW?: number;
    EmptyWeight?: number;
    MaxSeatPayload?: number;
    DivisionId?: number;
    Division?: Division;
    AllowedPilots?: Pilot[];
    PrefPilotId?: number;
    PrefPilot?: Pilot;
    Flights?: Flight[];
    SlotStartTime?: DateTimeMaybeValid;
    SlotEndTime?: DateTimeMaybeValid;
}
