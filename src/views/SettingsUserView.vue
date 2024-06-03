<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTableViewHeader from '@/components/DataTableViewHeader.vue';
import TransitionLoading from '@/components/TransitionLoading.vue';
import UserCreation from '@/components/UserCreation.vue';
import { useValidateAPIData } from '@/core/composables/useValidateAPIData';
import { InfoToast } from '@/core/toasts/info.toast';
import type { User } from '@/data/user/user.interface';
import { deleteUser, getUsers } from '@/data/user/user.service';
import { FilterMatchMode } from 'primevue/api';
import type DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, ref, type Ref } from 'vue';

const users: Ref<User[]> = ref([]);

const dt: Ref<DataTable | undefined> = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Role: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const columns = [
    {
        field: "Username",
        header: "Benutzer"
    },
    {
        field: "Role",
        header: "Rolle"
    }
];

const toast = useToast();
const isDataLoaded = ref(false);
const isAddUserOpen = ref(false);
const isRemoveUserOpen = ref(false);
let userToRemove: User | undefined;
let userRemovalMsg = "Soll der Benutzer wirklich gelöscht werden?";

onBeforeMount(async () => {
    users.value = await useValidateAPIData(getUsers(), toast);

    isDataLoaded.value = true;
});

function addUser(): void
{
    isAddUserOpen.value = true;
}

async function onAddUserEmit(): Promise<void>
{
    // ToDo: Can be removed if there is a suitable users SSE endpoint
    users.value = await useValidateAPIData(getUsers(), toast);
    isAddUserOpen.value = false;
}

function removeUser(user: User): void
{
    userToRemove = user;

    userRemovalMsg = "Soll Benutzer " + userToRemove?.Username + " wirklich gelöscht werden?";

    isRemoveUserOpen.value = true;
}

async function confirmUserRemoval(): Promise<void>
{
    if (!userToRemove) {
        return;
    }

    await useValidateAPIData(deleteUser(userToRemove), toast);

    // ToDo: Can be removed if there is a suitable users SSE endpoint
    users.value = await useValidateAPIData(getUsers(), toast);
    toast.add(new InfoToast({ detail: "Benutzer " + userToRemove.Username + " wurde erfolgreich gelöscht." }));
    
    userToRemove = undefined;
}

function cancelUserRemoval(): void
{
    userToRemove = undefined;
}
</script>

<template>
    <main class="flex flex-column overflow-hidden">
        <DataTableViewHeader title="Benutzer" v-model:filters="filters" :dt="dt">
            <PrimeButton icon="bi-person-fill-add" label="Hinzufügen" @click="addUser()" class="text-color" />
        </DataTableViewHeader>
        <div class="relative flex-grow-1 flex overflow-auto">
            <TransitionLoading :isDataLoaded="isDataLoaded">
                <PrimeDataTable
                    :value="users"
                    ref="dt"
                    exportFilename="export_users"
                    csvSeparator=";"
                    v-model:filters="filters"
                    filterDisplay="menu"
                    sortMode="multiple"
                    removableSort
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <template #empty> Keine Benutzer gefunden. </template>
                    <PrimeColumn header="Aktion">
                        <template #body="slotProps">
                            <PrimeButton icon="bi-trash-fill" severity="danger" rounded @click="removeUser(slotProps.data)" class="text-color" />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                        <template #filter="{ filterModel, filterCallback }">
                            <PrimeInputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-5rem" placeholder="Filter..." />
                        </template>
                    </PrimeColumn>
                </PrimeDataTable>
            </TransitionLoading>
        </div>
        <AppDialog v-model:isOpen="isAddUserOpen" :isStrictClose="true">
            <UserCreation @confirm="onAddUserEmit()" @cancel="onAddUserEmit()" />
        </AppDialog>
        <ConfirmDialog 
            v-model:isOpen="isRemoveUserOpen"
            :description="userRemovalMsg"
            @confirm="confirmUserRemoval()"
            @cancel="cancelUserRemoval()"
        />
    </main>
</template>

<style scoped lang="scss">
.min-w-5rem {
    min-width: 5rem;
}
</style>
