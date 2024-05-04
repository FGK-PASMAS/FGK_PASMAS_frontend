import type { EntityInterface } from "@/utils/interfaces/entity.interface";

export enum Role {
    ADMIN = "admin",
    VENDOR = "vendor",
    USER = "read-only"
}

export interface User extends EntityInterface {
    Iss?: string;
    Username?: string;
    Password?: string;
    Role?: Role;
}
