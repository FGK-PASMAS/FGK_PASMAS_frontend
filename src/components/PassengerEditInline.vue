<script setup lang="ts">
import { ref, type PropType } from "vue";
import { type Passenger } from "@/data/passenger/passenger.interface";

const passenger = ref<Passenger>({
    LastName: undefined,
    FirstName: undefined,
    Weight: undefined
});

// ToDo
/*
const passenger = defineModel("passenger", {
    type: Object as PropType<Passenger>,
    default: {
        LastName: undefined,
        FirstName: undefined,
        Weight: undefined
    }
});
*/

defineProps({
    seatNumber: {
        type: Number,
        required: true
    }
});

const emit = defineEmits([
    "passengerUpdated"
]);

// PrimeVue Bug... https://github.com/primefaces/primevue/issues/506
function onWeightChange(weight: number)
{
    passenger.value.Weight = weight;

    emit("passengerUpdated", passenger.value);
}

</script>

<template>
<div class="flex flex-column md:flex-row md:align-items-center gap-2">
    <span class="flex-shrink-0 w-full md:w-4rem">Sitz {{ seatNumber }}</span>
    <div class="flex flex-wrap gap-2">
        <PrimeInputText class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.LastName" type="text" placeholder="Nachname" @input="$emit('passengerUpdated', passenger)" />
        <PrimeInputText class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.FirstName" type="text" placeholder="Vorname" @input="$emit('passengerUpdated', passenger)" />
        <PrimeInputNumber class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.Weight" locale="de-DE" :maxFractionDigits="2" suffix="kg" placeholder="Gewicht" @input="onWeightChange($event.value)" />
    </div>
</div>
</template>

<style scoped lang="scss">
</style>
