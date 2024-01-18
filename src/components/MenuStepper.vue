<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Steps from 'primevue/steps';
import { type MenuItem } from 'primevue/menuitem';

const router = useRouter();
const currentRoute = ref(router.currentRoute.value.name);
const prevRoute = ref(router.currentRoute.value.meta.prev);
const nextRoute = ref(router.currentRoute.value.meta.next);
const activeStep = ref(0);
const props = defineProps({
    items: {
        type: Array<MenuItem>,
        required: true
    },
    isNextDisabled: {
        type: Boolean,
        default: true
    }
});

router.afterEach(() => {
    currentRoute.value = router.currentRoute.value.name;
    prevRoute.value = router.currentRoute.value.meta.prev;
    nextRoute.value = router.currentRoute.value.meta.next;
});

onBeforeMount(() => {
    let isCurrentRouteFound = false;

    props.items.forEach((item, index) => {
        item.command = (event) => { jumpStep(event.item) };

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
});

onBeforeUpdate(() => {
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
});

function previousStep() 
{
    router.push({ name: prevRoute.value });
}

function nextStep()
{
    router.push({ name: nextRoute.value });
}

function jumpStep(item: MenuItem)
{
    router.push({ name: item.route })
}
</script>

<template>
    <div class="flex flex-column gap-6">
        <Steps v-model:activeStep="activeStep" :model="props.items" :readonly="false">
            <template #item="{ item, label, active }">
                <div class="test flex flex-column align-items-center gap-2">
                    <span class="mb-4 md:mb-0" :class="['inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer ', { 'bg-primary': active, 'text-color': active , 'surface-50': !activeStep, 'text-primary': !active }]">
                        <i :class="[item.icon, 'text-xl']" />
                    </span>
                    <label class="hidden md:block">{{ label }}</label>
                </div>
            </template>
        </Steps>
        <RouterView />
        <div class="flex flex-column">
            <PrimeDivider />
            <div class="flex justify-content-between">
                <PrimeButton class="text-color" :class="{ 'not-visible': !prevRoute }" @click="previousStep()">Zurück</PrimeButton>
                <PrimeButton class="text-color" :class="{ 'not-visible': !nextRoute }" :disabled="isNextDisabled" @click="nextStep()">Weiter</PrimeButton>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.not-visible {
    visibility: hidden;
}
</style>
