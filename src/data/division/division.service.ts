import type { APIError } from "@/utils/errors/api.error";
import { fetchAPI } from "@/utils/services/fetch.service";
import type { Division } from "./division.interface";

export const getDivisions = async (params?: Record<string, string>): Promise<Division[] | APIError> => {
    return await fetchAPI({ 
        resource: "divisions", 
        method: "GET", 
        params: params 
    });
}
