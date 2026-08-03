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

<h3>Controls</h3>
    <p>
        <b>SelectModel</b>: D-pad left/right (Gamepad), left/right arrow (Keyboard), Click the left/right edge of canvas (Touchscreen/Mouse)<br/>
    </p>
    <p>
        I wanted to add more shapes to the project, so I added the 5 platonic solids. You have the tetrahedron (4 sides), the cube (6 sides), the octahedron (8 sides), the dodecahedron (12 sides), and the icosahedron (12 sides).
    </p>
