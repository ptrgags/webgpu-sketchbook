<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {SKETCHES} from '@/data/sketches'
import WebGPUSketch from '@/components/WebGPUSketch.vue'

const route = useRoute()

const sketch_metadata = computed(() => {
    const metadata = SKETCHES.find(x => x.id === route.params.sketch_id);
    if (!metadata) {
        this.$router.push('/404')
    }

    return metadata
})
</script>

<template>
    <div class="vertical">
        <h1>{{ sketch_metadata.title }} ({{ sketch_metadata.years }})</h1>
        <WebGPUSketch :sketch_metadata="sketch_metadata"></WebGPUSketch>
    </div>
</template>