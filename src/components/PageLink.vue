<script setup lang="ts">
import type { SketchMetadata } from '../core/SketchMetadata'
import { computed } from 'vue'
const props = defineProps<{
  sketch: SketchMetadata
}>()

const base_url = import.meta.env.BASE_URL

const img_url = computed(() => {
  return `${base_url}/thumbnails/${props.sketch.id}.png`
})

const page_url = computed(() => {
  return `/webgpu-sketchbook/${props.sketch.id}/`
})

const title = computed(() => {
  if (props.sketch.is_lab) {
    return `WIP: ${props.sketch.title}`
  }

  return props.sketch.title
})
</script>

<template>
  <div class="link">
    <span class="test-tube" v-if="props.sketch.is_lab">🧪</span>
    <img v-else :src="img_url" alt="" width="250" height="350" />
    <span
      ><a :href="page_url">{{ title }}</a> ({{ props.sketch.years }})</span
    >
  </div>
</template>

<style scoped>
.link {
  background-color: var(--color-background);
  padding: 10px;
  margin: 10px auto;
  width: 75%;
  max-width: 600px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 10px;
  gap: 10px;
}

.test-tube {
  font-size: 50px;
}

@media screen and (max-width: 500px) {
  .link {
    /** Match the size of the image */
    width: 250px;
  }
}
</style>
