<script setup lang="ts">
import { RouterLink} from 'vue-router';

defineProps([
    "icon",
    "item",
    "to"
]);
</script>

<template>
    <RouterLink class="menu-item" :to="to">
        <div class="menu-label">
            <i :class="icon"/>
            {{ item }}
        </diV>
    </RouterLink>
</template>

<style scoped lang="scss">
    .menu-item {
        color: inherit;
        text-decoration: none;
        padding: 10px;
        border-radius: 5px;
    }

    .menu-item:hover {
        background-color: var(--surface-100);
    }

    .menu-label {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .menu-label i {
        font-size: 1.5rem;
    }

    .router-link-active {
        background-color: var(--surface-300);
    }
</style>
