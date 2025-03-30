<script setup lang="ts">
import {computed} from 'vue'
import {type SketchMetadata} from '@/data/sketches';
const props = defineProps<{
  sketch: SketchMetadata
}>()

const base_url = import.meta.env.BASE_URL

const img_url = computed(() => {
  return `${base_url}/src/assets/thumbnails/${props.sketch.id}.png`
})

const page_url = computed(() => {
  return `/sketch/${props.sketch.id}`
})

</script>

<template>
    <div class="link">
      <img :src="img_url" alt="" width="250" height="350" />
      <RouterLink :to="page_url">{{ props.sketch.title }}</RouterLink> ({{ props.sketch.years }})
    </div>
</template>

<style scoped>
.link {
  background-color: var(--color-background);
  padding: 10px;
  margin: 10px 0;
  width: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.description {
  max-width: 50%;
}

@media screen and (max-width: 500px) {
  .link {
    /** Match the size of the image */
    width: 250px;
  }

  .description {
    max-width: initial;
    width: 100%;
  }
}
</style>