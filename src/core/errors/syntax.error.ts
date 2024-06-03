import { APIError } from "./api.error";

export class SyntaxError extends APIError {
    constructor(Message?: string) {
        super(
            "SYNTAX_ERROR", 
            Message ?? "Daten konnten nicht geladen werden."
        );
    }
}
