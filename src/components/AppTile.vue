<script setup lang="ts">
defineProps({
    icon: {
        type: String,
        default: "bi-feather"
    },
    title: {
        type: String,
        default: "Kachel"
    }
});
</script>

<template>
    <div class="card flex flex-column justify-content-center align-items-center gap-2 border-round text-color surface-200">
        <i class="text-7xl" :class="icon" />
        <div>
            <i class="bi-arrow-right text-primary mr-2" />
            <span>{{ title }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.card {
    height: 160px;
    width: auto;
}

@media screen and (min-width: $md) {
    .card {
        width: 160px;
    }
}
</style>
