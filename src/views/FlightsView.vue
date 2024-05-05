<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTableViewHeader from '@/components/DataTableViewHeader.vue';
import FlightInfo from '@/components/FlightInfo.vue';
import { useFlightStatusDisplayData } from '@/composables/useFlightStatusDisplayData';
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import { getDivisions } from '@/data/division/division.service';
import { FlightEventHandler } from '@/data/flight/flight.eventHandler';
import { FlightStatus, type Flight } from '@/data/flight/flight.interface';
import { deleteFlight, getFlights, getFlightsByDivisionStream } from '@/data/flight/flight.service';
import { authStore } from '@/stores/auth';
import { EventSource } from "extended-eventsource";
import { FilterMatchMode } from 'primevue/api';
import type DataTable from 'primevue/datatable';
import { type TabMenuChangeEvent } from 'primevue/tabmenu';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, onUnmounted, ref, type Ref } from 'vue';

const auth = authStore();
const toast = useToast();

const divisions: Ref<Division[]> = ref([]);
const flights: Ref<Flight[]> = ref([]);

// The whole flights array has to be computed due to PrimeVue's filter not supporting functions - See https://github.com/primefaces/primevue/issues/4164
const flightsComputed = computed(() => {
    let computed: any = [];

    flights.value.forEach(flight => {
        const status = useFlightStatusDisplayData(flight.Status);

        computed.push({
            FlightNo: flight.FlightNo,
            Status: status.status,
            StatusColor: status.color,
            DepartureTime: flight.DepartureTime?.toFormat("HH:mm, dd.LL.yyyy"),
            Registration: flight.Plane?.Registration,
            AircraftType: flight.Plane?.AircraftType,
        });
    });

    return computed;
});

const eventHandler = new FlightEventHandler();
let eventSource: EventSource;

const tabIndex = ref(0);
const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FlightNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DepartureTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AircraftType: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedFlightIndex: Ref<number | undefined> = ref();
const isInfoDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
let flightCancellationMsg = "Soll der Flug wirklich storniert werden?"; 

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);

    if (divisions.value.length <= 0) {
        return;
    }

    flights.value = await useValidateAPIData(getFlights({
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePlane: true,
        includePilot: true,
        includePassengers: true,
    }), toast);

    eventSource = getFlightsByDivisionStream(divisions.value[tabIndex.value]!.ID!);

    eventSource.onmessage = async (event) => {
        eventHandler.onEntityEvent(event, flights.value, toast);
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

async function changeTab(event: TabMenuChangeEvent): Promise<void>
{
    event.originalEvent.stopPropagation();

    if (event.index === tabIndex.value) {
        return;
    }

    eventSource.close();

    tabIndex.value = event.index;

    flights.value = await useValidateAPIData(getFlights({
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePlane: true,
        includePilot: true,
        includePassengers: true,
    }), toast);

    eventSource = getFlightsByDivisionStream(divisions.value[tabIndex.value]!.ID!);

    eventSource.onmessage = async (event) => {
        eventHandler.onEntityEvent(event, flights.value, toast);
    }

    eventSource.onerror = () => {
        eventHandler.onErrorEvent(toast);
    }
}

function showInfo(index: number): void
{
    selectedFlightIndex.value = index;
    isInfoDialogOpen.value = true;
}

function cancelFlight(index: number): void
{
    let subject = "Blocker";
    const flightToDelete = flights.value[index];

    selectedFlightIndex.value = index;

    switch (flightToDelete.Status) {
        case FlightStatus.BOOKED:
            subject = "Flug";
            break;
        case FlightStatus.RESERVED:
            subject = "Reservierung";
            break;
    }

    flightCancellationMsg = "Soll " + subject + " um " + flightToDelete?.DepartureTime?.toFormat("HH:mm, dd.LL.yyyy") + " wirklich storniert werden?";
    isDeleteDialogOpen.value = true;
}

function confirmFlightCancellation(): void
{
    if (!selectedFlightIndex.value) {
        return;
    }

    const flightToDelete = flights.value[selectedFlightIndex.value];

    if (!flightToDelete) {
        return;
    }

    useValidateAPIData(deleteFlight(flightToDelete), toast);

    selectedFlightIndex.value = undefined;
}

function cancelFlightCancellation(): void
{
    selectedFlightIndex.value = undefined;
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Flüge" v-model:filters="filters" :dt="dt" />
        <div>
            <PrimeTabMenu :model="divisions" @tab-change="changeTab($event)">
                <template #item="{ item, props }">
                    <a v-bind="props.action" class="flex align-items-center gap-2">
                        <span class="font-bold">{{ item.Name }}</span>
                    </a>
                </template>
            </PrimeTabMenu>
        </div>
        <div class="flex-grow-1 overflow-auto">
            <PrimeDataTable
                :value="flightsComputed"
                ref="dt"
                exportFilename="export_flights"
                csvSeparator=";"
                v-model:filters="filters"
                filterDisplay="row"
                sortMode="multiple"
                removableSort
                stripedRows
                scrollable
                scrollHeight="flex"
            >
                <template #empty> Keine Flüge gefunden. </template>
                <PrimeColumn header="Aktion">
                    <template #body="slotProps">
                        <div class="flex flex-column gap-2">
                            <PrimeButton icon="bi-info-circle-fill" rounded @click="showInfo(slotProps.index)" class="text-color" />
                            <PrimeButton v-if="auth.isAdmin" icon="bi-trash-fill" severity="danger" rounded @click="cancelFlight(slotProps.index)" class="text-color" />
                        </div>
                    </template>
                </PrimeColumn>
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
                <PrimeColumn field="FlightNo" header="Nr" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="DepartureTime" header="Start" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="Registration" header="FK" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="AircraftType" header="Typ" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
        <AppDialog v-model:isOpen="isInfoDialogOpen">
            <FlightInfo :division="flights[selectedFlightIndex ?? 0].Plane?.Division" :passengers="flights[selectedFlightIndex ?? 0].Passengers" v-model:flight="flights[selectedFlightIndex ?? 0]" />
        </AppDialog>
        <ConfirmDialog
            v-model:isOpen="isDeleteDialogOpen"
            :description="flightCancellationMsg"
            @confirm="confirmFlightCancellation()"
            @cancel="cancelFlightCancellation()"
        />
    </main>
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
