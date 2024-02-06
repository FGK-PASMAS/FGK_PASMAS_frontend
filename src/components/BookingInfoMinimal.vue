<script setup lang="ts">
import PassengerInfoMinimal from "@/components/PassengerInfoMinimal.vue";
import { bookingStore } from '@/stores/booking';
import { ref } from 'vue';

const store = bookingStore();

const isOpen = ref(false);

function toggle(): void
{
    isOpen.value = !isOpen.value;
}
</script>

<template>
<div class="flex flex-column">

    <div class="flex justify-content-between align-items-center border-1 border-round border-primary surface-100 p-3 cursor-pointer" :class="{ 'border-noround-bottom': isOpen }" @click="toggle()">
        <div class="flex flex-wrap column-gap-8 row-gap-2 ">
            <div class="flex align-items-center gap-2">
                <i class="bi-airplane-fill text-xl" />
                <span>{{ store.division?.Name }}</span>
            </div>
            <div class="flex align-items-center gap-2">
                <i class="bi-people-fill text-xl" />
                <div class="flex gap-1">
                    <span>{{ store.passengers.length }}</span>
                    <span v-if="store.passengers.length === 1">Passagier</span>
                    <span v-else>Passagiere</span>
                    <span>{{ "(" + store.totalWeight + "kg)" }}</span>
                </div>
            </div>
        </div>
        <i :class="{'bi-chevron-down': !isOpen, 'bi-chevron-up': isOpen }" />
    </div>
    <Transition>
        <div v-if="isOpen" class="flex flex-column gap-2 border-1 border-top-none border-round-bottom border-primary surface-100 p-3 overflow-hidden">
            <PassengerInfoMinimal v-for="passenger in store.passengers" :key="passenger.ID" :passenger="passenger" />
        </div>
    </Transition>
</div>
</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
    transition: all 0.3s ease;
    line-height: 1.2;
}

.v-enter-from,
.v-leave-to {
    line-height: 0;
    opacity: 0;
    padding: 0 1rem !important;
}
</style>
