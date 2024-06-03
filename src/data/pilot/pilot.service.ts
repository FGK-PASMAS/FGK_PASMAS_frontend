import type { APIError } from "@/core/errors/api.error";
import { fetchAPI } from "@/core/services/fetch.service";
import type { Pilot } from "./pilot.interface";

export const getPilots = async (params?: Record<string, string | number | boolean>): Promise<Pilot[] | APIError> => {
    return await fetchAPI({
        resource: "pilots",
        method: "GET",
        params: params
    });
}
