import type { APIError } from "@/utils/errors/api.error";
import { fetchAPI } from "@/utils/services/fetch.service";
import { getStream } from "@/utils/services/stream.service";
import { EventSource } from "extended-eventsource";
import type { Flight } from "./flight.interface";

export const getFlights = async (params?: Record<string, string | number | boolean>): Promise<Flight[] | APIError> => {
    return await fetchAPI({ 
        resource: "flights", 
        method: "GET", 
        params: params 
    });
}

export const createFlight = async (flight: Flight): Promise<Flight | APIError> => {
    return await fetchAPI({
        resource: "flights",
        method: "POST",
        data: flight
    });
}

export const updateFlight = async (flight: Flight): Promise<Flight | APIError> => {
    return await fetchAPI({
        resource: "flights",
        method: "POST",
        id: flight.ID,
        data: flight
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

export const getFlightsByDivisionStream = (divisionId: number): EventSource => {
    return getStream("divisions/" + divisionId + "/flights");
}
