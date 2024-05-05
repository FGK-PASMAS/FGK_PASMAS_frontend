<script setup lang="ts">
import AppDialog from "@/components/AppDialog.vue";
import DataTableViewHeader from "@/components/DataTableViewHeader.vue";
import PlaneEdit from "@/components/PlaneEdit.vue";
import TransitionLoading from "@/components/TransitionLoading.vue";
import { useValidateAPIData } from "@/composables/useValidateAPIData";
import type { Division } from "@/data/division/division.interface";
import { getDivisions } from "@/data/division/division.service";
import { PlaneEventHandler } from "@/data/plane/plane.eventHandler";
import type { Plane } from "@/data/plane/plane.interface";
import { getPlanes, getPlanesStream } from "@/data/plane/plane.service";
import { WarningToast } from "@/utils/toasts/warning.toast";
import type { EventSource } from "extended-eventsource";
import { FilterMatchMode } from "primevue/api";
import type DataTable from "primevue/datatable";
import type { TabMenuChangeEvent } from "primevue/tabmenu";
import { useToast } from "primevue/usetoast";
import { onBeforeMount, onUnmounted, type Ref, ref } from "vue";

const divisions: Ref<Division[]> = ref([]);
const planes: Ref<Plane[]> = ref([]);

const eventHandler = new PlaneEventHandler();
let eventSource: EventSource;

const tabIndex = ref(0);
const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Registration: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AircraftType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    SlotStartTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    SlotEndTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const columnsBasic = [
    {
        field: "Registration",
        header: "FK",
    },
    {
        field: "AircraftType",
        header: "Typ",
    }
];

const toast = useToast();
const isDataLoaded = ref(false);
const planeIndex = ref(0);
const isEditDialogOpen = ref(false);

// Flag to determine if incoming SSEs are due to this client or other ones
const isEditInProgress = ref(false);

onBeforeMount(async () => {
    divisions.value = await useValidateAPIData(getDivisions(), toast);

    divisions.value.unshift({
        ID: 0,
        Name: "Alle"
    });

    planes.value = await useValidateAPIData(getPlanes({
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePilots: true,
        includePrefPilot: true,
    }), toast);

    isDataLoaded.value = true;

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

function onPlaneEvent(event: MessageEvent<any>): void
{
    const message = JSON.parse(event.data);

    if (isEditInProgress.value) {
        return;
    }

    if (planes.value[planeIndex.value].ID !== message?.data?.ID) {
        return;
    }

    onFinishedPlaneEdit();

    toast.add(new WarningToast({ detail: "Vorgang wurde abgebrochen." }));
}

async function changeTab(event: TabMenuChangeEvent): Promise<void>
{
    event.originalEvent.stopPropagation();

    if (event.index === tabIndex.value) {
        return;
    }

    tabIndex.value = event.index;

    isDataLoaded.value = false;

    planes.value = await useValidateAPIData(getPlanes({
        byDivisionId: divisions.value[tabIndex.value]!.ID!,
        includePilots: true,
        includePrefPilot: true,
    }), toast);

    isDataLoaded.value = true;
}

function editPlane(index: any): void 
{   
    planeIndex.value = index;
    isEditDialogOpen.value = true;
}

function onPlaneEditPreConfirm(): void
{
    isEditInProgress.value = true;
}

function onFinishedPlaneEdit(): void
{
    isEditInProgress.value = false;
    isEditDialogOpen.value = false;
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Flugzeuge" v-model:filters="filters" :dt="dt" />
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
                    :value="planes"
                    ref="dt"
                    exportFilename="export_planes"
                    csvSeparator=";"
                    v-model:filters="filters"
                    filterDisplay="row"
                    sortMode="multiple"
                    removableSort
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <template #empty> Keine Flugzeuge gefunden. </template>
                    <PrimeColumn header="Aktion">
                        <template #body="slotProps">
                            <PrimeButton icon="bi-pencil-fill" rounded @click="editPlane(slotProps.index)" class="text-color" />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn v-for="col of columnsBasic" :key="col.field" :field="col.field" :header="col.header" sortable>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn field="SlotStartTime" header="Zeitraum Start">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.SlotStartTime?.toFormat("HH:mm, dd.LL.yyyy") }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn field="SlotEndTime" header="Zeitraum Ende">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.SlotEndTime?.toFormat("HH:mm, dd.LL.yyyy") }}</span>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                </PrimeDataTable>
            </TransitionLoading>
        </div>
        <AppDialog v-model:isOpen="isEditDialogOpen" :isStrictClose="true">
            <PlaneEdit v-model:plane="planes[planeIndex]" @preConfirm="onPlaneEditPreConfirm()" @postConfirm="onFinishedPlaneEdit()" @cancel="onFinishedPlaneEdit()" />
        </AppDialog>
    </main>    
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
