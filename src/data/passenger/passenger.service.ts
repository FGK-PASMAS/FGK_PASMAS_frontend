import type { APIError } from "@/core/errors/api.error";
import { fetchAPI } from "@/core/services/fetch.service";
import { getStream } from "@/core/services/stream.service";
import { EventSource } from "extended-eventsource";
import type { Passenger } from "./passenger.interface";

export const getPassengers = async (params?: Record<string, string | number | boolean>): Promise<Passenger[] | APIError> => {
    return await fetchAPI({ 
        resource: "passengers", 
        method: "GET", 
        params: params 
    });
}

export const getPassengersStream = (): EventSource => {
    return getStream("passengers");
}
