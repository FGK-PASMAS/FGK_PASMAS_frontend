import { fetchGET, fetchPOST, fetchDELETE } from "@/utils/services/fetch.service";
import { getStream } from "@/utils/services/stream.service";
import type { Passenger } from "./passenger.interface";

export const getPassengers = async (): Promise<Passenger[]> => {
    return await fetchGET("/passengers");
}

export const createPassenger = async (passenger: Passenger): Promise<Passenger> => {
    return await fetchPOST("/passengers", JSON.stringify(passenger));
}

export const deletePassenger = async (id: number): Promise<boolean> => {
    return await fetchDELETE("/passengers/" + id);
}

export const getPassengersStream = (): EventSource => {
    return getStream("/passengers");
}
