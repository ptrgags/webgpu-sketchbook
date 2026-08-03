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
      Touchscreen: Drag towards the left/right sides of the canvas to rotate the view. <br/>
      Mouse: Hover the mouse towards the left/right sides of the canvas to rotate the view. <br/>
      Keyboard: Press the Left and right arrows to rotate the view. <br/>
    </p>
    <p>Notes:</p>
    <ul>
      <li>
        This sketch is a visualization of the relatively new color space, 
        <a href="https://bottosson.github.io/posts/oklab/">OKLCH</a> 
        (OKay Lightness, Chroma, Hue)
      </li>
      <li>
        Point out details like how yellow is brightest and purple is darkest. 
        Also each slice through the center contains two opponent hues
      </li>
      <li>Link to the <a href="https://oklch.com/">oklch color picker</a></li>
      <li>See if <a href="https://iquilezles.org/articles/distance/">This article on distance estimation</a>
      could help carve the cylinder into the shape of the olkch color volume 
      without having the grey cylinder around it.</li>
      <li>Another thought would be to take a cube mesh with many subdivisions and warp it into the oklch volume</li>
    </ul>
