import type { Plane } from "../plane/plane.interface";

export interface Division {
    ID?: number;
    Name: string;
    PassengerCapacity: number;
    Planes?: Plane[];
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
