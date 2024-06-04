import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Plane } from "../plane/plane.interface";

export interface Division extends EntityInterface {
    Name?: string;
    PassengerCapacity?: number;
    Planes?: Plane[];
}
