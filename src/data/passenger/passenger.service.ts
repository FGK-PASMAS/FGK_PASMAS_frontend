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

export const createPassenger = async (passenger: Passenger): Promise<Passenger> => {
    try {
        const response = await fetch(api + "/passengers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(passenger)
        });

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

export const deletePassenger = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(api + "/passengers/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not OK - Code: " + response.status);
        }

        return true;
    } catch (error) {
        console.log("Error catched in service.");
        throw error;
    }
}
