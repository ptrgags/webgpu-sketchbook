---
layout: index
---

<script setup>
import { useData } from 'vitepress'
import {SKETCHES} from './data/sketches'
import PageLink from "./components/PageLink.vue"

const { site, theme, page, frontmatter } = useData()
</script>

# WebGPU Sketchbook

A collection of shader art experiments for graphics cards using
[WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).
This is a relatively new browser feature, so not every browser will support it.
For best results, use Chrome or Edge.

Work-in-progress shaders are marked with a 🧪, as they are still "in the lab".

See also [P5 Sketchbook](https://ptrgags.dev/p5-sketchbook/) for more of my math art.

## Sketches

<div class="break"></div>

<template v-for="sketch of SKETCHES">
    <PageLink :sketch="sketch"/>
</template>
