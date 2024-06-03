import { EntityEventHandler } from "@/core/eventHandlers/entity.eventHandler";
import type { EntityInterface } from "@/core/interfaces/entity.interface";
import { InfoToast } from "@/core/toasts/info.toast";
import type { ToastServiceMethods } from "primevue/toastservice";
import type { Plane } from "./plane.interface";

export class PlaneEventHandler extends EntityEventHandler
{
    public onEntityEvent(event: MessageEvent<any>, store: EntityInterface[], toast: ToastServiceMethods): void {
        super.onEntityEvent(event, store, toast);
    }

    protected onEntityCreatedEvent(): void {}

    protected onEntityUpdatedEvent(subject: Plane, toast: ToastServiceMethods): void {
        toast.add(new InfoToast({ detail: "Daten des Flugzeugs " + subject.Registration + "(" + subject.AircraftType + ") wurden geändert."}));
    }

    protected onEntityDeletedEvent(): void {}
    
    protected onEntityOtherEvent(): void {}    
}
