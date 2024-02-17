import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const configStore = defineStore("config", () => {
    const eventStartTime: Ref<DateTime | undefined> = ref();
    const eventEndTime: Ref<DateTime | undefined> = ref();

    // ToDo: Get event interval from backend
    function init(): void 
    {
        eventStartTime.value = DateTime.fromISO("2024-01-24T11:00:00.000000Z");
        eventEndTime.value = DateTime.fromISO("2024-01-24T18:00:00.000000Z");
    }

    return { eventStartTime, eventEndTime, init }
});
