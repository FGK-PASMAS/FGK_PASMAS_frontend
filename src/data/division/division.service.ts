import { fetchGET } from "@/utils/services/fetch.service";
import type { Division } from "./division.interface";

export const getDivisions = async (): Promise<Division[]> => {
    return await fetchGET("/divisions");
}
