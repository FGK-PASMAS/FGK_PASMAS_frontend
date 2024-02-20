<script setup lang="ts">
const isOpen = defineModel("isOpen", {
    type: Boolean,
    default: true
});

defineProps({
    showCloseButton: {
        type: Boolean,
        default: true
    },
    isStrictClose: {
        type: Boolean,
        default: false
    }
});

function closeDialog()
{
    isOpen.value = false;
}
</script>

<template>
    <Transition>
        <div v-if="isOpen" class="shade z-4" @click="!isStrictClose && closeDialog()">
            <div class="dialog flex flex-column md:border-round surface-100 p-4 overflow-hidden" @click="$event.stopPropagation()">
                <div v-if="showCloseButton" class="flex justify-content-end mb-4">
                    <i class="bi-x-lg cursor-pointer" @click="closeDialog()" />
                </div>
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
        width: 60%;
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
