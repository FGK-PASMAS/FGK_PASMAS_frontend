import type { EntityInterface } from "@/utils/interfaces/entity.interface";
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

export enum FlightStatusColor {
    OK = "text-primary-400",
    OVERLOADED = "text-red-400",
    OVERLOADED_SEAT = "text-red-400",
    RESERVED = "text-blue-400",
    BOOKED = "text-blue-400",
    BLOCKED = "text-yellow-400",
    UNKNOWN = "text-bluegray-400",
}

export enum FlightStatusBgColor {
    OK = "bg-primary-400",
    OVERLOADED = "bg-red-400",
    OVERLOADED_SEAT = "bg-red-400",
    RESERVED = "bg-blue-400",
    BOOKED = "bg-blue-400",
    BLOCKED = "bg-yellow-400",
    UNKNOWN = "bg-bluegray-400",
}

export enum FlightStatusDisplayName {
    OK = "Ok",
    OVERLOADED = "Überladen",
    OVERLOADED_SEAT = "Sitz überladen",
    RESERVED = "Reserviert",
    BOOKED = "Gebucht",
    BLOCKED = "Geblockt",
    UNKNOWN = "Unbekannter Status",
}

export interface Flight extends EntityInterface {
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
}
