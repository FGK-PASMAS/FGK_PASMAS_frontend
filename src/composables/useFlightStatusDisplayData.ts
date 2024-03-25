import { FlightStatus, FlightStatusColor, FlightStatusDisplayName } from "@/data/flight/flight.interface";

export interface FlightStatusDisplayData {
    status: String,
    color: String
}

export function useFlightStatusDisplayData(status?: FlightStatus): FlightStatusDisplayData
{
    let displayedStatus = "Noch offen";
    let displayedColor = FlightStatusColor.UNKNOWN;

    switch (status) {
        case FlightStatus.BLOCKED:
            displayedStatus = FlightStatusDisplayName.BLOCKED;
            displayedColor = FlightStatusColor.BLOCKED;
            break;
        case FlightStatus.BOOKED:
            displayedStatus = FlightStatusDisplayName.BOOKED;
            displayedColor = FlightStatusColor.BOOKED;
            break;
        case FlightStatus.OK:
            displayedStatus = FlightStatusDisplayName.OK;
            displayedColor = FlightStatusColor.OK;
            break;
        case FlightStatus.OVERLOADED:
            displayedStatus = FlightStatusDisplayName.OVERLOADED;
            displayedColor = FlightStatusColor.OVERLOADED;
            break;
        case FlightStatus.OVERLOADED_SEAT:
            displayedStatus = FlightStatusDisplayName.OVERLOADED_SEAT;
            displayedColor = FlightStatusColor.OVERLOADED_SEAT;
            break;
        case FlightStatus.RESERVED:
            displayedStatus = FlightStatusDisplayName.RESERVED;
            displayedColor = FlightStatusColor.RESERVED;
            break;
        case FlightStatus.UNKNOWN:
            displayedStatus = FlightStatusDisplayName.UNKNOWN;
            displayedColor = FlightStatusColor.UNKNOWN;
            break;
    }

    return {
        "status": displayedStatus,
        "color": displayedColor
    }
}
