<script setup lang="ts">
import type { MenuItemInterface } from "@/utils/interfaces/menuItem.interface";
import Steps from "primevue/steps";
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import { RouterView, onBeforeRouteUpdate, useRouter } from "vue-router";

const router = useRouter();
const currentRoute = ref(router.currentRoute.value.name);
const prevRoute = ref(router.currentRoute.value.meta.prev);
const nextRoute = ref(router.currentRoute.value.meta.next);

const activeStep = ref(0);

const props = defineProps({
    items: {
        type: Array<MenuItemInterface>,
        required: true
    },

    isNextDisabled: {
        type: Boolean,
        default: true
    }
});

onBeforeMount(() => {
    props.items.forEach((item) => {
        item.command = (event) => { jumpToStep(event.item) };
    });

    setStepStates();
});

onBeforeUpdate(() => {
    setStepStates();
});

onBeforeRouteUpdate((to) => {
    currentRoute.value = to.name;
    prevRoute.value = to.meta.prev;
    nextRoute.value = to.meta.next;
});

function setStepStates(): void
{
    let isCurrentRouteFound = false;

    props.items.forEach((item, index) => {
        if (!isCurrentRouteFound) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }

        if (item.route === currentRoute.value) {
            isCurrentRouteFound = true;
            activeStep.value = index;
        }
    });
}

function previousStep(): void 
{
    router.replace({ name: prevRoute.value });
}

function nextStep(): void
{
    router.replace({ name: nextRoute.value });
}

function jumpToStep(item: MenuItemInterface): void
{
    router.replace({ name: item.route });
}
</script>

<template>
    <div class="flex flex-column md:gap-4 overflow-hidden">
        <Steps v-model:activeStep="activeStep" :model="props.items" :readonly="false">
            <template #item="{ item, label, active }">
                <div class="flex flex-column align-items-center gap-2">
                    <span class="mb-4 md:mb-0" :class="['inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem cursor-pointer z-1', { 'bg-primary': active, 'text-color': active , 'surface-50': !active, 'text-primary': !active }]">
                        <i :class="[item.icon, 'text-xl']" />
                    </span>
                    <label class="hidden md:block">{{ label }}</label>
                </div>
            </template>
        </Steps>
        <RouterView class="flex-grow-1 overflow-auto" />
        <div class="flex flex-column">
            <PrimeDivider />
            <div class="flex justify-content-between">
                <PrimeButton type="button" class="text-color mb-1 ml-1" :class="{ 'not-visible': !prevRoute }" label="Zurück" icon="bi-arrow-left" text @click="previousStep()"
                    :pt="{
                        label: { class: 'font-normal' }
                    }"
                />
                <PrimeButton type="button" class="text-color mb-1 mr-1" :class="{ 'hidden': !nextRoute }" @click="nextStep()" :disabled="isNextDisabled">Weiter</PrimeButton>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.not-visible {
    visibility: hidden;
}
</style>
