<script setup lang="ts">
import ContentHeader from '@/components/ContentHeader.vue';
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import type { Division } from '@/data/division/division.interface';
import { getDivisions } from '@/data/division/division.service';
import { FlightEventHandler } from '@/data/flight/flight.eventHandler';
import type { Flight } from '@/data/flight/flight.interface';
import { getFlights, getFlightsByDivisionStream } from '@/data/flight/flight.service';
import { FilterMatchMode } from 'primevue/api';
import TabMenu, { type TabMenuChangeEvent } from 'primevue/tabmenu';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onUnmounted, ref, type Ref } from 'vue';

const toast = useToast();

const divisions: Ref<Division[]> = ref([]);
const flights: Ref<Flight[]> = ref([]);
const tabIndex = ref(0);

const eventHandler = new FlightEventHandler();
let eventSource: EventSource;

const columns = [
    {
        field: "FlightNo",
        header: "Nr."
    },
    {
        field: "DepartureTime",
        header: "Start"
    },
    {
        field: "ArrivalTime",
        header: "Ende"
    },
    {
        field: "Plane.Registration",
        header: "Kennzeichen"
    },
    {
        field: "Description",
        header: "Beschreibung"
    },
    {
        field: "Plane.AircraftType",
        header: "Typ"
    },
    {
        field: "Pilot.Name",
        header: "Pilot Name"
    },
    {
        field: "Pilot.Vorname",
        header: "Pilot Vorname"
    },
    {
        field: "Passengers",
        header: "Passagier"
    },
];

const filters = ref({
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "FlightNo": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "DepartureTime": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "ArrivalTime": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Plane.Registration": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Description": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Plane.AircraftType": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Pilot.Name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Pilot.Vorname": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Passengers": { value: null, matchMode: FilterMatchMode.CONTAINS }
});

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
        console.log(JSON.parse(event.data));

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

async function changeTab(event: TabMenuChangeEvent) {
    event.originalEvent.stopPropagation();

    if (event.index === tabIndex.value) {
        return;
    }

    tabIndex.value = event.index;

    flights.value = await useValidateAPIData(getFlights({
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePlane: true,
        includePilot: true,
        includePassengers: true,
    }), toast);

    eventSource.close();

    eventSource = getFlightsByDivisionStream(divisions.value[tabIndex.value]!.ID!);

    eventSource.onmessage = async (event) => {
        console.log(JSON.parse(event.data));

        eventHandler.onEntityEvent(event, flights.value, toast);
    }

    eventSource.onerror = () => {
        eventHandler.onErrorEvent(toast);
    }
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <ContentHeader title="Flüge" />
        <!--BUG Display Tab Menu isn't full height all the time-->
        <TabMenu :model="divisions" @tab-change="changeTab($event)" class="h-10rem">
            <template #item="{ item, props }">
                <a v-bind="props.action" class="flex align-items-center gap-2">
                    <span class="font-bold">{{ item.Name }}</span>
                </a>
            </template>
        </TabMenu>
        <div class="flex-grow-1 overflow-auto">
            <PrimeDataTable
                v-model:filters="filters"
                :value="flights"
                sortMode="multiple"
                removableSort
                stripedRows
                scrollable
                scrollHeight="flex"
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <span class="p-input-icon-left">
                            <i class="bi-search" />
                            <PrimeInputText v-model="filters['global'].value" placeholder="Suche..." />
                        </span>
                    </div>
                </template>
                <template #empty> Keine Flüge gefunden. </template>
                <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable />
            </PrimeDataTable>
        </div>
    </main>
</template>

<style scoped lang="scss">
.filter-input {
    min-width: 75px;
}
</style>
