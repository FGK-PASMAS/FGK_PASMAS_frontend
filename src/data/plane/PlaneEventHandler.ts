import EntityEventHandler from "@/core/abstracts/EntityEventHandler";
import type { EntityInterface } from "@/core/interfaces/EntityInterface";
import { InfoToast } from '@/core/toasts/InfoToast';
import type { Plane } from "@/data/plane/Plane";
import type { ToastServiceMethods } from "primevue/toastservice";

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
