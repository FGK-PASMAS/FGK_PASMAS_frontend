<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MenuDrawer from './components/MenuDrawer.vue';
import MenuItem from './components/MenuItem.vue';
import MenuTopBar from './components/MenuTopBar.vue';

const router = useRouter();
const isNotFound = ref(false);
const isOpen = ref(true);

router.beforeEach((to, from) => {
    if (to.name === 'notFound') {
        isNotFound.value = true;
    } else {
        isNotFound.value = false;
    }
});

function onOpenDrawer()
{
    isOpen.value = true;
}
</script>

<template>
    <div class="h-full flex">
        <MenuDrawer v-if="!isNotFound" v-model="isOpen">
            <MenuItem icon="bi-book" item="Planung" to="/" />
            <MenuItem icon="bi-airplane" item="Flüge" to="/flights" />
            <MenuItem icon="bi-people" item="Passagiere" to="/passengers" />
            <MenuItem icon="bi-gear" item="Einstellungen" to="/settings" />
        </MenuDrawer>
        <PrimeScrollPanel style="height: 100%; width: 100%;">
            <MenuTopBar :isVisible="!isOpen" @openDrawer="onOpenDrawer()"/>
            <RouterView />
        </PrimeScrollPanel>
    </div>
</template>

<style lang="scss">
</style>
