---
layout: index
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { type SketchMetadata } from './core/SketchMetadata'
import PageLink from "./components/PageLink.vue"

import {data} from './sketches/sketches.data'

const SKETCHES: SketchMetadata[] = data.filter(x => !/TEMPLATE/.test(x.url)).map(x => {
    const frontmatter = x.frontmatter;

    const metadata: SketchMetadata = {
        id: frontmatter.id,
        title: frontmatter.title,
        years: frontmatter.years,
        is_lab: frontmatter.is_lab === undefined ? false : frontmatter.is_lab,
        sort_key: frontmatter.sort_key,
    }

    if (
        metadata.sort_key === undefined ||
        metadata.sort_key === "YYYY-MM:NN" ||
        metadata.id === "kebab-case-id" || 
        metadata.title === "Title Case Title" || 
        metadata.years === "YYYY-MM"
    ) {
        console.error(x.url, "is missing metadata", x.frontmatter)
    }

    return metadata;
})
SKETCHES.sort((a, b) => b.sort_key.localeCompare(a.sort_key))

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
