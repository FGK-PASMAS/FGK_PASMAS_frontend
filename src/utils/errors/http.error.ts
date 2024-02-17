import { APIError } from "./api.error";

export class HTTPError extends APIError {
    constructor(statusCode: number, Type?: string, Message?: string) {
        super(
            Type ?? "HTTP_ERROR", 
            Message ?? "Netzwerkantwort ist nicht OK - Statuscode: " + statusCode
        );
    }
}
