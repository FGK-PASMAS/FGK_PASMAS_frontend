<script setup lang="ts">
import { useValidateAPIData } from '@/composables/useValidateAPIData';
import { Role, type User } from '@/data/user/user.interface';
import { createUser } from '@/data/user/user.service';
import { InfoToast } from '@/utils/toasts/info.toast';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const emit = defineEmits([
    "confirm",
    "cancel"
]);

const username = ref("");
const roles = Object.values(Role);
const selectedRole = ref();
const password = ref("");
const passwordConfirm = ref("");

const toast = useToast();
const isConfirmButtonDisabled = ref(true);
const inputPassword = ref("password");
const iconPassword = ref("bi-eye-fill");

function onInput(): void
{
    if (!username.value || !selectedRole.value || !password.value || !passwordConfirm.value) {
        isConfirmButtonDisabled.value = true;
        return;
    }

    if (password.value !== passwordConfirm.value) {
        isConfirmButtonDisabled.value = true;
        return;
    }

    isConfirmButtonDisabled.value = false;
}

function togglePassword(): void
{
    if (inputPassword.value === "password") {
        inputPassword.value = "text";
        iconPassword.value = "bi-eye-slash-fill";
    } else {
        inputPassword.value = "password";
        iconPassword.value = "bi-eye-fill";
    }
}

async function confirm(): Promise<void> 
{
    const user: User = {
        Name: username.value,
        Role: selectedRole.value,
        Password: password.value
    };

    await useValidateAPIData(createUser(user), toast );

    // ToDo: Can be removed if there is a user SSE endpoint
    toast.add(new InfoToast({ detail: "Benutzer wurde erfolgreich angelegt." }));

    emit("confirm");
}

function cancel(): void
{
    emit("cancel");
}
</script>

<template>
    <div class="flex flex-column pr-2 overflow-auto">
        <div>
            <h1 class="m-0">Benutzer hinzufügen</h1>
            <PrimeDivider />
        </div>
        <div class="flex flex-column gap-6">
            <div class="flex flex-column gap-2">
                <PrimeInputText type="text" v-model="username" placeholder="Benutzer" @input="onInput()" />
                <PrimeDropdown ref="dropDown" v-model="selectedRole" :options="roles" placeholder="Rolle" showClear @change="onInput()" />
                <PrimeInputGroup>
                    <PrimeInputText :type="inputPassword" v-model="password" placeholder="Passwort" @input="onInput()"/>
                    <PrimeButton :icon="iconPassword" severity="secondary" @click="togglePassword()" />
                </PrimeInputGroup>
                <PrimeInputGroup>
                    <PrimeInputText :type="inputPassword" v-model="passwordConfirm" placeholder="Passwort wiederholen" @input="onInput()"/>
                    <PrimeButton :icon="iconPassword" severity="secondary" @click="togglePassword()" />
                </PrimeInputGroup>
            </div>
            <div class="flex flex-column gap-2">
                <PrimeButton label="Hinzufügen" :disabled="isConfirmButtonDisabled" @click="confirm()" class="text-color"></PrimeButton>
                <PrimeButton label="Abbrechen" severity="danger" @click="cancel()" class="text-color" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
