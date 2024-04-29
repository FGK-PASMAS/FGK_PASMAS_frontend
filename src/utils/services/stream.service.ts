import { EventSource } from "extended-eventsource";

const stream = import.meta.env.VITE_STREAM_API_URL;

export const getStream = (resource: string): EventSource => {
    const token = localStorage.getItem("auth");

    const requestOptions = {
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    return new EventSource(stream + "/" + resource, requestOptions);
}
