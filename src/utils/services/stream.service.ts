const stream = import.meta.env.VITE_STREAM_API_URL;

export const getStream = (resourceURL: string): EventSource => {
    return new EventSource(stream + resourceURL);
}
