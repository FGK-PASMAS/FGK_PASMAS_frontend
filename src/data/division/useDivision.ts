import { fetchAPI } from "@/core/composables/useFetch";
import { APIError } from "@/core/errors/APIError";
import type { Division } from "@/data/division/Division";

export const getDivisions = async (params?: Record<string, string | number | boolean>): Promise<Division[] | APIError> => {
    return await fetchAPI({ 
        resource: "divisions", 
        method: "GET", 
        params: params 
    });
}
