import type { ToastMessageOptions } from "primevue/toast";

export class ToastInfo implements ToastMessageOptions
{
    /**
     * Summary content of the message.
     */
    summary: string;
    /**
     * Detail content of the message.
     */
    detail?: any | undefined;
    /**
     * Delay in milliseconds to close the message automatically.
     */
    life: number;

    constructor(detail: any | undefined)
    {
        this.summary = "Info";
        this.detail = detail;
        this.life = 3000;
    }
}
