<script setup lang="ts">
import { QuadMachine } from '@/machines/QuadMachine'
import { EyesSketch } from '@/sketches/EyesSketch'
import { Engine } from '@/webgpu/Engine'
import { onMounted } from 'vue'

const sketch = new EyesSketch()
const machine = new QuadMachine(sketch)
const renderer = new Engine(machine)

onMounted(() => {
  renderer.main()
})
</script>

<template>
  <main>
    <canvas id="webgpu-canvas" width="500" height="700"></canvas>
  </main>
</template>
