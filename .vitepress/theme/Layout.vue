<script setup lang="ts">
import NavbarHeader from './NavbarHeader.vue'

import { useData } from 'vitepress'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
  <NavbarHeader />
  <div class="main-column">
    <div>
      <h1 v-if="frontmatter.layout === 'webgpu-sketch'">
        <span v-if="frontmatter.is_lab === true">🧪</span>
        {{ frontmatter.title }} ({{ frontmatter.years }})
      </h1>
      <Content />
    </div>
  </div>
</template>

<style scoped>
.main-column {
  width: 80vw;
  max-width: 800px;
  margin: 0 auto;
}
</style>
