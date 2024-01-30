import type { APIError } from "@/utils/errors/api.error";
import { fetchGET } from "@/utils/services/fetch.service";
import type { Division } from "./division.interface";

export const getDivisions = async (): Promise<Division[] | APIError> => {
    return await fetchGET("/divisions");
}
