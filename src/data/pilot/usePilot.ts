import { fetchAPI } from "@/core/composables/useFetch";
import { APIError } from "@/core/errors/APIError";
import type { Pilot } from "@/data/pilot/Pilot";

export const getPilots = async (params?: Record<string, string | number | boolean>): Promise<Pilot[] | APIError> => {
    return await fetchAPI({
        resource: "pilots",
        method: "GET",
        params: params
    });
}
