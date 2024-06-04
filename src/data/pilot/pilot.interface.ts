import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Plane } from "../plane/plane.interface";

export interface Pilot extends EntityInterface {
    FirstName?: string;
    LastName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
}
