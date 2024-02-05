import type { APIError } from "@/utils/errors/api.error";
import { fetchAPI } from "@/utils/services/fetch.service";
import type { Plane } from "./plane.interface";

export const getPlanes = async (params?: Record<string, string>): Promise<Plane[] | APIError> => {
    return await fetchAPI({
        resource: "planes",
        method: "GET",
        params: params
    });
}
