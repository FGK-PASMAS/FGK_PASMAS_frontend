import { fetchAPI } from "@/core/composables/useFetch";
import { getStream } from "@/core/composables/useStream";
import { APIError } from "@/core/errors/APIError";
import type { EventSource } from "extended-eventsource";
import type { Plane } from "./plane.interface";

export const getPlanes = async (params?: Record<string, string | number | boolean>): Promise<Plane[] | APIError> => {
    return await fetchAPI({
        resource: "planes",
        method: "GET",
        params: params
    });
}

export const getPlaneById = async (id: number, params?: Record<string, string | number | boolean>): Promise<Plane[] | APIError> => {
    return await fetchAPI({
        resource: "planes",
        method: "GET",
        id: id,
        params: params
    });
}

export const updatePlane = async (plane: Plane): Promise<Plane | APIError> => {
    return await fetchAPI({
        resource: "planes",
        method: "PATCH",
        id: plane.ID,
        data: plane
    });
}

export const getPlanesStream = (): EventSource => {
    return getStream("planes");
}
