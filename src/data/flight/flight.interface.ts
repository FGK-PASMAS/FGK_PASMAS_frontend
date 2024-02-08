import type { Passenger } from "../passenger/passenger.interface";
import type { Pilot } from "../pilot/pilot.interface";
import type { Plane } from "../plane/plane.interface";

export interface Flight {
    ID?: number;
    Status: "OK" | "PLANNED" | "RESERVED" | "BOOKED" | "BLOCKED";
    Description?: string;
    FuelAtDeparture?: number;
    DepartureTime: Date;
    ArrivalTime: Date;
    PlaneId?: number;
    Plane?: Plane;
    PilotId?: number;
    Pilot?: Pilot;
    Passengers?: Passenger[];
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
