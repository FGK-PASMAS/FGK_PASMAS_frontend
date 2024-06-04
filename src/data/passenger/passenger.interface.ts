import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Flight } from "../flight/flight.interface";

export enum PassengerAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}

export interface Passenger extends EntityInterface {
    Action?: PassengerAction;
    LastName?: string;
    FirstName?: string;
    Weight?: number;
    PassNo?: number;
    FlightID?: number;
    Flight?: Flight;
}
