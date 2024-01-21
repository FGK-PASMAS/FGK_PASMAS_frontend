import { type Passenger } from "./passenger.interface";
const api = import.meta.env.VITE_API_URL;

export const getPassengers = async (): Promise<Passenger[]> => {
    try {
        const response = await fetch(api + "/passengers");

        if (!response.ok) {
            throw new Error("Network response was not OK - Code: " + response.status);
        }

        const apiResponse = await response.json();

        if (apiResponse.Success !== true) {
            throw new Error(apiResponse.Type + ": " + apiResponse.Message);
        }

        return apiResponse.Response;
    } catch (error) {
        console.log("Error catched in service.");
        throw error;
    }
}
