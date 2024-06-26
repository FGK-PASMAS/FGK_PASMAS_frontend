import EntityEventHandler from "@/core/abstracts/EntityEventHandler";
import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import { InfoToast } from '@/core/toasts/InfoToast';
import type { Passenger } from "@/data/passenger/Passenger";
import type { ToastServiceMethods } from "primevue/toastservice";

export class PassengerEventHandler extends EntityEventHandler 
{
    public onEntityEvent(event: MessageEvent<any>, store: EntityInterface[], toast: ToastServiceMethods): void {
        super.onEntityEvent(event, store, toast);
    }

    protected onEntityCreatedEvent(subject: Passenger, toast: ToastServiceMethods): void {
        toast.add(new InfoToast({ detail: "Passagier  #" + subject.ID + ": " + subject.LastName + ", " + subject.FirstName + " wurde angelegt." }));
    }

    protected onEntityUpdatedEvent(subject: Passenger, toast: ToastServiceMethods): void {
        toast.add(new InfoToast({ detail: "Passagier  #" + subject.ID + ": " + subject.LastName + ", " + subject.FirstName + " wurde geändert." }));
    }

    protected onEntityDeletedEvent(subject: Passenger, toast: ToastServiceMethods): void {
        toast.add(new InfoToast({ detail: "Passagier  #" + subject.ID + ": " + subject.LastName + ", " + subject.FirstName + " wurde gelöscht." }));
    }

    protected onEntityOtherEvent(): void {}
}
