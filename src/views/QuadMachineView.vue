<script setup lang="ts">
import { QuadMachine, type QuadMachineSketch } from '@/machines/QuadMachine'
import { Engine } from '@/webgpu/Engine'
import { onMounted } from 'vue'
import ScreenshotButton from '@/components/ScreenshotButton.vue'

interface SketchConstructor {
  new(): QuadMachineSketch
}

const props = defineProps<{
  sketch: SketchConstructor
}>()

const sketch = new props.sketch();
const machine = new QuadMachine(sketch)
const renderer = new Engine(machine)

onMounted(() => {
  renderer.main()
})
</script>

<template>
    <div class="one-column vertical">
      <canvas id="webgpu-canvas" width="500" height="700"></canvas>
      <ScreenshotButton></ScreenshotButton>
    </div>
</template>
