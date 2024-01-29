import { APIError } from "./api.error";

export class FetchError extends APIError {
    constructor(Message?: string) {
        super(
            "FETCH_ERROR", 
            Message ?? "Daten konnten nicht geladen werden."
        );
    }
}
