import { DateTime } from "luxon";
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

export const fetchAuth = async (username: String, password: String): Promise<boolean | APIError>  => {
    const api = import.meta.env.VITE_API_URL;
    const url = api + "/auth";
    const credentials = btoa(username + ":" + password);

    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": "Basic " + credentials
        }
    }

    try {
        const response = await fetch(url, requestOptions);
        let apiResponse: any | undefined;

        if (!response.ok) {
            apiResponse = await response.json();
            
            if (apiResponse.Success !== false) {
                throw new HTTPError(response.status);
            }

            throw new HTTPError(response.status, apiResponse.Type, apiResponse.Message);
        }

        apiResponse = await response.json();

        if (apiResponse.Success !== true) {
            throw apiResponse as APIError;
        }

        localStorage.setItem("auth", apiResponse.Response);

        return true;
    } catch (error) {
        return getAPIError(error);
    }
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

    const token = localStorage.getItem("auth");

    const requestOptions = {
        method: method,
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : undefined
    };
    
    try {
        const response = await fetch(url, requestOptions);
        let apiResponse: any | undefined;

        if (!response.ok) {
            apiResponse = await response.json();
            
            if (apiResponse.Success !== false) {
                throw new HTTPError(response.status);
            }

            throw new HTTPError(response.status, apiResponse.Type, apiResponse.Message);
        }

        if (method === "DELETE") {
            return true;
        }

        apiResponse = await response.json();

        if (apiResponse.Success !== true) {
            throw apiResponse as APIError;
        }

        return parseAPIResponse(apiResponse.Response);
    } catch (error) {
        return getAPIError(error);
    }
}

export const parseAPIResponse = (data: any): any => {
    if (data === null || data === undefined || typeof data !== "object") {
        return data;
    }

    if(DateTime.fromISO(data).isValid) {
        return DateTime.fromISO(data);
    }

    Object.entries(data).forEach((entry) => {
        const [key, value]: [any, any] = entry;
        const date = DateTime.fromISO(value);

        if (typeof value !== "object" && typeof value !== "string") {
            return;
        }

        if (date.isValid) {
            data[key] = date;
        } else if (typeof value === "object") {
            parseAPIResponse(value);
        }
    });

    return data;
}

// ToDo: Fitting end user error messages
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
