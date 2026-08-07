---
layout: webgpu-sketch
id: srgb-cube
title: sRGB Cube
years: 2026-01
sort_key: 2026-01:01
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {SRGBCubeSketch as Sketch} from "./SRGBCubeSketch"
const machine = Sketch.make_machine();
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

For this sketch, I bit the bullet and set up a vertex shader
with a camera and (ortho) projection matrix. This is just an initial
test of that. I will likely replace this with a nicer sketch in the future.
