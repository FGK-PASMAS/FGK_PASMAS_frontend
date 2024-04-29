<script setup lang="ts">
import { authStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

const appName = import.meta.env.VITE_APP_NAME;

const auth = authStore();
</script>

<template>
    <main>
        <h1>Home</h1>
        <div v-if="!auth.isAuthenticated">
            <PrimePanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="bi-feather" />
                        <span class="font-bold">{{ appName }} - Die neue Art Flüge zu verwalten!</span>
                    </div>
                </template>
                <div>
                    <p>{{ appName }} erlaubt es dir auf einfachen Wege deine Flüge und Passagiere zu verwalten!</p>
                    <p>
                        Um {{ appName }} jedoch nutzen zu können benötigst du Zugangsdaten.
                        Falls du noch keine besitzt, kannst du diese bei deinem Systemadministrator deines Vertrauens anfragen.
                    </p>
                </div>
            </PrimePanel>
        </div>
        <div v-else>
            <p>Willkommen bei {{ appName }}!</p>
            <div class="flex flex-column gap-3 mt-6">
                <PrimePanel v-if="auth.isVendor">
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="bi-book" />
                            <span class="font-bold">Buchen</span>
                        </div>
                    </template>
                    <RouterLink :to="{ name: 'booking' }" class="text-color no-underline">
                        <i class="bi-arrow-right text-primary mr-2" />
                        <span>Lege direkt los und buche einen Flug!</span>
                    </RouterLink>
                </PrimePanel>
                <PrimePanel v-if="auth.isAuthenticated">
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="bi-airplane" />
                            <span class="font-bold">Flüge</span>
                        </div>
                    </template>
                    <RouterLink :to="{ name: 'flights' }" class="text-color no-underline">
                        <i class="bi-arrow-right text-primary mr-2" />
                        <span>Hier findest du alle im System erfassten Flüge!</span>
                    </RouterLink>
                </PrimePanel>
                <PrimePanel v-if="auth.isAdmin">
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="bi-people" />
                            <span class="font-bold">Passagiere</span>
                        </div>
                    </template>
                    <RouterLink :to="{ name: 'passengers' }" class="text-color no-underline">
                        <i class="bi-arrow-right text-primary mr-2" />
                        <span>Hier findest du alle Passagier zu deinen Flüge!</span>
                    </RouterLink>
                </PrimePanel>
                <PrimePanel v-if="auth.isAdmin">
                    <template #header>
                        <div class="flex align-items-center gap-2">
                            <i class="bi-gear" />
                            <span class="font-bold">Einstellungen</span>
                        </div>
                    </template>
                    <RouterLink :to="{ name: 'settings' }" class="text-color no-underline">
                        <i class="bi-arrow-right text-primary mr-2" />
                        <span>Hier kannst du Änderungen an {{ appName }} vornehmen, wie z.B. das Ändern von Flugzeugstammdaten!</span>
                    </RouterLink>
                </PrimePanel>
                <p></p>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
h1 {
    margin: 1rem 0;
}
</style>
