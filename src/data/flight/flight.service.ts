import type { APIError } from "@/utils/errors/api.error";
import { fetchAPI } from "@/utils/services/fetch.service";
import { getStream } from "@/utils/services/stream.service";
import type { Flight } from "./flight.interface";

export const getFlights = async (params?: Record<string, string>): Promise<Flight[] | APIError> => {
    return await fetchAPI({ 
        resource: "flights", 
        method: "GET", 
        params: params 
    });
}

export const planFlight = async (flight: Flight): Promise<Flight | APIError> => {
    return await fetchAPI({
        resource: "flights/planning",
        method: "POST",
        data: flight
    });
}

export const reserveFlight = async (flight: Flight): Promise<Flight | APIError> => {
    return await fetchAPI({
        resource: "flights/reservation",
        method: "POST",
        id: flight.ID
    });
}

export const bookFlight = async (flight: Flight): Promise<Flight | APIError> => {
    return await fetchAPI({
        resource: "flights/booking",
        method: "POST",
        id: flight.ID
    });
}

export const deleteFlight = async (flight: Flight): Promise<boolean | APIError> => {
    return await fetchAPI({
        resource: "flights",
        method: "DELETE",
        id: flight.ID
    });
}

export const getFlightsStream = (): EventSource => {
    return getStream("flights");
}
