import { fetchAPI } from "@/core/composables/useFetch";
import { getStream } from "@/core/composables/useStream";
import type { APIError } from "@/core/errors/api.error";
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
