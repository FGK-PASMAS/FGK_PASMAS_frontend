<script setup lang="ts">
import { ref, type Ref } from 'vue';

const api = import.meta.env.VITE_API_URL;
const select: any = ref(null);
const selectedDivision: any = defineModel();
const divisions = ref([]);
const passengers: Ref<number[]> = ref([]);

async function fetchData()
{
    const url = api + "/division/";
    const response = await fetch(url);
    let test = await response.json();
    divisions.value = test.response;
}

function test()
{
    if (!selectedDivision.value) {
        return;
    }

    passengers.value = [];

    let length = selectedDivision.value.passengerCapacity;

    for (let index = 0; index < length; index++) {
        passengers.value.push(1);
    }
}

fetchData();

</script>

<template>
    <div>
        <div class="p-float-label">
            <PrimeDropdown v-model="selectedDivision" inputId="division-select" :options="divisions" showClear optionLabel="name" class="w-full md:w-14rem" ref="select" @change="test()" />
            <label for="dd-city">Flugtyp</label>
        </div>
        <PrimeButton @click="console.log(selectedDivision)">DEBUG ON CONSOLE</PrimeButton>
        <div>
            <h2>Passagiere adden</h2>
            <div v-for="n in passengers" :key="n">
                <PrimeInputText type="text" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
</style>
