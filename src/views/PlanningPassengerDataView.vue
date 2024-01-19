<script setup lang="ts">
import { ref, type PropType, onBeforeMount } from "vue";
import { type Division } from "@/data/division/division.interface";
import { type Passenger } from "@/data/passenger/passenger.interface";
import { getDivisions } from "@/data/division/division.service";

const api = import.meta.env.VITE_API_URL;
const dropDown = ref(null);

const divisions = ref<Division[]>([]);
const passengers = ref<Passenger[]>([]);
const selectedDivision = defineModel({
    type: Object as PropType<Division>
});

onBeforeMount(async () => {
    divisions.value = await getDivisions();
});

function test()
{
    console.log("Dropdown Change!");
}

/*
async function fetchData()
{
    const url = api + "/division/";
    const response = await fetch(url);
    let test = await response.json();
    divisions.value = test.response;
}

function test()
{
    passengers.value = [];

    if (!selectedDivision.value) {
        return;
    }

    let length = selectedDivision.value.passengerCapacity;

    for (let index = 0; index < length; index++) {
        passengers.value.push(1);
    }
}

*/

</script>

<template>
    <div>
        <div class="p-float-label">
            <PrimeDropdown class="w-full md:w-14rem" ref="dropDown" v-model="selectedDivision" inputId="division-select" :options="divisions" showClear optionLabel="name" @change="test()" />
            <label for="dd-city">Flugtyp</label>
        </div>
        <!--
        <div>
            <h2>Passagiere adden</h2>
            <div v-for="passenger in passengers" :key="passenger.id">
                <PrimeInputText type="text" />
            </div>
        </div>
        -->
    </div>
</template>

<style scoped lang="scss">
</style>
