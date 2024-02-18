<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import { PassengerEventHandler } from "@/data/passenger/passenger.eventHandler";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getPassengers, getPassengersStream } from "@/data/passenger/passenger.service";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onUnmounted, ref, type Ref } from "vue";

const toast = useToast();

const passengers: Ref<Passenger[]> = ref([]);

const eventHandler = new PassengerEventHandler();
let eventSource: EventSource;

const columns = [
    {
        field: "ID",
        header: "ID",
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
        field: "CreatedAt",
        header: "Erstellt am",
    },
    {
        field: "UpdatedAt",
        header: "Aktualisiert am",
    },
];

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Weight: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CreatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UpdatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onBeforeMount(async () => {
    passengers.value = await useValidateAPIData(getPassengers(), toast);
    
    eventSource = getPassengersStream();

    eventSource.onopen = async () => {
        passengers.value = await useValidateAPIData(getPassengers(), toast);
    }

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
    <main>
        <ContentHeader title="Passagiere" />
        <div>
            <PrimeDataTable 
                v-model:filters="filters" 
                :value="passengers"
                filterDisplay="row"
                sortMode="multiple"
                removableSort
                stripedRows
            >
                <template #header>
                    <div class="flex justify-content-end">
                        <span class="p-input-icon-left">
                            <i class="bi-search" />
                            <PrimeInputText v-model="filters['global'].value" placeholder="Suche..." />
                        </span>
                    </div>
                </template>
                <template #empty> Keine Passagiere gefunden. </template>
                <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText class="filter-input p-column-filter" v-model="filterModel.value" type="text" @input="filterCallback()" />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>
    </main>
</template>

<style scoped lang="scss">
// ToDo: Fixed table headers / Show table headers when scrolling up
.filter-input {
    min-width: 75px;
}
</style>
