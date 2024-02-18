<script setup lang="ts">
import type { Passenger } from '@/data/passenger/passenger.interface';
import type { PropType } from 'vue';

defineProps({
    passenger: {
        type: Object as PropType<Passenger>,
        required: true
    },
    seat : {
        type: Number,
        required: true
    }
});
</script>

<template>
    <div class="flex align-items-center gap-2">
        <i class="bi-person-fill" />
        <div class="flex flex-wrap gap-1">
            <div v-if="passenger.LastName || passenger.FirstName" class="flex flex-wrap gap-1">
                <span v-if="passenger.LastName" class="word-break">{{ passenger.LastName }}</span>
                <span v-if="passenger.FirstName" class="word-break">{{ passenger.FirstName }}</span>
            </div>
            <span v-else>{{ "Passagier #" + seat }}</span>
            <span>{{ "(" + passenger.Weight + "kg)" }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.word-break {
    word-break: break-all;
}
</style>
