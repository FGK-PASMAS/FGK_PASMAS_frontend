<script setup lang="ts">
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
    <Transition>
        <div v-if="isOpen" class="shade z-4">
            <div class="dialog flex flex-column justify-content-center align-items-center gap-5 md:border-round surface-100 p-4 overflow-hidden">
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
        </div>
    </Transition>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.shade {    
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.dialog-icon {
    color: var(--primary-color);
    font-size: 4rem;
}

@media screen and (min-width: $md) {
    .dialog {
        position: absolute;
        top: 10%;
        left: 50%;
        width: 50%;
        height: 40%;
        transform: translateX(-50%);
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
}

@media screen and (max-width: $md) {
    .dialog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(0);
    }

    .v-enter-active,
    .v-leave-active {
        transition: transform 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        transform: translateX(-100%);
    }
}
</style>
