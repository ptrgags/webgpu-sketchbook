---
layout: webgpu-sketch
id: kebab-case-id
title: Title Case Title
years: YYYY-MM
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {TEMPLATESketch as Sketch} from "./TEMPLATESketch"
const machine = Sketch.make_machine();
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

<p>
      For this sketch, I bit the bullet and set up a vertex shader
      with a camera and (ortho) projection matrix. This is just an initial
      test of that. I will likely replace this with a nicer sketch in the future.
    </p>
