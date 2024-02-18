<script setup lang="ts">
const isOpen = defineModel("isOpen", {
    type: Boolean,
    default: true
});
</script>

<template>
    <Transition>
        <div v-if="isOpen" class="shade z-4">
            <div class="dialog md:border-round surface-100 p-4 overflow-hidden">
                <slot></slot>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
@import "primeflex/primeflex.scss";

.shade {    
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

@media screen and (min-width: $md) {
    .dialog {
        position: absolute;
        top: 10%;
        left: 50%;
        width: 50%;
        height: 80%;
        transform: translateX(-50%);
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
}

@media screen and (max-width: $md) {
    .dialog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(0);
    }

    .v-enter-active,
    .v-leave-active {
        transition: transform 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        transform: translateX(-100%);
    }
}
</style>
