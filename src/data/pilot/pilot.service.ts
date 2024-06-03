import { fetchAPI } from "@/core/composables/useFetch";
import type { APIError } from "@/core/errors/api.error";
import type { Pilot } from "./pilot.interface";

export const getPilots = async (params?: Record<string, string | number | boolean>): Promise<Pilot[] | APIError> => {
    return await fetchAPI({
        resource: "pilots",
        method: "GET",
        params: params
    });
}
