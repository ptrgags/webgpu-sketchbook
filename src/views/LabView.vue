<script setup lang="ts">
import {LAB_SKETCHES} from '@/data/sketches'
</script>

<template>
    <div class="one-column vertical">
        <h1>WebGPU Lab 🧪</h1>
        <div class="description">
        <p>
          My artworks-in-progress go here. This lets me share my work with friends with feedback sooner. Shaders may be incomplete compared to ones in the <RouterLink to="/">main gallery</RouterLink>. This list will change over time, so check back often!</p>
        </div>
        <div class="break"></div>
        <ul>
        <template v-for="sketch in LAB_SKETCHES" :key="sketch.id">
          <li><RouterLink :to="`/sketch/${sketch.id}`">{{ sketch.title }}</RouterLink></li>
        </template>
      </ul>
    </div>
</template>

<style scoped>

.one-column {
  width: 80%;
  margin: 0 auto;
}
</style>