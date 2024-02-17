import type { DateTimeMaybeValid } from "luxon";
import type { Passenger } from "../passenger/passenger.interface";
import type { Pilot } from "../pilot/pilot.interface";
import type { Plane } from "../plane/plane.interface";

export enum FlightStatus {
    OK = "OK",
    OVERLOADED = "OVERLOADED",
    OVERLOADED_SEAT = "OVERLOADED_SEAT",
    RESERVED = "RESERVED",
    BOOKED = "BOOKED",
    BLOCKED = "BLOCKED",
    UNKNOWN = "UNKNOWN",
}

export interface Flight {
    ID?: number;
    Status?: FlightStatus;
    Description?: string;
    FuelAtDeparture?: number;
    DepartureTime?: DateTimeMaybeValid;
    ArrivalTime?: DateTimeMaybeValid;
    PlaneId?: number;
    Plane?: Plane;
    PilotId?: number;
    Pilot?: Pilot;
    Passengers?: Passenger[];
    CreatedAt?: DateTimeMaybeValid;
    UpdatedAt?: DateTimeMaybeValid;
    DeletedAt?: DateTimeMaybeValid;
}
