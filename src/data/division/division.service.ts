import type { APIError } from "@/core/errors/api.error";
import { fetchAPI } from "@/core/services/fetch.service";
import type { Division } from "./division.interface";

export const getDivisions = async (params?: Record<string, string | number | boolean>): Promise<Division[] | APIError> => {
    return await fetchAPI({ 
        resource: "divisions", 
        method: "GET", 
        params: params 
    });
}
