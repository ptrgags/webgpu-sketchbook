<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
import {find_sketch} from '@/data/sketches'
import WebGPUSketch from '@/components/WebGPUSketch.vue'
import ScreenshotButton from '@/components/ScreenshotButton.vue'

const route = useRoute()

const sketch_metadata = computed(() => {
    return find_sketch(route.params.sketch_id)
})

onBeforeRouteUpdate((to) => {
    const sketch_id = to.params.sketch_id
    const id = Array.isArray(sketch_id) ? sketch_id[0] : sketch_id
    if (!find_sketch(id)) {
        return {path: "/404"}
    }
    return to
})
</script>

<template>
    <div class="vertical">
        <h1>{{ sketch_metadata.title }} ({{ sketch_metadata.years }})</h1>
        <WebGPUSketch :sketch_metadata="sketch_metadata"></WebGPUSketch>
        <div class="break"></div>
        <ScreenshotButton></ScreenshotButton>
        <div class="break"></div>
        <div v-html="sketch_metadata.description"></div>
    </div>
</template>

<style scoped>
.break {
    width:100%
}
</style>