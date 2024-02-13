import type { DateTimeMaybeValid } from "luxon";
import type { Plane } from "../plane/plane.interface";

export interface Pilot {
    ID?: number;
    LastName?: string;
    FirstName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
    CreatedAt?: DateTimeMaybeValid;
    UpdatedAt?: DateTimeMaybeValid;
    DeletedAt?: DateTimeMaybeValid;
}
