import { EntityEventHandler } from "@/utils/eventHandlers/entity.eventHandler";
import type { EntityInterface } from "@/utils/interfaces/entity.interface";
import { InfoToast } from "@/utils/toasts/info.toast";
import { DateTime } from "luxon";
import type { ToastServiceMethods } from "primevue/toastservice";
import { FlightStatus, type Flight } from "./flight.interface";

export class FlightEventHandler extends EntityEventHandler 
{
    public onEntityEvent(event: MessageEvent<any>, store: EntityInterface[], toast: ToastServiceMethods): void {
        super.onEntityEvent(event, store, toast);
    }

    protected onEntityCreatedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const departure = subject.DepartureTime!.toLocaleString(DateTime.DATETIME_SHORT);
        const arrival = subject.ArrivalTime!.toLocaleString(DateTime.DATETIME_SHORT);

        if (subject.Status === FlightStatus.BLOCKED) {
            toast.add(new InfoToast({ detail: "Es wurde ein Blocker von " + departure + " bis " + arrival + " gesetzt." }));
        } else {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " wurde reserviert."}));
        }
    }

    protected onEntityUpdatedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const departure = subject.DepartureTime!.toLocaleString(DateTime.DATETIME_SHORT);

        if (subject.Status === FlightStatus.BOOKED) {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " wurde gebucht." }));
        }
    }

    protected onEntityDeletedEvent(subject: Flight, toast: ToastServiceMethods): void {
        const departure = subject.DepartureTime!.toLocaleString(DateTime.DATETIME_SHORT);

        if (subject.Status === FlightStatus.BOOKED) {
            toast.add(new InfoToast({ detail: "Flug um " + departure + " wurde storniert." }));
        } else {
            toast.add(new InfoToast({ detail: "Reservierung um " + departure + " wurde storniert." }));
        }
    }

    protected onEntityOtherEvent(): void {}
}
