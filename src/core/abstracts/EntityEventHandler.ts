import { parseAPIResponse } from "@/core/composables/useFetch";
import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import { ErrorToast } from "@/core/toasts/ErrorToast";
import type { ToastServiceMethods } from "primevue/toastservice";

export default abstract class EntityEventHandler
{
    public onEntityEvent(event: MessageEvent<any>, store: EntityInterface[], toast?: ToastServiceMethods): void
    {
        const message = JSON.parse(event.data);
        const action: string = message.action;
        const subject: EntityInterface = parseAPIResponse(message.data);

        switch (action) {
            case "CREATED": {
                store.push(subject);
    
                this.onEntityCreatedEvent(subject, toast);
    
                break;
            }
            case "UPDATED": {
                const changedSubject = store.find((existingSubject) => {
                    return subject.ID === existingSubject.ID;
                });
    
                if (changedSubject) {
                    Object.assign(changedSubject, parseAPIResponse(subject));
                }
    
                this.onEntityUpdatedEvent(subject, toast);
    
                break;
            }
            case "DELETED": {
                const deletedSubjectIndex = store.findIndex((existingSubject) => {
                    return subject.ID === existingSubject.ID;
                });
    
                store.splice(deletedSubjectIndex, 1);
    
                this.onEntityDeletedEvent(subject, toast);
    
                break;
            }
            case "OTHER": {
                this.onEntityOtherEvent(subject, toast);

                break;
            }
            default: {
                if (toast) {
                    toast.add(new ErrorToast({
                        summary: "Unerwartetes Event",
                        detail: "Bitte versuche es später erneut. Sollte das Problem weiterhin bestehen, kontaktiere deinen Administrator."
                    }));
                } 
                    
                console.log(message);
            }
        }
    }

    public onErrorEvent(toast: ToastServiceMethods): void 
    {
        toast.add(new ErrorToast({ 
            summary: "Verbindung zum Server verloren", 
            detail: "Es wird versucht eine Verbindung herzustellen...",
            life: 5000
        }));
    }

    protected abstract onEntityCreatedEvent(subject: any, toast?: ToastServiceMethods): void;

    protected abstract onEntityUpdatedEvent(subject: any, toast?: ToastServiceMethods): void;

    protected abstract onEntityDeletedEvent(subject: any, toast?: ToastServiceMethods): void;

    protected abstract onEntityOtherEvent(subject: any, toast?: ToastServiceMethods): void;
}
