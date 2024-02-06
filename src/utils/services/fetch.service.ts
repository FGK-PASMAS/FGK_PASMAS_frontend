import { APIError } from "../errors/api.error";
import { FetchError } from "../errors/fetch.error";
import { HTTPError } from "../errors/http.error";
import { SyntaxError } from "../errors/syntax.error";

interface FetchAPIRequest {
    resource: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    id?: number | string,
    data?: any,
    params?: Record<string, string | number | boolean>
}

export const fetchAPI = async ({ resource, id, method, data, params }: FetchAPIRequest): Promise<any> => {
    const api = import.meta.env.VITE_API_URL;

    let url = api + "/" + resource;

    if (id) {
        url += "/" + id;
    }

    if (params) {
        const queryParams: Record<string, string> = {};

        Object.entries(params).forEach(([key, value]) => {
            queryParams[key] = value.toString();
        });

        url += "?" + new URLSearchParams(queryParams);
    }

    const requestOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : undefined
    };
    
    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new HTTPError(response.status);
        }

        if (method === "DELETE") {
            return true;
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

// ToDo Fitting end user error messages
const getAPIError = (error: any): APIError => {
    if (error instanceof SyntaxError) {
        error = new SyntaxError();
    }

    if (!(error instanceof APIError)) {
        error = new FetchError();
    }

    switch(error.Type) {
        case "UNKNOWN_ERROR":
            // error.Message = "Fitting error message for user here.";
            break;
        case "INVALID_REQUEST_BODY":
            // error.Message = "Fitting error message for user here.";
            break;
        case "FLIGHT_SLOT_NOT_FREE":
            // error.Message = "Fitting error message for user here.";
            break;
        case "OBJECT_NOT_FOUND":
            // error.Message = "Fitting error message for user here.";
            break;
        case "NOT_IMPLEMENTED":
            // error.Message = "Fitting error message for user here.";
            break;
        case "NOT_VALID_PARAMETERS":
            // error.Message = "Fitting error message for user here.";
            break;
    }

    return error;
}
