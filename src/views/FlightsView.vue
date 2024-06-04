<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTableViewHeader from '@/components/DataTableViewHeader.vue';
import FlightInfo from '@/components/FlightInfo.vue';
import TransitionLoading from '@/components/TransitionLoading.vue';
import { useFlightStatusDisplayData } from '@/core/composables/useFlightStatusDisplayData';
import { useValidateAPIData } from '@/core/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import { getDivisions } from '@/data/division/division.service';
import { FlightEventHandler } from '@/data/flight/flight.eventHandler';
import { FlightStatus, type Flight } from '@/data/flight/flight.interface';
import { deleteFlight, getFlights, getFlightsByDivisionStream, getFlightsStream } from '@/data/flight/flight.service';
import { useAuthStore } from "@/stores/authStore";
import { EventSource } from "extended-eventsource";
import { DateTime } from 'luxon';
import { FilterMatchMode } from 'primevue/api';
import type DataTable from 'primevue/datatable';
import InputSwitch from 'primevue/inputswitch';
import { type TabMenuChangeEvent } from 'primevue/tabmenu';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, onUnmounted, ref, type Ref } from 'vue';

const auth = useAuthStore();

const divisions: Ref<Division[]> = ref([]);
const flights: Ref<Flight[]> = ref([]);
const isUpcomingFlights = ref(true);

// The whole flights array has to be computed due to PrimeVue's filter not supporting functions - See https://github.com/primefaces/primevue/issues/4164
const flightsComputed = computed(() => {
    let computed: any = [];

    flights.value.forEach(flight => {
        const status = useFlightStatusDisplayData(flight.Status);

        computed.push({
            ID: flight.ID,
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

const toast = useToast();
const isDataLoaded = ref(false);
const selectedFlightIndex: Ref<number | undefined> = ref();
const isInfoDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
let flightCancellationMsg = "Soll der Flug wirklich storniert werden?"; 

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);

    divisions.value.unshift({
        ID: 0,
        Name: "Alle"
    });

    await loadFlights();
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

async function loadFlights(): Promise<void>
{
    let options: Record<string, string | number | boolean> = {
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePlane: true,
        includePilot: true,
        includePassengers: true,
    };

    isDataLoaded.value = false;

    if (isUpcomingFlights.value) {
        options.byDepartureTime = DateTime.now().toISO();
    }

    flights.value = await useValidateAPIData(getFlights(options), toast);

    isDataLoaded.value = true;

    if (eventSource) {
        eventSource.close();
    }

    if (tabIndex.value === 0) {
        eventSource = getFlightsStream();
    } else {
        eventSource = getFlightsByDivisionStream(divisions.value[tabIndex.value]!.ID!);
    }

    eventSource.onmessage = async (event) => {
        eventHandler.onEntityEvent(event, flights.value, toast);
    }

    eventSource.onerror = () => {
        eventHandler.onErrorEvent(toast);
    }
}

function onUpcomingFlightsToggle(): void
{
    loadFlights();
}

async function changeTab(event: TabMenuChangeEvent): Promise<void>
{
    event.originalEvent.stopPropagation();

    if (event.index === tabIndex.value) {
        return;
    }

    tabIndex.value = event.index;

    await loadFlights();
}

function showInfo(selectedFlight: Flight): void
{
    selectedFlightIndex.value = flights.value.findIndex((flight) => {
        return selectedFlight.ID === flight.ID;
    });

    isInfoDialogOpen.value = true;
}

function cancelFlight(selectedFlight: Flight): void
{
    let subject = "Blocker";

    selectedFlightIndex.value = flights.value.findIndex((flight) => {
        return selectedFlight.ID === flight.ID;
    });

    const flightToDelete = flights.value[selectedFlightIndex.value];

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
        <DataTableViewHeader title="Flüge" v-model:filters="filters" :dt="dt">
            <PrimeInputGroup class="flex align-items-center gap-2">
                <InputSwitch v-model="isUpcomingFlights" @change="onUpcomingFlightsToggle()" />
                <span>Bevorstehende Flüge</span>
            </PrimeInputGroup>
        </DataTableViewHeader>
        <div>
            <PrimeTabMenu :model="divisions" @tab-change="changeTab($event)">
                <template #item="{ item, props }">
                    <a v-bind="props.action" class="flex align-items-center gap-2">
                        <span class="font-bold">{{ item.Name }}</span>
                    </a>
                </template>
            </PrimeTabMenu>
        </div>
        <div class="relative flex-grow-1 flex overflow-auto">
            <TransitionLoading :isDataLoaded="isDataLoaded">
                <PrimeDataTable
                    :value="flightsComputed"
                    ref="dt"
                    exportFilename="export_flights"
                    csvSeparator=";"
                    v-model:filters="filters"
                    filterDisplay="menu"
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
                                <PrimeButton icon="bi-info-circle-fill" rounded @click="showInfo(slotProps.data)" class="text-color" />
                                <PrimeButton v-if="auth.isAdmin" icon="bi-trash-fill" severity="danger" rounded @click="cancelFlight(slotProps.data)" class="text-color" />
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
            </TransitionLoading>
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
