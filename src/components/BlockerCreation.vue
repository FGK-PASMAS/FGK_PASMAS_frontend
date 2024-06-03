<script setup lang="ts">
import { useValidateAPIData } from '@/core/composables/useValidateAPIData';
import { InfoToast } from '@/core/toasts/info.toast';
import { FlightStatus, type Flight } from '@/data/flight/flight.interface';
import { createFlight } from '@/data/flight/flight.service';
import type { Plane } from '@/data/plane/plane.interface';
import { DateTime } from 'luxon';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { ref, type PropType, type Ref } from 'vue';

const props = defineProps({
    plane: {
        type: Object as PropType<Plane>,
        required: true
    }
});

const emit = defineEmits([
    "confirm",
    "cancel"
]);

const start: Ref<Date | undefined> = ref();
const end: Ref<Date | undefined> = ref();
const description: Ref<string | undefined> = ref();

const toast = useToast();
const isConfirmButtonDisabled = ref(true);
const isEndInvalid = ref(false);

function onInput(): void
{

    if (!start.value || !end.value) {
        isConfirmButtonDisabled.value = true;
        
        return;
    }

    if (start.value >= end.value) {
        isEndInvalid.value = true;
        isConfirmButtonDisabled.value = true;

        return;
    }

    isEndInvalid.value = false;
    isConfirmButtonDisabled.value = false;
}

async function confirm(): Promise<void>
{
    const blocker: Flight = {
        PlaneId: props.plane.ID!,
        Status: FlightStatus.BLOCKED,
        DepartureTime: DateTime.fromJSDate(start.value!),
        ArrivalTime: DateTime.fromJSDate(end.value!),
        Description: description.value
    }

    await useValidateAPIData(createFlight(blocker), toast);

    // ToDo: Can be removed if there is a suitable flights per plane SSE endpoint
    toast.add(new InfoToast({ detail: "Blocker um " + blocker.DepartureTime!.toFormat("HH:mm, dd.LL.yyyy") + " wurde erfolgreich angelegt."}));

    emit("confirm");
}

function cancel(): void
{
    emit("cancel");
}
</script>

<template>
    <div class="flex flex-column pr-2 overflow-auto">
        <div>
            <div>
                <h1 class="m-0">Blocker anlegen</h1>
                <PrimeDivider />
            </div>
            <div class="flex flex-column gap-5">
                <div class="flex flex-column gap-4">
                    <div>
                        <div class="flex align-items-center gap-2 mb-1">
                            <i class="bi-airplane-fill" />
                            <h3 class="m-0">Flugzeug</h3>
                        </div>
                        <span class="ml-3">{{ plane.Registration }} ({{ plane.AircraftType }})</span>
                    </div>
                    <div>
                        <div class="flex align-items-center gap-2 mb-1">
                            <i class="bi-clock-fill" />
                            <h3 class="m-0">Zeitraum</h3>
                        </div>
                        <div class="flex flex-wrap gap-2 ml-3">
                            <span>{{ plane.SlotStartTime?.toFormat("HH:mm") }}</span>
                            <span>-</span>
                            <span>{{ plane.SlotEndTime?.toFormat("HH:mm") }}</span>
                            <span>|</span>
                            <span>{{ plane.SlotStartTime?.toFormat("cccc, dd LLLL yyyy") }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-column gap-2">
                    <Calendar 
                        v-model="start"  
                        showTime 
                        hourFormat="24" 
                        showIcon 
                        iconDisplay="input" 
                        showButtonBar
                        touchUI
                        placeholder="Start"
                        @date-select="onInput()"
                    />
                    <Calendar 
                        v-model="end" 
                        showTime 
                        hourFormat="24" 
                        showIcon 
                        iconDisplay="input" 
                        showButtonBar 
                        touchUI
                        placeholder="Ende"
                        @date-select="onInput()"
                        class="border-yellow-600"
                    />
                    <span v-if="isEndInvalid" class="text-red-400">Das Enddatum darf nicht vor dem Startdatum sein!</span>
                    <Textarea v-model="description" rows="5" cols="20" placeholder="Info" @input="onInput()" class="w-full" />
                </div>
                <div class="flex flex-column gap-2">
                    <PrimeButton label="Erstellen" :disabled="isConfirmButtonDisabled" @click="confirm()" class="text-color" />
                    <PrimeButton label="Abbrechen" severity="danger" @click="cancel()" class="text-color" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
