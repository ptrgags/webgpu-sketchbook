<script setup lang="ts">
import { QuadMachine } from '@/machines/QuadMachine'
//import { ComplexVoronoiSketch } from '@/sketches/ComplexVoronoiSketch'
import { EyesSketch } from '@/sketches/EyesSketch'
import { Engine } from '@/webgpu/Engine'
import { download_screenshot } from '@/webgpu/screenshot'
import { onMounted } from 'vue'

const sketch = new EyesSketch()
//const sketch = new ComplexVoronoiSketch()
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
  <main>
    <canvas id="webgpu-canvas" width="500" height="700"></canvas>
    <button @click="screenshot">Screenshot</button>
  </main>
</template>
