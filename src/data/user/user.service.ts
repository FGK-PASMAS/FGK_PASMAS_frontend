import type { APIError } from "@/utils/errors/api.error";
import type { User } from "./user.interface";
import { fetchAPI } from "@/utils/services/fetch.service";

export const createUser = async (user: User): Promise<User | APIError> => {
    return await fetchAPI({
        resource: "user/createUser",
        method: "POST",
        data: user
    });
}
