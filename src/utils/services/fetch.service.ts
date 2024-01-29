import { APIError } from "../errors/api.error";
import { FetchError } from "../errors/fetch.error";
import { HTTPError } from "../errors/http.error";
import { SyntaxError } from "../errors/syntax.error";

const api = import.meta.env.VITE_API_URL;

export const fetchGET = async (resourceURL: string): Promise<any> => {
    try {
        const response = await fetch(api + resourceURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new HTTPError(response.status);
        }

        const apiResponse = await response.json();

        if (apiResponse.Success !== true) {
            throw apiResponse as APIError;
        }

        return apiResponse.Response;
    } catch (error) {
        return getAPIError(error);
    }
}

export const fetchPOST = async (resourceURL: string, body: any): Promise<any> => {
    try {
        const response = await fetch(api + resourceURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        if (!response.ok) {
            throw new HTTPError(response.status);
        }

        const apiResponse = await response.json();

        if (apiResponse.Success !== true) {
            throw apiResponse as APIError;
        }

        return apiResponse.Response;
    } catch (error) {
        return getAPIError(error);
    }
}

export const fetchDELETE = async (resourceURL: string): Promise<any> => {
    try {
        const response = await fetch(api + resourceURL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new HTTPError(response.status);
        }

        return true;
    } catch (error) {
        return getAPIError(error);
    }
}

// ToDo Error Messages
const getAPIError = (error: any): APIError => {
    if (error instanceof SyntaxError) {
        error = new SyntaxError();
    }

    if (!(error instanceof APIError)) {
        error = new FetchError();
    }

    switch(error.Type) {
        case "UNKNOWN_ERROR":
            error.Message = "Ein unerwarteter Fehler ist aufgetreten.";
            break;
        case "INVALID_REQUEST_BODY":
             error.Message = "Daten konnten nicht geladen werden.";
            break;
        case "FLIGHT_SLOT_NOT_FREE":
             error.Message = "Flugslot ist nicht frei.";
            break;
        case "OBJECT_NOT_FOUND":
             // error.Message = error.Message;
            break;
        case "NOT_IMPLEMENTED":
             // error.Message = error.Message;
            break;
        case "NOT_VALID_PARAMETERS":
             // error.Message = error.Message;
            break;
    }

    return error;
}
