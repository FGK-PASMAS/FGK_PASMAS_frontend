<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MenuDrawer from './components/MenuDrawer.vue';
import MenuItem from './components/MenuItem.vue';
import MenuTopbar from './components/MenuTopbar.vue';

const router = useRouter();
const isNotFound = ref(false);
const isOpen = ref(false);
const isClosed = ref(false);

router.beforeEach((to) => {
    if (to.name === 'notFound') {
        isNotFound.value = true;
    } else {
        isNotFound.value = false;
    }
});

function openDrawer()
{
    isOpen.value = true;
    isClosed.value = false;
}
</script>

<template>
    <div class="h-full flex">
        <MenuDrawer v-if="!isNotFound" v-model:isOpen="isOpen" v-model:isClosed="isClosed" >
            <MenuItem icon="bi-book" item="Planung" to="/" />
            <MenuItem icon="bi-airplane" item="Flüge" to="/flights" />
            <MenuItem icon="bi-people" item="Passagiere" to="/passengers" />
            <MenuItem icon="bi-gear" item="Einstellungen" to="/settings" />
        </MenuDrawer>
        <PrimeScrollPanel style="height: 100%; width: 100%;">
            <MenuTopbar v-if="!isNotFound" class="topbar" :class="{ 'show': isClosed }" @openDrawer="openDrawer()" />
            <RouterView class="ml-2 md:ml-8 mr-2 md:mr-8" />
        </PrimeScrollPanel>
    </div>
</template>

<style lang="scss">
@import "primeflex/primeflex.scss";

@media screen and (min-width: $md) {
    .topbar {
        visibility: hidden;
    }
}

.show {
    visibility: visible;
}

</style>
