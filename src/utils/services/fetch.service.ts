const api = import.meta.env.VITE_API_URL;

export const fetchGET = async (resourceURL: string): Promise<any> => {
    const response = await fetch(api + resourceURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Network response was not OK - Code: " + response.status);
    }

    const apiResponse = await response.json();

    if (apiResponse.Success !== true) {
        throw new Error(apiResponse.Type + ": " + apiResponse.Message);
    }

    return apiResponse.Response;
}

export const fetchPOST = async (resourceURL: string, body: any): Promise<any> => {
    const response = await fetch(api + resourceURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });

    if (!response.ok) {
        throw new Error("Network response was not OK - Code: " + response.status);
    }

    const apiResponse = await response.json();

    if (apiResponse.Success !== true) {
        throw new Error(apiResponse.Type + ": " + apiResponse.Message);
    }

    return apiResponse.Response;
}

export const fetchDELETE = async (resourceURL: string): Promise<any> => {
    const response = await fetch(api + resourceURL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Network response was not OK - Code: " + response.status);
    }

    return true;
}
