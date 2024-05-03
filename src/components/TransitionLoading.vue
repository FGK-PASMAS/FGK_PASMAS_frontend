<script setup lang="ts">
defineProps({
    isDataLoaded: {
        type: Boolean,
        required: true
    }
});
</script>

<template>
    <Transition name="fade">
        <div v-if="isDataLoaded">
            <slot></slot>
        </div>
        <div v-else class="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center surface-200">
            <PrimeProgressSpinner strokeWidth="4" />
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
