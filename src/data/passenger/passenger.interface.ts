import type { Flight } from "../flight/flight.interface";

export interface Passenger {
    ID?: number;
    LastName?: string;
    FirstName?: string;
    Weight: number;
    FlightID?: number;
    Flight?: Flight;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
