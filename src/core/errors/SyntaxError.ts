import { APIError } from "@/core/errors/APIError";

export class SyntaxError extends APIError {
    constructor(Message?: string) {
        super(
            "SYNTAX_ERROR", 
            Message ?? "Daten konnten nicht geladen werden."
        );
    }
}
