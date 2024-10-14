<script setup lang="ts">
import { QuadMachine } from '@/machines/QuadMachine'
import { Engine } from '@/webgpu/Engine'
import { download_screenshot } from '@/webgpu/screenshot'
import { onMounted } from 'vue'

interface SketchConstructor {
  new(): QuadMachineSketch
}

const props = defineProps<{
  sketch: SketchConstructor
}>()

const sketch = new props.sketch();
const machine = new QuadMachine(sketch)
const renderer = new Engine(machine)

function screenshot() {
  const canvas = document.getElementById('webgpu-canvas')
  if (canvas) {
    download_screenshot(canvas as HTMLCanvasElement, 'screenshot.png')
  }
}

onMounted(() => {
  renderer.main()
})
</script>

<template>
    <div class="one-column vertical">
      <canvas id="webgpu-canvas" width="500" height="700"></canvas>
      <div>
        <button @click="screenshot">Screenshot</button>
      </div>
    </div>
</template>
