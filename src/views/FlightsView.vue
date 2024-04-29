<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTableViewHeader from '@/components/DataTableViewHeader.vue';
import { useFlightStatusDisplayData } from '@/composables/useFlightStatusDisplayData';
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import { getDivisions } from '@/data/division/division.service';
import { FlightEventHandler } from '@/data/flight/flight.eventHandler';
import type { Flight } from '@/data/flight/flight.interface';
import { deleteFlight, getFlights, getFlightsByDivisionStream } from '@/data/flight/flight.service';
import { EventSource } from "extended-eventsource";
import { FilterMatchMode } from 'primevue/api';
import type DataTable from 'primevue/datatable';
import TabMenu, { type TabMenuChangeEvent } from 'primevue/tabmenu';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, onUnmounted, ref, type Ref } from 'vue';

const toast = useToast();

const divisions: Ref<Division[]> = ref([]);
const flights: Ref<Flight[]> = ref([]);

// The whole flights array has to be computed due to PrimeVue's filter not supporting functions - See https://github.com/primefaces/primevue/issues/4164
const flightsComputed = computed(() => {
    let computed: any = [];

    flights.value.forEach(flight => {
        const status = useFlightStatusDisplayData(flight.Status);
        const passengers = {
            computed: "",
            raw: [] as {}[]
        }
        
        flight.Passengers?.forEach(passenger => {
            passengers.computed += passenger.LastName + " " + passenger.FirstName + ", ";

            passengers.raw.push({
                ID: passenger.ID,
                LastName: passenger.LastName,
                FirstName: passenger.FirstName
            });
        });

        computed.push({
            ID: flight.ID,
            FlightNo: flight.FlightNo,
            Status: status.status,
            StatusColor: status.color,
            Description: flight.Description ?? "-",
            DepartureTime: flight.DepartureTime?.toFormat("HH:mm - dd.LL.yyyy"),
            ArrivalTime: flight.ArrivalTime?.toFormat("HH:mm - dd.LL.yyyy"),
            Registration: flight.Plane?.Registration,
            AircraftType: flight.Plane?.AircraftType,
            Pilot: flight.Pilot?.LastName + " " + flight.Pilot?.FirstName,
            PassengersComputed: passengers.computed,
            PassengersRaw: passengers.raw
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
    ID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DepartureTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ArrivalTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AircraftType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Pilot: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PassengersComputed: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const isDeleteDialogOpen = ref(false);
let flightToDelete: Flight | undefined;
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

async function changeTab(event: TabMenuChangeEvent): Promise<void> {
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

function cancelFlight(flightId: number): void
{
    flightToDelete = flights.value.find((flight) => {
        return flightId === flight.ID;
    });

    flightCancellationMsg = "Soll Flug " + flightToDelete?.ID + " wirklich storniert werden?";
    
    isDeleteDialogOpen.value = true;
}

function confirmFlightCancellation(): void
{
    if (!flightToDelete) {
        return;
    }

    deleteFlight(flightToDelete);
}

function cancelFlightCancellation(): void
{
    flightToDelete = undefined;
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Flüge" v-model:filters="filters" :dt="dt" />
        <TabMenu :model="divisions" @tab-change="changeTab($event)" class="flex-grow-0">
            <template #item="{ item, props }">
                <a v-bind="props.action" class="flex align-items-center gap-2">
                    <span class="font-bold">{{ item.Name }}</span>
                </a>
            </template>
        </TabMenu>
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
                <PrimeColumn field="ID" header="Nr" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="DepartureTime" header="Start" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="ArrivalTime" header="Ende" sortable>
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
                <PrimeColumn field="Description" header="Info" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="Pilot" header="Pilot" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn field="PassengersComputed" header="Passagiere" sortable>
                    <template #body="slotProps">
                        <p v-for="passenger in slotProps.data.PassengersRaw" :key="passenger.ID">{{ passenger.LastName }}, {{ passenger.FirstName }}</p>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Aktion">
                    <template #body="slotProps">
                        <PrimeButton icon="bi-trash-fill" severity="danger" rounded @click="cancelFlight(slotProps.data.ID)" class="text-red-50" />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
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
