<script setup lang="ts">
import type { PropType } from "vue";
import type { Passenger } from "@/data/passenger/passenger.interface";

defineProps({
    seatNumber: {
        type: Number,
        required: true
    },

    required: {
        default: {
            LastName: false,
            FirstName: false,
            Weight: false
        }
    }
});

const passenger = defineModel("passenger", {
    type: Object as PropType<Passenger>,
    default: {
        LastName: undefined,
        FirstName: undefined,
        Weight: undefined
    }
});

const emit = defineEmits([
    "passengerChanged"
]);

/**
 * Set weight of the passenger.
 * 
 * Weight has to be updated manually due to PrimeVue InputNumber not updating properly on @input. It only updates in the following cases:
 * * Clicking outside to validate the change after changing something in InputNumber
 * * Changing the value using spinner's button/arrow keys
 * * Pressing the 'enter' key
 * 
 * See: https://github.com/primefaces/primevue/issues/506
 * 
 * @param weight Weight of the passenger.
 */
function setWeight(weight: number) {
    passenger.value.Weight = weight;
    emit("passengerChanged");
}
</script>

<template>
<div class="flex flex-column md:flex-row md:align-items-center gap-2">
    <span class="flex-shrink-0 w-full md:w-4rem">Sitz {{ seatNumber }}</span>
    <div class="flex flex-wrap gap-2">
        <PrimeInputText class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.LastName" type="text" :placeholder="required.LastName ? 'Nachname*' : 'Nachname'" @input="$emit('passengerChanged')" />
        <PrimeInputText class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.FirstName" type="text" :placeholder="required.FirstName ? 'Vorname*' : 'Vorname'" @input="$emit('passengerChanged')" />
        <PrimeInputNumber class="flex-shrink-0 w-full md:w-20rem" v-model="passenger.Weight" locale="de-DE" :min="0" :maxFractionDigits="2" suffix="kg" :placeholder="required.Weight ? 'Gewicht*' : 'Gewicht'" @input="setWeight($event.value)" />
    </div>
</div>
</template>

<style scoped lang="scss">
</style>
