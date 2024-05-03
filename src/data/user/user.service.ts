import type { APIError } from "@/utils/errors/api.error";
import type { User } from "./user.interface";
import { fetchAPI } from "@/utils/services/fetch.service";

export const getUsers = async (params?: Record<string, string | number | boolean>): Promise<User[] | APIError> => {
    return await fetchAPI({
        resource: "users",
        method: "GET",
        params: params
    });
}

export const createUser = async (user: User): Promise<User | APIError> => {
    return await fetchAPI({
        resource: "users",
        method: "POST",
        data: user
    });
}

export const deleteFlight = async(user: User): Promise<boolean | APIError> => {
    return await fetchAPI({
        resource: "users",
        method: "DELETE",
        id: user.ID
    });
}