import { FlightStatus, FlightStatusBgColor, FlightStatusColor, FlightStatusDisplayName } from "@/data/flight/Flight";

export interface FlightStatusDisplayData {
    status: String,
    color: String,
    bgColor: String
}

/**
 * Determines display name, display color and display background color of a flight status.
 * 
 * @param status FlightStatus
 * @returns FlightStatusDisplayData
 */
export function useFlightStatusDisplayData(status?: FlightStatus): FlightStatusDisplayData
{
    let displayedStatus = "Noch offen";
    let displayedColor = FlightStatusColor.UNKNOWN;
    let displayedBgColor = FlightStatusBgColor.UNKNOWN;

    switch (status) {
        case FlightStatus.BLOCKED:
            displayedStatus = FlightStatusDisplayName.BLOCKED;
            displayedColor = FlightStatusColor.BLOCKED;
            displayedBgColor = FlightStatusBgColor.BLOCKED;
            break;
        case FlightStatus.BOOKED:
            displayedStatus = FlightStatusDisplayName.BOOKED;
            displayedColor = FlightStatusColor.BOOKED;
            displayedBgColor = FlightStatusBgColor.BOOKED;
            break;
        case FlightStatus.OK:
            displayedStatus = FlightStatusDisplayName.OK;
            displayedColor = FlightStatusColor.OK;
            displayedBgColor = FlightStatusBgColor.OK;
            break;
        case FlightStatus.OVERLOADED:
            displayedStatus = FlightStatusDisplayName.OVERLOADED;
            displayedColor = FlightStatusColor.OVERLOADED;
            displayedBgColor = FlightStatusBgColor.OVERLOADED;
            break;
        case FlightStatus.OVERLOADED_SEAT:
            displayedStatus = FlightStatusDisplayName.OVERLOADED_SEAT;
            displayedColor = FlightStatusColor.OVERLOADED_SEAT;
            displayedBgColor = FlightStatusBgColor.OVERLOADED_SEAT;
            break;
        case FlightStatus.NO_FUEL:
            displayedStatus = FlightStatusDisplayName.NO_FUEL;
            displayedColor = FlightStatusColor.NO_FUEL;
            displayedBgColor = FlightStatusBgColor.NO_FUEL;
            break;
        case FlightStatus.RESERVED:
            displayedStatus = FlightStatusDisplayName.RESERVED;
            displayedColor = FlightStatusColor.RESERVED;
            displayedBgColor = FlightStatusBgColor.RESERVED;
            break;
        case FlightStatus.UNKNOWN:
            displayedStatus = FlightStatusDisplayName.UNKNOWN;
            displayedColor = FlightStatusColor.UNKNOWN;
            displayedBgColor = FlightStatusBgColor.UNKNOWN;
            break;
    }

    return {
        "status": displayedStatus,
        "color": displayedColor,
        "bgColor": displayedBgColor
    }
}
