---
layout: webgpu-sketch
id: sun-and-moon
title: Sun and Moon
years: 2024-2025
sort_key: 2025-??:00
is_lab: false
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {SunAndMoonSketch as Sketch} from "./SunAndMoonSketch"
import {useData} from 'vitepress'

const machine = Sketch.make_machine();

const {site} = useData();
const figures_dir = `${site.value.base}figures`;
</script>

<WebGPUCard :machine="machine" />

This was an experiment that generalizes
<a href="https://en.wikipedia.org/wiki/Voronoi_diagram">Voronoi diagrams</a>.
Usually, a voronoi diagram is a map of "which point is the nearest
neighbor?". This gives a cellular pattern with sharp edges halfway
between the seed points.

<img width="500" class="figure" alt="voronoi diagram that points out the nearest neighbor properties" :src="`${figures_dir}/2025-04-07_VoronoiExplainer.png`" />
    
In shaders, it's commmon to use 
<a href="https://iquilezles.org/articles/distfunctions2d/">signed distance fields (SDFs)</a>
to get the minimum distance to a shape. Combining these concepts, the new
query is "which <em>shape</em> is the nearest neighbor?" This produces some
unusual shapes. Sometimes you get straight lines, but most of the time
you get a curved boundary.

<img width="600" class="figure" alt="graph of a ball next to a wall. In the gap between them, a curve separates points that are closer to the ball from points that are closer to the wall." :src="`${figures_dir}/2025-04-07_VoronoiSDFExplainer.png`" />

I wanted to pick shapes that interlock somewhat, so I chose a
stylistic sun and moon.
