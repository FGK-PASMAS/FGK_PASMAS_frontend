<script setup lang="ts">
import { RouterLink} from "vue-router";

defineProps({
    icon: {
        type: String,
        required: true
    },

    item: {
        type: String,
        required: true
    },

    to: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <RouterLink class="menu-item" :to="to">
        <div class="flex align-items-center gap-2 p-2 border-round-sm">
            <i class="text-2xl" :class="icon" />
            <span>{{ item }}</span>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
    .menu-item {
        color: inherit;
        text-decoration: none;
    }

    .router-link-active div {
        background-color: var(--primary-color);
    }
</style>
