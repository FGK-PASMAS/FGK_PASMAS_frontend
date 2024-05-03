import type { ToastMessageOptions } from "primevue/toast";

export class WarningToast implements ToastMessageOptions
{
    /**
     * Severity level of the message.
     */
    severity: "warn";
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
    life: number;

    constructor({
        summary = "Warnung",
        detail = undefined,
        life = 3000
    }: { summary?: string, detail?: any | undefined, life?: number } = {}) {
        this.severity = "warn";
        this.summary = summary;
        this.detail = detail;
        this.life = life;
    }
}
