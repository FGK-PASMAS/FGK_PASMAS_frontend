import { type Division } from "./division.interface";
const api = import.meta.env.VITE_API_URL;

export const getDivisions = async (): Promise<Division[]> => {
    try {
        const response = await fetch(api + "/division/");

        if (!response.ok) {
            throw new Error("Network response was not OK");
        }

        const apiResponse = await response.json();

        if (apiResponse.success !== true) {
            throw new Error("Insert API error body here...");
        }

        return apiResponse.response;
    } catch (error) {
        console.log("Error catched in service.");
        throw error;
    }
}
