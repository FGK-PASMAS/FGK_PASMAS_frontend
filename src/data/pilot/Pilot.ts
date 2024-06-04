import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import type { Plane } from "@/data/plane/Plane";

export interface Pilot extends EntityInterface {
    FirstName?: string;
    LastName?: string;
    Weight?: number;
    AllowedPlanes?: Plane[];
}
