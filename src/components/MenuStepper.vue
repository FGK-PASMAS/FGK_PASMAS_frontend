<script setup lang="ts">
import type { MenuStepperItemInterface } from "@/utils/interfaces/menuStepperItem.interface";
import Steps from "primevue/steps";
import { computed, onBeforeMount, onBeforeUpdate, ref } from "vue";

const activeStep = ref(0);

const props = defineProps({
    items: {
        type: Array<MenuStepperItemInterface>,
        required: true
    },

    isNextNavEnabled: {
        type: Boolean,
        default: true
    }
});

const nextNavLabel = computed(() => {
    if (activeStep.value === (props.items.length - 1)) {
        return "Bestätigen";
    }

    return "Weiter";
});

const emit = defineEmits([
    "confirm",
    "stepChanged"
]);

defineExpose({
    getCurrentStepKey,
    resetStepper
});

onBeforeMount(() => {
    props.items.forEach((item) => {
        item.command = () => { 
            emit("stepChanged", item.key);
        };
    });

    updateStepperState();
});

onBeforeUpdate(() => {
    updateStepperState();
});

function updateStepperState(): void
{
    props.items.forEach((item, index) => {
        if (index <= activeStep.value) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }
    });
}

function previousStep(): void
{
    if (activeStep.value === 0) {
        return;
    }

    activeStep.value--;
    emit("stepChanged", props.items[activeStep.value].key);
}

function nextStep(): void
{
    if (activeStep.value === (props.items.length - 1)) {
        emit("confirm");
        return;
    }

    activeStep.value++;
    emit("stepChanged", props.items[activeStep.value].key);
}

function getCurrentStepKey(): string | undefined
{
    return props.items[activeStep.value].key;
}

function resetStepper(): void
{
    activeStep.value = 0;
}
</script>

<template>
    <div class="flex flex-column overflow-hidden">
        <Steps v-model:activeStep="activeStep" :model="props.items" :readonly="false" class="md:mb-4">
            <template #item="{ item, label, active }">
                <div class="flex flex-column align-items-center gap-2">
                    <span class="mb-4 md:mb-0" :class="['inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem cursor-pointer z-1', { 'bg-primary': active, 'text-color': active , 'surface-50': !active, 'text-primary': !active }]">
                        <i :class="[item.icon, 'text-xl']" />
                    </span>
                    <label class="hidden md:block">{{ label }}</label>
                </div>
            </template>
        </Steps>
        <component :is="items[activeStep].component" class="flex-grow-1 overflow-auto" />
        <div class="flex flex-column">
            <PrimeDivider />
            <div class="flex justify-content-between">
                <!-- Custom icon button due to lag between visibility transistion when using PrimeVue icon property -->                
                <PrimeButton type="button" text class="text-color mb-1 ml-1" :class="{ 'not-visible': activeStep === 0 }" @click="previousStep()">
                    <i class="bi-arrow-left" />
                    <span class="ml-2">Zurück</span>
                </PrimeButton>
                <PrimeButton type="button" class="text-color mb-1 mr-1" @click="nextStep()" :disabled="!isNextNavEnabled">{{ nextNavLabel }}</PrimeButton>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
