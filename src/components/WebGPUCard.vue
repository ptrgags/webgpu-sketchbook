<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Engine, type Machine } from '../webgpu/Engine'

const props = defineProps<{
  machine: Machine
}>()

const renderer = computed(() => {
  return new Engine(props.machine)
})

onMounted(() => {
  renderer.value.main()
})
</script>

<template>
  <div class="vertical">
    <canvas id="webgpu-canvas" width="500" height="700"></canvas>
  </div>
</template>

<style scoped>
canvas {
  max-width: 80vw;
  object-fit: contain;
  margin: 0 auto;
}
</style>
