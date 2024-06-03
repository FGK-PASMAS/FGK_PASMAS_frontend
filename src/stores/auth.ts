import { useValidateAPIData } from "@/core/composables/useValidateAPIData";
import { fetchAuth } from "@/core/services/fetch.service";
import { Role, type User } from "@/data/user/user.interface";
import useJwt from "jwt-decode";
import { defineStore } from "pinia";
import type { ToastServiceMethods } from "primevue/toastservice";
import { computed, ref } from "vue";

export const authStore = defineStore("auth", () => {    
    const token = ref();
    const isAuthenticated = ref(true);

    const user = computed((): User | null => {
        let user: User | null = null;

        if (!isAuthenticated.value) {
            return user;
        }

        token.value = localStorage.getItem("auth");

        if (!token.value) {
            return user;
        }

        try {
            user = useJwt(token.value!);
        } catch (error) {
            revoke();
        }

        return user;
    });

    const isAdmin = computed((): boolean => {
        if (user.value?.Role === Role.ADMIN) {
            return true;
        }

        return false;
    });

    const isVendor = computed((): boolean => {
        if (user.value?.Role === Role.ADMIN) {
            return true;
        }

        if (user.value?.Role === Role.VENDOR) {
            return true;
        }

        return false;
    });

    function init(): void
    {
        if (!user.value) {
            isAuthenticated.value = false;
        }
    }

    async function authenticate(username: String, password: String, toast: ToastServiceMethods): Promise<boolean>
    {
        const response = await useValidateAPIData(fetchAuth(username, password), toast);

        if(!response) {
            return false;
        }

        token.value = localStorage.getItem("auth");
        isAuthenticated.value = true;

        return true;
    }

    function revoke(): void
    {
        localStorage.removeItem("auth");

        token.value = undefined;
        isAuthenticated.value = false;
    }

    return { isAuthenticated, user, isAdmin, isVendor, init, authenticate, revoke }
});
