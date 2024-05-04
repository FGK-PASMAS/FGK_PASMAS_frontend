<script setup lang="ts">
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Plane } from '@/data/plane/plane.interface';
import { updatePlane } from '@/data/plane/plane.service';
import { DateTime } from 'luxon';
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';
import { ref, type PropType } from 'vue';

const plane = defineModel("plane", {
    type: Object as PropType<Plane>,
    required: true
});

const planeUpdate = ref({
    ID: plane.value.ID,
    PrefPilot: plane.value.PrefPilot,
    SlotStartTime: plane.value.SlotStartTime?.toJSDate(),
    SlotEndTime: plane.value.SlotEndTime?.toJSDate(),
    FlightDuration: plane.value.FlightDuration ? (plane.value.FlightDuration / 60000000000) : plane.value.FlightDuration,
    FuelburnPerFlight: plane.value.FuelburnPerFlight
});

const emit = defineEmits([
    "preConfirm",
    "postConfirm",
    "cancel"
]);

const toast = useToast();

async function confirm(): Promise<void>
{
    if (planeUpdate.value.PrefPilot) {
        plane.value.PrefPilotId = planeUpdate.value.PrefPilot?.ID;
        plane.value.PrefPilot = planeUpdate.value.PrefPilot;
    }

    if (planeUpdate.value.SlotStartTime) {
        plane.value.SlotStartTime = DateTime.fromJSDate(planeUpdate.value.SlotStartTime);
    }

    if (planeUpdate.value.SlotEndTime) {
        plane.value.SlotEndTime = DateTime.fromJSDate(planeUpdate.value.SlotEndTime);
    }

    if (planeUpdate.value.FlightDuration) {
        plane.value.FlightDuration = planeUpdate.value.FlightDuration * 60000000000;
    }

    plane.value.FuelburnPerFlight = planeUpdate.value.FuelburnPerFlight;

    emit("preConfirm")

    await useValidateAPIData(updatePlane(plane.value), toast);

    emit("postConfirm");
}

function cancel(): void
{
    emit("cancel");
}
</script>

<template>
    <div class="flex flex-column pr-2 overflow-auto">
        <div>
            <h1 class="m-0">Flugzeug bearbeiten</h1>
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
                <div class="flex flex-wrap gap-8 row-gap-4">
                    <div>
                        <div class="flex align-items-center gap-2 mb-1">
                            <i class="bi-wrench-adjustable" />
                            <h3 class="m-0">Gewicht</h3>
                        </div>
                        <div class="flex flex-column gap-1 ml-3">
                            <span><span class="font-bold">Leergewicht:</span> {{ plane.EmptyWeight }}kg</span>
                            <span><span class="font-bold">MTOW:</span> {{ plane.MTOW }}kg</span>
                            <span v-if="plane.MaxSeatPayload! > 0"><span class="font-bold">Max. Gewicht pro Sitz:</span> {{ plane.MaxSeatPayload }}kg</span>
                        </div>
                    </div>
                    <div v-if="plane.FuelMaxCapacity! > 0">
                        <div class="flex align-items-center gap-2 mb-1">
                            <i class="bi-fuel-pump-fill" />
                            <h3 class="m-0">Treibstoff</h3>
                        </div>
                        <div class="flex flex-column gap-1 ml-3">
                            <span><span class="font-bold">Tankgröße:</span> {{ plane.FuelMaxCapacity }}L</span>
                            <span><span class="font-bold">Treibstoff zu Beginn:</span> {{ plane.FuelStartAmount }}L</span>
                            <span><span class="font-bold">Umrechnungsfaktor:</span> {{ plane.FuelConversionFactor }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex align-items-center gap-2 mb-1">
                        <i class="bi-person-vcard-fill" />
                        <h3 class="m-0">Bevorzugter Pilot</h3>
                    </div>
                    <PrimeDropdown
                        ref="dropdown"
                        v-model="planeUpdate.PrefPilot"
                        :options="plane.AllowedPilots"
                        optionLabel="ID"
                        placeholder="Bevorzugter Pilot"
                        class="w-full" 
                    >
                    <template #value="slotProps">
                        <span>{{ slotProps.value?.LastName }}, {{ slotProps.value?.FirstName }}</span>
                    </template>
                    <template #option="slotProps">
                        <span>{{ slotProps.option?.LastName }}, {{ slotProps.option?.FirstName }}</span>
                    </template>
                    </PrimeDropdown>
                </div>
                <div>
                    <div class="flex align-items-center gap-2 mb-1">
                        <i class="bi-clock-fill" />
                        <h3 class="m-0">Zeitraum</h3>
                    </div>
                    <div class="flex flex-column gap-1 ml-3">
                        <PrimeInputGroup class="flex">
                            <div class="align-self-stretch input-label flex align-items-center font-bold text-color surface-200">
                                <span>Start:</span>
                            </div>
                            <Calendar
                                v-model="planeUpdate.SlotStartTime"
                                showTime 
                                hourFormat="24" 
                                showIcon 
                                iconDisplay="input"
                                touchUI
                                placeholder="Start"
                            />
                        </PrimeInputGroup>
                        <PrimeInputGroup class="flex">
                            <div class="align-self-stretch input-label flex align-items-center font-bold text-color surface-200">
                                <span>Ende:</span>
                            </div>
                            <Calendar
                                v-model="planeUpdate.SlotEndTime"
                                showTime 
                                hourFormat="24" 
                                showIcon 
                                iconDisplay="input"
                                touchUI
                                placeholder="Ende"
                            />
                        </PrimeInputGroup>
                    </div>
                </div>
                <div>
                    <div class="flex align-items-center gap-2 mb-1">
                        <i class="bi-gear-wide-connected" />
                        <h3 class="m-0">Weitere Einstellungen</h3>
                    </div>
                    <div class="flex flex-column gap-1 ml-3">
                        <PrimeInputGroup class="flex">
                            <div class="align-self-stretch input-label flex align-items-center font-bold text-color surface-200">
                                <span>Flugdauer:</span>
                            </div>
                            <PrimeInputNumber v-model="planeUpdate.FlightDuration" locale="de-DE" :min="0" suffix="min" placeholder="Flugdauer" />
                        </PrimeInputGroup>
                        <PrimeInputGroup v-if="plane.FuelMaxCapacity! > 0" class="flex">
                            <div class="align-self-stretch input-label flex align-items-center font-bold text-color surface-200">
                                <span>Spritvebrauch:</span>
                            </div>
                            <PrimeInputNumber v-model="planeUpdate.FuelburnPerFlight" locale="de-DE" :min="0" suffix="L" placeholder="Flugdauer" />
                        </PrimeInputGroup>                
                    </div>
                </div>
            </div>
            <div class="flex flex-column gap-2">
                <PrimeButton label="Ändern" @click="confirm()" class="text-color" />
                <PrimeButton label="Abbrechen" severity="danger" @click="cancel()" class="text-color" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.input-label {
    width: 140px;
}
</style>
