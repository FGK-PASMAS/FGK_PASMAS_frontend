<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from 'primevue/sidebar';
import MenuLogo from './MenuLogo.vue';
import MenuItem from './MenuItem.vue';

const visible = ref(false);
</script>

<template>
    <header>
        <PrimeButton class="menu-icon" icon="bi-filter-left" text rounded aria-label="Menu" @click="visible = true"/>
        <MenuLogo/>
    </header>

    <Sidebar v-model:visible="visible">
        <template #header>
            <MenuLogo />
        </template>
        <div class="menu-list menu-bar">
            <div class="menu-list">
                <MenuItem icon="bi-book" item="Planung" to="/"/>
                <MenuItem icon="bi-airplane" item="Flüge" to="flights"/>
                <MenuItem icon="bi-people" item="Passagiere" to="passengers"/>
                <MenuItem icon="bi-gear" item="Einstellungen" to="settings"/>
            </div>
            <div class="menu-info">
                <PrimeDivider />
                <p>v0.1.0</p>
                <div class="menu-copyright">
                    <i class="bi-c-circle"/>
                    <span>PASMAS</span>
                </div>
            </div>
        </div>
        
    </Sidebar>

</template>

<style scoped lang="scss">
    header {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    :deep(.menu-icon) {
        font-size: 2.5rem;
    }


    .menu-list {
        display: flex;
        flex-direction: column;
    }

    .menu-bar {
        height: 100%;
        justify-content: space-between;
    }

    .menu-info {
        text-align: center;
    }

    .menu-copyright {
        display: flex;
        justify-content: center;
        gap: 5px;
    }
</style>
