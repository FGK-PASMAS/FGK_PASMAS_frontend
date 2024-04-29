<script setup lang="ts">
import type DataTable from 'primevue/datatable';
import { type PropType } from 'vue';
import ContentHeader from './ContentHeader.vue';

const filters = defineModel("filters", {
    type: Object
});

const props = defineProps({
    dt: {
        type: Object as PropType<DataTable | undefined>
    }
});

function exportCSV(): void
{
    props.dt?.exportCSV();
}
</script>

<template>
    <div class="flex justify-content-between align-items-center gap-2 flex-wrap md:flex-nowrap">
        <ContentHeader v-bind="$attrs" />
        <div class="flex-grow-1 md:flex-grow-0 flex gap-2">
            <PrimeButton icon="bi-box-arrow-up-right" label="Export" @click="exportCSV()" />
            <span class="p-input-icon-left flex-grow-1">
                <i class="bi-search" />
                <PrimeInputText v-model="filters['global'].value" placeholder="Suche..." class="w-full" />
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
