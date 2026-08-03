<script setup lang="ts">
import NavbarHeader from './NavbarHeader.vue'

import { useData } from 'vitepress'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
  <NavbarHeader />
  <div class="one-column vertical">
    <h1 v-if="frontmatter.layout === 'webgpu-sketch'">
      <span v-if="frontmatter.is_lab === true">🧪</span>
      {{ frontmatter.title }} ({{ frontmatter.years }})
    </h1>

    <Content />
  </div>
</template>

<style scoped>
.one-column {
  width: 80%;
  margin: 0 auto;
}
</style>
