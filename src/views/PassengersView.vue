<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { ErrorToast } from "@/utils/toasts/error.toast";
import { InfoToast } from "@/utils/toasts/info.toast";
import type { Passenger } from "@/data/passenger/passenger.interface";
import { getPassengers, getPassengersStream } from "@/data/passenger/passenger.service";
import ContentHeader from "@/components/ContentHeader.vue";

const toast = useToast();

const passengers = ref<Passenger[]>([]);

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

// ToDo Composable
onBeforeMount(async () => {
    const data = await getPassengers();

    if (data instanceof APIError) {
        toast.add(new ErrorToast(data.Message, undefined, data.Type));
        throw data;
    }

    passengers.value = data;
    
    eventSource = getPassengersStream();

    eventSource.onopen = async () => {
        const data = await getPassengers();

        if (data instanceof APIError) {
            toast.add(new ErrorToast(data.Message, undefined, data.Type));
            throw data;
        }

        passengers.value = data;
    }

    eventSource.onmessage = (event) => {
        handleOnMessageEvent(event);
    }

    eventSource.onerror = () => {
        toast.add(new ErrorToast("Es wird versucht eine Verbindung aufzubauen...", 5000, "Verbindung verloren"));
    }
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

function handleOnMessageEvent(event: MessageEvent): void
{
    const json = JSON.parse(event.data);
    const action: string = json.action;
    const passengerData: Passenger = json.data;
    
    switch(action) {
        case "CREATED":
            passengers.value.push(passengerData);
            
            toast.add(new InfoToast("Passagier " + passengerData.LastName + ", " + passengerData.FirstName + " wurde angelegt."));

            break;
        case "DELETED":
            passengers.value = passengers.value.filter((passenger) => {
                return passenger.ID !== passengerData.ID;
            });

            toast.add(new InfoToast("Passagier " + passengerData.LastName + ", " + passengerData.FirstName + " wurde gelöscht."));

            break;
    }
}

/*******
/* DEBUG
 *******/
import { createPassenger, deletePassenger } from "@/data/passenger/passenger.service";
import { APIError } from "@/utils/errors/api.error";

const debugPassenger = ref<Passenger>({
    LastName: undefined,
    FirstName: undefined,
    Weight: undefined
});

const debugPassengerId = ref<number>();

function debugAddPassenger()
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

    createPassenger(debugPassenger.value);
}

function debugDeletePassenger()
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

    deletePassenger(debugPassengerId.value);
}
/*******
 * DEBUG
 *******/
</script>

<template>
    <main>
        <ContentHeader title="Passagiere" />
        
        <!--DEBUG-->
        <div>
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
        <!--DEBUG-->
        
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
.filter-input {
    min-width: 75px;
}
</style>
@/utils/toasts/error.toast@/utils/toasts/info.toast