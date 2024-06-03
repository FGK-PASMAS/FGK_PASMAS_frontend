import { fetchAPI } from "@/core/composables/useFetch";
import type { APIError } from "@/core/errors/api.error";
import type { Division } from "./division.interface";

export const getDivisions = async (params?: Record<string, string | number | boolean>): Promise<Division[] | APIError> => {
    return await fetchAPI({ 
        resource: "divisions", 
        method: "GET", 
        params: params 
    });
}
