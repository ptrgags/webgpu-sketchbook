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

<p>Notes</p>
    <ul>
      <li>What color scheme to use? the grey background is bland</li>
      <li>Do I want to add more shapes?</li>
      <li>User interaction - should the mouse move the ring? or move the circle? or something else?</li>
    </ul>
