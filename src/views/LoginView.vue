<script setup lang="ts">
import AppDialog from "@/components/AppDialog.vue";
import MenuLogo from "@/components/MenuLogo.vue";
import { authStore } from "@/stores/auth";
import InputGroupAddon from 'primevue/inputgroupaddon';
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const auth = authStore();
const toast = useToast();

const username = ref("");
const password = ref("");

async function login(): Promise<void>
{
    if (!(await auth.authenticate(username.value, password.value, toast))) {
        return;
    }

    router.replace({ name: "home" });
}
</script>

<template>
    <main>
        <AppDialog :isOpen="true" :showCloseButton="false" :isStrictClose="true">
            <div class="h-full flex flex-column justify-content-between">
                <div>
                    <MenuLogo />
                    <div class="flex flex-column gap-4 mt-8 surface-200">
                        <h1>Login</h1>
                        <div class="flex flex-column gap-1">
                            <PrimeInputGroup>
                                <InputGroupAddon>
                                    <i class="bi-person-fill" />
                                </InputGroupAddon>
                                <PrimeInputText type="text" v-model="username" placeholder="Benutzername" />
                            </PrimeInputGroup>
                            <PrimeInputGroup>
                                <InputGroupAddon>
                                    <i class="bi-key-fill" />
                                </InputGroupAddon>
                                <PrimeInputText type="password" v-model="password" placeholder="Passwort"/>
                            </PrimeInputGroup>
                        </div>
                        <PrimeButton label="Login" @click="login()" class="text-color" />
                    </div>
                </div>
                <div>
                    <RouterLink :to="{ name: 'home' }" class="flex gap-2 text-color">
                        <i class="bi-arrow-left text-primary" />
                        <span>Zurück zur Homepage</span>
                    </RouterLink>
                </div>
            </div>
        </AppDialog>
    </main>
</template>

<style scoped lang="scss">
</style>
