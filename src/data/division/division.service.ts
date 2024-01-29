import { fetchGET } from "@/utils/services/fetch.service";
import type { APIError } from "@/utils/errors/api.error";
import type { Division } from "./division.interface";

export const getDivisions = async (): Promise<Division[] | APIError> => {
    return await fetchGET("/divisions");
}
