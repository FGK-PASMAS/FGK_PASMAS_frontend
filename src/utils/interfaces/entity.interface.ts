import type { DateTimeMaybeValid } from "luxon";

export interface EntityInterface {
    ID?: number;
    CreatedAt?: DateTimeMaybeValid;
    UpdatedAt?: DateTimeMaybeValid;
    DeletedAt?: DateTimeMaybeValid;
}
