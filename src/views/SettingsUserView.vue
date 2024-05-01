<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue';
import DataTableViewHeader from '@/components/DataTableViewHeader.vue';
import UserCreation from '@/components/UserCreation.vue';
import type { User } from '@/data/user/user.interface';
import { FilterMatchMode } from 'primevue/api';
import type DataTable from 'primevue/datatable';
import { ref, type Ref } from 'vue';

const users: Ref<User[]> = ref([]);

const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const columns = [
    {
        field: "ID",
        header: "ID"
    },
    {
        field: "username",
        header: "Benutzer"
    },
    {
        field: "role",
        header: "Rolle"
    }
];

const isAddUserOpen = ref(false);

function addUser(): void
{
    isAddUserOpen.value = true;
}

function onAddUserEmit(): void
{
    isAddUserOpen.value = false;
}

function removeUser(data: any): void
{
    console.log(data);
    alert("NO API ENDPOINT AVAILABLE!");
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Benutzer" v-model:filters="filters" :dt="dt">
            <PrimeButton icon="bi-person-fill-add" label="Hinzufügen" @click="addUser()" class="text-color" />
        </DataTableViewHeader>
        <div class="flex-grow-1 overflow-auto">
            <PrimeDataTable
                :value="users"
                ref="dt"
                exportFilename="export_users"
                csvSeparator=";"
                v-model:filters="filters"
                filterDisplay="row"
                sortMode="multiple"
                removableSort
                stripedRows
                scrollable
                scrollHeight="flex"
            >
                <template #empty> Keine Benutzer gefunden. </template>
                <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                    <template #filter="{ filterModel, filterCallback }">
                        <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Aktion">
                    <template #body="slotProps">
                        <PrimeButton icon="bi-trash-fill" severity="danger" rounded @click="removeUser(slotProps.data)" class="text-red-50" />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
            <AppDialog v-model:isOpen="isAddUserOpen" :isStrictClose="true">
                <UserCreation @confirm="onAddUserEmit()" @cancel="onAddUserEmit()" />
            </AppDialog>
        </div>
    </main>
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
