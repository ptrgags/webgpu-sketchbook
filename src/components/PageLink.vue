<script setup lang="ts">
import {computed} from 'vue'
import {type SketchMetadata} from '@/data/sketches';
const props = defineProps<{
  sketch: SketchMetadata
}>()

const base_url = import.meta.env.BASE_URL

const img_url = computed(() => {
  return `${base_url}/thumbnails/${props.sketch.id}.png`
})

const page_url = computed(() => {
  return `/sketch/${props.sketch.id}`
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
      <RouterLink :to="page_url">{{ title }}</RouterLink> ({{ props.sketch.years }})
    </div>
</template>

<style scoped>
.link {
  background-color: var(--color-background);
  padding: 10px;
  margin: 10px 0;
  width: 60%;
  max-width: 600px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 10px;
  gap: 10px;
}

.description {
  max-width: 50%;
}

.test-tube {
  font-size: 50px;
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