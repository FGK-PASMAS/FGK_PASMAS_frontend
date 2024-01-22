<script setup lang="ts">
// ToDo optimize whole page...

import { onBeforeMount, ref } from "vue";
import { type Passenger } from "@/data/passenger/passenger.interface";
import { getPassengers } from "@/data/passenger/passenger.service";
import ContentHeader from "@/components/ContentHeader.vue";

import { createPassenger, deletePassenger } from "@/data/passenger/passenger.service";
import { FilterMatchMode } from "primevue/api"

import { useToast } from "primevue/usetoast";
import { ToastInfo } from "@/utils/toasts/ToastInfo";

const toast = useToast();

const passengers = ref<Passenger[]>([]);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Weight: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CreatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UpdatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
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

onBeforeMount(async () => {
    passengers.value = await getPassengers();
})

// DEBUG
const debugPassenger = ref<Passenger>({
    LastName: undefined,
    FirstName: undefined,
    Weight: undefined
});

const debugPassengerId = ref<number>();

async function debugAddPassenger()
{
    if (!debugPassenger.value.LastName || !debugPassenger.value.FirstName || !debugPassenger.value.Weight) {
        toast.add({
            summary: "ACHTUNG",
            detail: "Zum Testen von Passagieren hinzufügen, bitte Nachname, Vorname und Gewicht angeben",
            severity: 'warn',
            life: 5000
        });

        return;
    }

    const newPassenger = await createPassenger(debugPassenger.value);

    passengers.value.push(newPassenger);

    toast.add(new ToastInfo("Passagier mit ID " + newPassenger.ID + " wurde angelegt."))
}

async function debugDeletePassenger()
{
    if (!debugPassengerId.value) {
        toast.add({
            summary: "ACHTUNG",
            detail: "Zum Testen von Passagieren löschen, bitte eine ID angeben",
            severity: 'warn',
            life: 5000
        });

        return;
    }

    const response = await deletePassenger(debugPassengerId.value);

    console.log(response);

    if (response) {
        passengers.value = passengers.value.filter((passenger) => {
            return passenger.ID !== debugPassengerId.value;
        });

        toast.add({
            summary: "Info",
            detail: "Passenger mit ID " + debugPassengerId.value + " wurde erfolgreich gelöscht",
            life: 5000
        });
    }
}
</script>

<template>
    <main>
        <ContentHeader title="Passagiere" />
        
        <div class="debug">
            <div>
                <PrimeInputText v-model="debugPassenger.LastName" placeholder="Nachname"/>
                <PrimeInputText v-model="debugPassenger.FirstName" placeholder="Vorname"/>
                <PrimeInputNumber v-model="debugPassenger.Weight" placeholder="Gewicht"/>
                <PrimeButton @click="debugAddPassenger()">Debug - Add Dummy Passenger</PrimeButton>
            </div>
            <div>
                <PrimeInputNumber v-model="debugPassengerId" placeholder="Zu löschende Passagier ID"/>
                <PrimeButton @click="debugDeletePassenger()">Debug - Delete Dummy Passenger</PrimeButton>
            </div>
        </div>
        
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
                <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" />
                    </template>
                </PrimeColumn>

            </PrimeDataTable>
        </div>
    </main>
</template>

<style scoped lang="scss">
</style>
