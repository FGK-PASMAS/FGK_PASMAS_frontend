import type { ToastMessageOptions } from "primevue/toast";

export class ErrorToast implements ToastMessageOptions
{
    /**
     * Severity level of the message.
     */
    severity: "error";
    /**
     * Summary content of the message.
     */
    summary: string | undefined;
    /**
     * Detail content of the message.
     */
    detail?: any | undefined;
    /**
     * Delay in milliseconds to close the message automatically.
     */
    life?: number | undefined;

    constructor(detail?: any | undefined, life?: number | undefined, summary: string = "Fehler")
    {
        this.severity = "error";
        this.summary = summary;
        this.detail = detail;
        this.life = life;
    }
}
