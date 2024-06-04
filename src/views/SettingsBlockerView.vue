<script setup lang="ts">
import AppDialog from "@/components/AppDialog.vue";
import BlockerCreation from "@/components/BlockerCreation.vue";
import ContentHeader from "@/components/ContentHeader.vue";
import TransitionLoading from "@/components/TransitionLoading.vue";
import { useFlightStatusDisplayData } from "@/core/composables/useFlightStatusDisplayData";
import { useValidateAPIData } from "@/core/composables/useValidateAPIData";
import { WarningToast } from "@/core/toasts/WarningToast";
import type { Division } from "@/data/division/division.interface";
import { getDivisions } from "@/data/division/division.service";
import type { Flight } from "@/data/flight/flight.interface";
import { getFlights } from "@/data/flight/flight.service";
import { PlaneEventHandler } from "@/data/plane/plane.eventHandler";
import type { Plane } from "@/data/plane/plane.interface";
import { getPlanes, getPlanesStream } from "@/data/plane/plane.service";
import { useAuthStore } from "@/stores/authStore";
import type { EventSource } from "extended-eventsource";
import { FilterMatchMode } from "primevue/api";
import type DataTable from "primevue/datatable";
import { useToast } from "primevue/usetoast";
import { computed, onBeforeMount, onUnmounted, ref, type Ref } from "vue";

const auth = useAuthStore();

const divisions: Ref<Division[]> = ref([]);
const selectedDivision: Ref<Division | undefined> = ref();
const planes: Ref<Plane[]> = ref([]);
const selectedPlane: Ref<Plane | undefined> = ref();
const flights: Ref<Flight[]> = ref([]);

// The whole flights array has to be computed due to PrimeVue's filter not supporting functions - See https://github.com/primefaces/primevue/issues/4164
const flightsComputed = computed(() => {
    let computed: any = [];

    flights.value.forEach(flight => {
        const status = useFlightStatusDisplayData(flight.Status);

        computed.push({
            FlightNo: flight.FlightNo ?? "-",
            Status: status.status,
            StatusColor: status.color,
            DepartureTime: flight.DepartureTime?.toFormat("HH:mm, dd.LL.yyyy"),
            ArrivalTime: flight.ArrivalTime?.toFormat("HH:mm, dd.LL.yyyy")
        });
    });

    return computed;
});

// ToDo: Add flights py plane SSE if it exists
const eventHandler = new PlaneEventHandler();
let eventSource: EventSource;

const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    Status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FlightNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DepartureTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ArrivalTime: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const columns = [
    {
        field: "FlightNo",
        header: "FlugNr.",
    },
    {
        field: "DepartureTime",
        header: "Start",
    },
    {
        field: "ArrivalTime",
        header: "Ende",
    }
];

const toast = useToast();
const isDataLoaded = ref(true);
const isCreateBlockerOpen = ref(false);

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);

    eventSource = getPlanesStream();

    eventSource.onmessage = async (event) => {
        eventHandler.onEntityEvent(event, planes.value, toast);
        onPlaneEvent(event);
    }

    eventSource.onerror = () => {
        eventHandler.onErrorEvent(toast);
    }
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

/**
 * Additional event handler for plane events.
 * Cancel blocker creation if selected plane got changed.
 * 
 * @param event 
 */
async function onPlaneEvent(event: MessageEvent<any>): Promise<void>
{
    const message = JSON.parse(event.data);

    if (auth.user?.Username === message?.actionUser?.Username) {
        return;
    }

    if (selectedPlane.value?.ID !== message?.data?.ID) {
        return;
    }

    onCreateBlockerCancel();
    await onDivisionChange();

    toast.add(new WarningToast({ detail: "Vorgang wurde abgebrochen." }));
}

async function onDivisionChange(): Promise<void>
{
    planes.value = [];
    selectedPlane.value = undefined;
    flights.value = [];

    if (!selectedDivision.value) {
        return;
    }

    planes.value = await useValidateAPIData(getPlanes({
        byDivisionId: selectedDivision.value.ID!
    }), toast);
}

async function onPlaneChange(): Promise<void>
{
    flights.value = [];

    if (!selectedPlane.value) {
        return;
    }

    isDataLoaded.value = false;

    flights.value = await useValidateAPIData(getFlights({
        byPlaneId: selectedPlane.value.ID!
    }), toast);

    isDataLoaded.value = true;
}

function createBlocker(): void
{
    isCreateBlockerOpen.value = true;
}

function onCreateBlockerConfirm(): void
{
    selectedDivision.value = undefined;
    planes.value = [];
    selectedPlane.value = undefined;
    flights.value = [];

    isCreateBlockerOpen.value = false;
}

function onCreateBlockerCancel(): void
{
    isCreateBlockerOpen.value = false;
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <ContentHeader title="Flugblocker" />
        <div class="flex flex-wrap md:flex-nowrap gap-2 mb-3">
            <PrimeDropdown 
                ref="dropDownDivisions" 
                v-model="selectedDivision" 
                :options="divisions" 
                optionLabel="Name" 
                placeholder="Flugtyp" 
                showClear 
                :disabled="divisions.length <= 0"
                @change="onDivisionChange()" 
                class="w-full md:w-12rem" 
            />
            <PrimeDropdown 
                ref="dropDownPlanes" 
                v-model="selectedPlane" 
                :options="planes" 
                optionLabel="Registration" 
                placeholder="Flugzeug" 
                showClear 
                :disabled="planes.length <= 0"
                @change="onPlaneChange()"
                class="w-full md:w-12rem" />
            <PrimeButton icon="bi-plus-circle-fill" label="Erstellen" :disabled="!selectedPlane" @click="createBlocker()" class="w-full md:w-12rem text-color" />
        </div>
        <div class="relative flex-grow-1 flex overflow-auto">
            <TransitionLoading :isDataLoaded="isDataLoaded">
                <PrimeDataTable
                    :value="flightsComputed"
                    ref="dt"
                    v-model:filters="filters"
                    filterDisplay="menu"
                    sortMode="multiple"
                    removableSort
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <template #empty> Keine Flüge gefunden. </template>
                    <PrimeColumn field="Status" header="Status" sortable>
                        <template #body="slotProps">
                            <div class="flex align-items-center gap-2">
                                <i class="bi-circle-fill" :class="slotProps.data.StatusColor" />
                                <span>{{ slotProps.data.Status }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                </PrimeDataTable>
            </TransitionLoading>
        </div>
        <AppDialog v-model:isOpen="isCreateBlockerOpen" :isStrictClose="true">
            <BlockerCreation :plane="selectedPlane!" @confirm="onCreateBlockerConfirm()" @cancel="onCreateBlockerCancel()" />
        </AppDialog>
    </main>    
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
