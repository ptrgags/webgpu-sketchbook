---
layout: webgpu-sketch
id: stripey-ring
title: Stripey Ring
years: 2025
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {StripeyRingSketch as Sketch} from "./StripeyRingSketch"
const machine = Sketch.make_machine();
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

Notes:

- What color scheme to use? the grey background is bland
- Do I want to add more shapes?
- User interaction - should the mouse move the ring? or move the circle? or something else?
