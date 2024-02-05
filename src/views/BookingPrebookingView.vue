<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getFlights } from "@/data/flight/flight.service";
import BookingInfoMinimal from "@/components/BookingInfoMinimal.vue";

const flights = ref<any>([]);

onMounted(async () => {
    flights.value = await getFlights({
        includePlane: "true"
    });

    console.log(flights.value);
});
</script>

<template>
    <div class="flex flex-column gap-4">
        <BookingInfoMinimal />
        <div>
            FLIGHTS HERE CMON
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
