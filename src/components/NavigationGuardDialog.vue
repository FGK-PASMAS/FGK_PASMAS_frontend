<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import ConfirmDialog from './ConfirmDialog.vue';

const router = useRouter();

let navTo: string;
let navBack: string;
let navForward: string;

let popstateDetected = false;

const isAllowedToLeave = defineModel("isAllowedToLeave", {
    type: Boolean,
    default: false
});

window.addEventListener("popstate", popstateHandler);

onBeforeRouteLeave((to) => {
    navTo = to.path

    return isAllowedToLeave.value;
});

function popstateHandler(event: PopStateEvent): void
{
    if (event.state.current !== router.currentRoute.value.path) {
        return;
    }

    popstateDetected = true;
    navBack = event.state.back;
    navForward = event.state.forward;
}

function confirmNavigation(): void
{
    isAllowedToLeave.value = true;

    removeEventListener("popstate", popstateHandler);

    if (popstateDetected) {
        if (navTo === navBack) {
            router.go(-1);
            return;
        }

        if (navTo === navForward) {
            router.go(1);
            return;
        }
    } 
    
    router.push(navTo);
}
</script>

<template>
<ConfirmDialog @confirm="confirmNavigation()" />
</template>

<style scoped lang="scss">
</style>
