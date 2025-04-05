<script setup lang="ts">
import {onMounted, computed} from 'vue'
import { Engine } from '@/webgpu/Engine'
import {type SketchMetadata} from '@/data/sketches'

const props = defineProps<{
    sketch_metadata: SketchMetadata
}>()

const renderer = computed(() => {
    const machine = props.sketch_metadata.make_machine()
    return new Engine(machine);
})

onMounted(() => {
    renderer.value.main()
})
</script>

<template>
    <canvas id="webgpu-canvas" width="500" height="700"></canvas>
</template>

<style scoped>

canvas {
    max-width: 100vw;
    object-fit: contain;
}

</style>