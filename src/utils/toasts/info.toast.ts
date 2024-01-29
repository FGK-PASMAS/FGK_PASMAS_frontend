import type { ToastMessageOptions } from "primevue/toast";

// ToDo constructor parameter order
export class InfoToast implements ToastMessageOptions
{
    /**
     * Severity level of the message.
     */
    severity: "info";
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
    life: number | undefined;

    constructor(detail?: any | undefined, summary: string = "Info")
    {
        this.severity = "info";
        this.summary = summary;
        this.detail = detail;
        this.life = 3000;
    }
}
