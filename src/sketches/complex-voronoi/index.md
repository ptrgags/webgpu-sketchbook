---
layout: webgpu-sketch
id: complex-voronoi
title: Complex Voronoi
years: 2024
sort_key: 2024-??:01
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {ComplexVoronoiSketch as Sketch} from "./ComplexVoronoiSketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" />

An earlier test of making a voronoi diagram not from seed points but
arbitrary seed SDFs. This eventually turned into [Sun and Moon](../sun-and-moon/)
