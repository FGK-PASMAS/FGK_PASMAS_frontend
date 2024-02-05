import type { Plane } from "../plane/plane.interface";

export interface Pilot {
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
