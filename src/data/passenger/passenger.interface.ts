import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import type { Flight } from "../flight/flight.interface";

export interface Passenger extends EntityInterface {
    LastName?: string;
    FirstName?: string;
    Weight?: number;
    FlightID?: number;
    Flight?: Flight;
}
