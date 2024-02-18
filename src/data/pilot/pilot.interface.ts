import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import type { Plane } from "../plane/plane.interface";

export interface Pilot extends EntityInterface {
    LastName?: string;
    FirstName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
}
