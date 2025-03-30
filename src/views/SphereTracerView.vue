<script setup lang="ts">
import { type SphereTracerSketch, SphereTracerMachine} from "@/machines/SphereTracerMachine"
import { Engine } from '@/webgpu/Engine'
import { onMounted } from 'vue'
import ScreenshotButton from '@/components/ScreenshotButton.vue'

interface SketchConstructor {
  new(): SphereTracerSketch
}

const props = defineProps<{
  sketch: SketchConstructor,
}>()

const sketch = new props.sketch();
const machine = new SphereTracerMachine(sketch)
const renderer = new Engine(machine)

onMounted(() => {
  renderer.main()
})
</script>

<template>
    <div class="one-column vertical">
      <canvas id="webgpu-canvas" width="500" height="700"></canvas>
      <ScreenshotButton></ScreenshotButton>
      <div v-html="sketch_metadata.description"></div>
    </div>
</template>
