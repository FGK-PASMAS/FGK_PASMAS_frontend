import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import type { Plane } from "../plane/plane.interface";

export interface Division extends EntityInterface {
    Name?: string;
    PassengerCapacity?: number;
    Planes?: Plane[];
}
