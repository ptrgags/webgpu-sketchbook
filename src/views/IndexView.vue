<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
import {GALLERY_SKETCHES} from '@/data/sketches'
</script>

<template>
    <div class="one-column vertical">
        <h1>WebGPU Sketchbook</h1>
        <div class="description">
        <p>
          A collection of shader art experiments for graphics cards using
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API">WebGPU</a>. 
          This is a relatively new browser feature, so not every browser will support it. 
          For best results, use Chrome or Edge. It will not work in Firefox.</p>
          <p>To see my work-in-progress shaders, see <RouterLink to="/lab">the lab 🧪</RouterLink></p>
        <p>See also <a href="https://ptrgags.dev/p5-sketchbook/">P5 Sketchbook</a> for more of my math art.</p>
        </div>
        <div class="break"></div>
        <template v-for="sketch in GALLERY_SKETCHES" :key="sketch.id">
            <PageLink :sketch="sketch"></PageLink>
        </template>
    </div>
</template>

<style scoped>

img {
  width: 250px;
  height: 350px;
}

.description {
  width: 50%;
}

.break {
  width: 100%;
  height: 0;
}

.one-column {
  width: 80%;
  margin: 0 auto;
}
</style>