<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import MenuMain from './components/MenuMain.vue';

const showMenu = ref(true);
const router = useRouter();

router.beforeEach((to, from) => {
    if (to.name === 'notFound') {
        showMenu.value = false;
    } else {
        showMenu.value = true;
    }
});
</script>

<template>
    <MenuMain v-if="showMenu" class="menu"/>
    <RouterView />
</template>

<style lang="scss">
    body {
        margin: 0;
        padding: 0px;
    }

    :root {
        background-color: var(--surface-50);
    }

    .menu {
        width: 100%;
        position: sticky;
        top: 0;
        left: 0;
        background-color: var(--surface-50);
    }
</style>
