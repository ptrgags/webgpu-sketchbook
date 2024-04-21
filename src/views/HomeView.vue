<script setup lang="ts">
import { QuadMachine } from '@/machines/QuadMachine'
import { EyesSketch } from '@/sketches/EyesSketch'
import { Renderer } from '@/webgpu/Renderer'
import { onMounted } from 'vue'

const sketch = new EyesSketch()
const machine = new QuadMachine(sketch)
const renderer = new Renderer(machine)
onMounted(() => {
  renderer.main()
})
</script>

<template>
  <main>
    <canvas id="webgpu-canvas" width="500" height="700"></canvas>
  </main>
</template>
