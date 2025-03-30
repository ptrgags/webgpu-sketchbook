<script setup lang="ts">
import {download_screenshot} from '@/webgpu/screenshot'

function screenshot() {
    const canvas = document.getElementById('webgpu-canvas')
    if (canvas) {
        download_screenshot(canvas as HTMLCanvasElement, 'screenshot.png')
    }
}
</script>

<template>
    <button @click="screenshot">Screenshot</button>
</template>

<style scoped>
</style>