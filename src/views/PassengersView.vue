<script setup lang="ts">
import DataTableViewHeader from "@/components/DataTableViewHeader.vue";
import TransitionLoading from "@/components/TransitionLoading.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { PassengerEventHandler } from "@/data/passenger/passenger.eventHandler";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getPassengers, getPassengersStream } from "@/data/passenger/passenger.service";
import { EventSource } from "extended-eventsource";
import { FilterMatchMode } from "primevue/api";
import type DataTable from "primevue/datatable";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onUnmounted, ref, type Ref } from "vue";

const passengers: Ref<Passenger[]> = ref([]);

const eventHandler = new PassengerEventHandler();
let eventSource: EventSource;

const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PassNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Weight: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "Flight.FlightNo": { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const columns = [
    {
        field: "PassNo",
        header: "Nr",
    },
    {
        field: "LastName",
        header: "Nachname",
    },
    {
        field: "FirstName",
        header: "Vorname",
    },
    {
        field: "Weight",
        header: "Gewicht (kg)",
    },
    {
        field: "Flight.FlightNo",
        header: "Flug",
    },
];

const toast = useToast();
const isDataLoaded = ref(false);

onBeforeMount(async () => {
    passengers.value = await useValidateAPIData(getPassengers(), toast);

    isDataLoaded.value = true;

    eventSource = getPassengersStream();

    eventSource.onmessage = (event) => {
        eventHandler.onEntityEvent(event, passengers.value, toast);
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
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Passagiere" v-model:filters="filters" :dt="dt" />
        <div class="relative flex-grow-1 flex overflow-auto">
            <TransitionLoading :isDataLoaded="isDataLoaded">
                <PrimeDataTable 
                    :value="passengers"
                    ref="dt"
                    exportFilename="export_passengers"
                    csvSeparator=";"
                    v-model:filters="filters"
                    filterDisplay="row" 
                    sortMode="multiple"
                    removableSort
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <template #empty> Keine Passagiere gefunden. </template>
                    <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                </PrimeDataTable>
            </TransitionLoading>
        </div>
    </main>
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
