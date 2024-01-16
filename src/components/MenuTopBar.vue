<script setup lang="ts">
import MenuLogo from './MenuLogo.vue';

defineProps([
    "isVisible"
]);

</script>

<template>
    <header class="sticky top-0 left-0 flex align-items-center p-2">
        <div class="flex align-items-center" :class="{'not-visible': !isVisible}">
            <PrimeButton class="btn-open text-6xl" icon="bi-filter-left" text rounded @click="$emit('openDrawer')" />
            <MenuLogo />
        </div>
    </header>
</template>

<style lang="scss">
header {
    background-color: var(--surface-50);
}

.btn-open:focus {
    box-shadow: none;
}

.not-visible {
    visibility: hidden;
}
</style>
