import type { Plane } from "../plane/plane.interface";

export interface Pilot {
    ID?: number;
    LastName?: string;
    FirstName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
