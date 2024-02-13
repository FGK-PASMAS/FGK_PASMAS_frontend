import type { DateTimeMaybeValid } from "luxon";
import type { Plane } from "../plane/plane.interface";

export interface Division {
    ID?: number;
    Name?: string;
    PassengerCapacity?: number;
    Planes?: Plane[];
    CreatedAt?: DateTimeMaybeValid;
    UpdatedAt?: DateTimeMaybeValid;
    DeletedAt?: DateTimeMaybeValid;
}
