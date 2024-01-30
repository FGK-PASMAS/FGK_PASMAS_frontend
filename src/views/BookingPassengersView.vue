<script setup lang="ts">
import { ref, onBeforeMount, inject } from "vue";
import { bookingStore } from "@/stores/booking";
import type { Division } from "@/data/division/division.interface";
import { APIError } from "@/utils/errors/api.error";
import { getDivisions } from "@/data/division/division.service";
import PassengerEditInline from "@/components/PassengerEditInline.vue";
import { ErrorToast } from "@/utils/toasts/error.toast";
import { useToast } from "primevue/usetoast";

const bookingUpdated = inject<Function>("bookingUpdated");

const toast = useToast();

const dropDown = ref(null);

const store = bookingStore();
const divisions = ref<Division[]>([]);

onBeforeMount(async () => {
    /*const data = await getDivisions();

    if (data instanceof APIError) {
        toast.add(new ErrorToast({ summary: data.Type, detail: data.Message }));
        throw data;
    }

    divisions.value = data;*/
    divisions.value = await test(getDivisions());
});

// ToDo Move this to a composable
async function test(test: Promise<any>) {
    const data = await test;

    if (data instanceof APIError) {
        toast.add(new ErrorToast({ summary: data.Type, detail: data.Message }));
        throw data;
    }

    return data;
}

function initPassengers(): void
{
    store.seats = [];

    if (!store.division) {
        bookingUpdated!();
        return;
    }

    for (let i = 0; i < store.division.PassengerCapacity; i++) {
        store.seats.push({
            LastName: undefined,
            FirstName: undefined,
            Weight: undefined
        });
    }

    bookingUpdated!();
}
</script>

<template>
    <div class="flex flex-column gap-4">
        <div v-if="divisions.length > 0">
            <h4>Flugtyp auswählen</h4>
            <PrimeDropdown class="w-full md:w-20rem" ref="dropDown" v-model="store.division" :options="divisions" optionLabel="Name" placeholder="Flugtyp" showClear @change="initPassengers()" />
        </div>
        <div v-if="store.seats.length > 0">
            <h4 v-if="store.seats.length === 1">Passagier hinzufügen</h4>
            <h4 v-else>Passagiere hinzufügen</h4>
            <div class="flex flex-column gap-4">
                <PassengerEditInline v-for="i in store.division?.PassengerCapacity" :key="i" :seat-number="i" v-model:passenger="store.seats[i-1]" :required="{ LastName: false, FirstName: false, Weight: true }" @passenger-changed="bookingUpdated!()" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
