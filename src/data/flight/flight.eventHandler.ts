import { EntityEventHandler } from "@/utils/eventHandlers/entity.eventHandler";
import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import type { ToastServiceMethods } from "primevue/toastservice";
import { FlightStatus, type Flight } from "./flight.interface";

export class FlightEventHandler extends EntityEventHandler 
{
    public onEntityEvent(event: MessageEvent<any>, store: EntityInterface[], toast: ToastServiceMethods): void {
        super.onEntityEvent(event, store, toast);
    }

    protected onEntityCreatedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const date = subject.DepartureTime!.toFormat("dd.LL.yyyy");
        const departure = subject.DepartureTime!.toFormat("HH:mm");
        const arrival = subject.ArrivalTime!.toFormat("HH:mm");

        if (subject.Status === FlightStatus.BLOCKED) {
            toast.add(new InfoToast({ detail: "Es wurde ein Blocker von " + departure + " bis " + arrival + " am " + date + " gesetzt." }));
        } else {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " " + date + " wurde reserviert."}));
        }
    }

    protected onEntityUpdatedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const departure = subject.DepartureTime!.toFormat("HH:mm dd.LL.yyyy");

        if (subject.Status === FlightStatus.BOOKED) {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " wurde gebucht." }));
        }
    }

    protected onEntityDeletedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const departure = subject.DepartureTime!.toFormat("HH:mm dd.LL.yyyy");

        if (subject.Status === FlightStatus.BOOKED) {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " wurde storniert." }));
        } else {
            toast.add(new InfoToast({ detail: "Reservierung um " + departure + " wurde storniert." }));
        }
    }

    protected onEntityOtherEvent(): void {}
}
