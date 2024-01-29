import { APIError } from "./api.error";

export class HTTPError extends APIError {
    constructor(statusCode: number, Message?: string) {
        super(
            "HTTP_ERROR", 
            Message ?? "Netzwerkantwort ist nicht OK - Statuscode: " + statusCode
        );
    }
}
