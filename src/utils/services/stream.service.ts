import { EventSource } from "extended-eventsource";

export const getStream = (resource: string): EventSource => {
    const stream = import.meta.env.VITE_STREAM_API_URL;
    const token = localStorage.getItem("auth");

    const requestOptions = {
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    return new EventSource(stream + "/" + resource, requestOptions);
}
