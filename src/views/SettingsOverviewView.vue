<script setup lang="ts">
import AppTile from '@/components/AppTile.vue';
import ContentHeader from '@/components/ContentHeader.vue';
</script>

<template>
    <main>
        <ContentHeader title="Einstellungen" />
        <div class="flex flex-column md:flex-row flex-wrap gap-4">
            <RouterLink :to="{ name: 'settings.user' }" class="no-underline">
                <AppTile icon="bi-person-fill-gear" title="Benutzer" />
            </RouterLink>
            <RouterLink :to="{ name: 'settings.blocker' }" class="no-underline">
                <AppTile icon="bi-calendar2-week-fill" title="Flugblocker" />
            </RouterLink>
            <RouterLink :to="{ name: 'settings.plane' }" class="no-underline">
                <AppTile icon="bi-airplane-fill" title="Flugzeuge" />
            </RouterLink>
        </div>
    </main>    
</template>

<style scoped lang="scss">
</style>
