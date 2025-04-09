<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { find_sketch, LAB_SKETCHES } from '@/data/sketches'
import WebGPUSketch from '@/components/WebGPUSketch.vue'
import ScreenshotButton from '@/components/ScreenshotButton.vue'

const route = useRoute()

const sketch_metadata = computed(() => {
  const sketch_id = route.params.sketch_id
  const id = Array.isArray(sketch_id) ? sketch_id[0] : sketch_id

  return find_sketch(id)
})

onBeforeRouteUpdate((to) => {
  const sketch_id = to.params.sketch_id
  const id = Array.isArray(sketch_id) ? sketch_id[0] : sketch_id
  if (!find_sketch(id)) {
    return { path: '/404' }
  }
  return to
})
</script>

<template>
  <div v-if="sketch_metadata" class="one-column vertical">
    <h1>{{ sketch_metadata.title }} <span v-if="LAB_SKETCHES.includes(sketch_metadata)">🧪</span> ({{ sketch_metadata.years }})</h1>
    <WebGPUSketch  :sketch_metadata="sketch_metadata"></WebGPUSketch>
    <div class="break"></div>
    <ScreenshotButton></ScreenshotButton>
    <div class="break"></div>
    <div class="description">
      <div v-html="sketch_metadata.description"></div>
    </div>
  </div>
</template>

<style scoped>
.break {
  width: 100%;
}

.description {
  max-width: 60%;
}

@media screen and (max-width: 400px)  {
.description {
  max-width: 80%;
}
}

</style>
