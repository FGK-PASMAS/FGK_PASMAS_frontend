import { fetchAPI } from "@/core/composables/useFetch";
import type { APIError } from "@/core/errors/api.error";
import type { User } from "./user.interface";

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

export const deleteUser = async(user: User): Promise<boolean | APIError> => {
    return await fetchAPI({
        resource: "users",
        method: "DELETE",
        id: user.ID
    });
}
