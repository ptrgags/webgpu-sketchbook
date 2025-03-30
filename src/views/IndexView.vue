<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
import {SKETCHES} from '@/data/sketches'
</script>

<template>
    <div class="one-column vertical">
        <h1>WebGPU Sketchbook</h1>
        <template v-for="sketch in SKETCHES" :key="sketch.id">
            <PageLink :sketch="sketch"></PageLink>
        </template>
    </div>
</template>

<style scoped>
img {
  width: 250px;
  height: 350px;
}

.expand {
  width: 50%;
}
</style>