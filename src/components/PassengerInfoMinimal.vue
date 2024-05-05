<script setup lang="ts">
import type { Passenger } from '@/data/passenger/passenger.interface';
import { computed, type PropType } from 'vue';

const props = defineProps({
    passenger: {
        type: Object as PropType<Passenger>,
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    seatPayload: {
        type: Number
    }
});

const seatOverload = computed(() => {
    if (!props.seatPayload || props.seatPayload === -1 || !props.passenger.Weight) {
        return -1;
    }

    const seatOverload = props.passenger.Weight - props.seatPayload;

    if (seatOverload > 0) {
        return seatOverload;
    }

    return 0;
});
</script>

<template>
    <div class="flex align-items-center gap-2">
        <i class="bi-person-fill" />
        <div class="flex flex-wrap gap-1">
            <span v-if="passenger.PassNo">#{{ passenger.PassNo }}</span>
            <div v-if="passenger.LastName || passenger.FirstName" class="flex flex-wrap gap-1">
                <span v-if="passenger.LastName" class="word-break-all">{{ passenger.LastName }}</span>
                <span v-if="passenger.FirstName" class="word-break-all">{{ passenger.FirstName }}</span>
            </div>
            <span v-else>Passagier #{{ seatNumber }}</span>
            <span>({{ passenger.Weight }}kg)</span>
            <span v-if="seatOverload > 0" class="text-red-400">(+{{ seatOverload }}kg)</span>
            <i v-else-if="seatOverload !== -1" class="bi-check2 text-primary-400" />
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
