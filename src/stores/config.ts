import { DateTime } from "luxon";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const configStore = defineStore("config", () => {
    const eventStartTime: Ref<DateTime | undefined> = ref();
    const eventEndTime: Ref<DateTime | undefined> = ref();

    // ToDo: Get event interval from somewhere
    function init(): void 
    {
        // Debug time frame
        eventStartTime.value = DateTime.now().startOf('week');
        eventEndTime.value = DateTime.now().endOf('week');
    }

    return { eventStartTime, eventEndTime, init }
});
