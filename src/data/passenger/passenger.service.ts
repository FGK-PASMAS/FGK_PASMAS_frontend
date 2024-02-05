import type { APIError } from "@/utils/errors/api.error";
import { fetchAPI } from "@/utils/services/fetch.service";
import { getStream } from "@/utils/services/stream.service";
import type { Passenger } from "./passenger.interface";

export const getPassengers = async (params?: Record<string, string>): Promise<Passenger[] | APIError> => {
    return await fetchAPI({ 
        resource: "passengers", 
        method: "GET", 
        params: params 
    });
}

export const createPassenger = async (passenger: Passenger): Promise<Passenger | APIError> => {
    return await fetchAPI({ 
        resource: "passengers", 
        method: "POST", 
        data: passenger 
    });
}

export const updatePassenger = async (passenger: Passenger): Promise<Passenger | APIError> => {
    return await fetchAPI({ 
        resource: "passengers", 
        method: "PUT",
        id: passenger.ID,
        data: passenger
     });
}

export const deletePassenger = async (passenger: Passenger): Promise<boolean | APIError> => {
    return await fetchAPI({
        resource: "passengers",
        method: "DELETE",
        id: passenger.ID
    });
}

export const getPassengersStream = (): EventSource => {
    return getStream("passengers");
}
