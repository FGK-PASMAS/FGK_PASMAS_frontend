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
    
    // ToDo: Additional fields due to API user model being different during authentication and app context 
    Name?: string;
    Role?: string;
    Password?: string;
}
