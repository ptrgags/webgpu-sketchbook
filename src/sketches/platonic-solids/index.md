---
layout: webgpu-sketch
id: platonic-solids
title: Platonic Solids
years: 2026-06
sort_key: 2026-06:00
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {PlatonicSolidsSketch as Sketch} from "./PlatonicSolidsSketch"
const machine = Sketch.make_machine();
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

Controls:

- **Select Model**: D-pad left/right (Gamepad), left/right arrow (Keyboard), Click the left/right edge of canvas (Touchscreen/Mouse)<br/>

I wanted to add more shapes to the project, so I added the 5 platonic solids. You have the tetrahedron (4 sides), the cube (6 sides), the octahedron (8 sides), the dodecahedron (12 sides), and the icosahedron (12 sides).
