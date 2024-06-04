import { fetchAPI } from "@/core/composables/useFetch";
import { getStream } from "@/core/composables/useStream";
import { APIError } from "@/core/errors/APIError";
import type { Passenger } from "@/data/passenger/Passenger";
import { EventSource } from "extended-eventsource";

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
