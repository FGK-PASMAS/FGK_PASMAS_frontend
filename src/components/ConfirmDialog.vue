<script setup lang="ts">
import AppDialog from './AppDialog.vue';

const isOpen = defineModel("isOpen", {
    type: Boolean,
    default: true
});

defineProps({
    icon: {
        type: String,
        default: "bi-exclamation-circle"
    },

    description: {
        type: String
    }
});

const emit = defineEmits([
    "confirm",
    "cancel"
]);

function confirmDialog(): void
{
    isOpen.value = false;
    emit("confirm");
}

function closeDialog(): void
{
    isOpen.value = false;
    emit("cancel");
}
</script>

<template>
    <AppDialog v-model:isOpen="isOpen" :showCloseButton="false" :isStrictClose="true">
        <div class="flex-grow-1 flex flex-column justify-content-center align-items-center gap-5 overflow-hidden">
            <i class="dialog-icon" :class="icon" />
            <div v-html="description" class="text-center line-height-2" />
            <div class="flex gap-5">
                <PrimeButton type="button" class="text-color" label="Bestätigen" icon="bi-check-lg" @click="confirmDialog()"
                    :pt="{
                        label: { class: 'font-normal' }
                    }"
                />
                <PrimeButton type="button" label="Abbrechen" icon="bi-x-lg" outlined @click="closeDialog()"
                    :pt="{
                        label: { class: 'font-normal' }
                    }"
                />
            </div>
        </div>
    </AppDialog>
</template>

<style scoped lang="scss">
.dialog-icon {
    color: var(--primary-color);
    font-size: 4rem;
}
</style>
