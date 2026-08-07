---
layout: webgpu-sketch
id: oklch-visualizer
title: OKLCH Visualizer
years: 2025
sort_key: 2025-??:02
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {OklchVisualizerSketch as Sketch} from "./OklchVisualizerSketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" />

Touchscreen: Drag towards the left/right sides of the canvas to rotate the view. <br/>
Mouse: Hover the mouse towards the left/right sides of the canvas to rotate the view. <br/>
Keyboard: Press the Left and right arrows to rotate the view. <br/>

Notes:

- This sketch is a visualization of the relatively new color space, [OKLCH](https://bottosson.github.io/posts/oklab/) (OKay Lightness, Chroma, Hue)
- Point out details like how yellow is brightest and purple is darkest. Also each slice through the center contains two opponent hues
- Link to the [OKLCH color picker](https://oklch.com/)
- See if [This article by `iq` on distance estimation](https://iquilezles.org/articles/distance/)
  could help carve the cylinder into the shape of the olkch color volume
  without having the grey cylinder around it.
- Another thought would be to take a cube mesh with many subdivisions and warp it into the oklch volume
