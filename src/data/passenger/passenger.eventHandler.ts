import { EntityEventHandler } from "@/utils/eventHandlers/entity.eventHandler";
import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import type { ToastServiceMethods } from "primevue/toastservice";
import type { Passenger } from "./passenger.interface";

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
