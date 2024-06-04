import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Plane } from "@/data/plane/Plane";

export interface Division extends EntityInterface {
    Name?: string;
    PassengerCapacity?: number;
    Planes?: Plane[];
}
