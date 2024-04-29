import type { EntityInterface } from "@/utils/interfaces/entity.interface";

export enum Role {
    ADMIN = "admin",
    VENDOR = "vendor",
    USER = "read-only"
}

export interface User extends EntityInterface {
    iss?: string;
    username?: string;
    role?: Role;
}
