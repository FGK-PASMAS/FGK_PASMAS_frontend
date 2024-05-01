import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import type { Division } from "../division/division.interface";
import type { Flight } from "../flight/flight.interface";
import type { Pilot } from "../pilot/pilot.interface";
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
