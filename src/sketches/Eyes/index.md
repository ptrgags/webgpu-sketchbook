---
layout: webgpu-sketch
id: eyes
title: Eyes
years: 2024
sort_key: 2024-??:00
is_lab: false
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {EyesSketch as Sketch} from "./EyesSketch"
const machine = Sketch.make_machine();
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

**Touchscreen**: Drag around the canvas to direct the eyes. Touch to blink<br/>

**Mouse**: Move the cursor to direct the eyes. Click to blink. <br />
**Gamepad**: Left joystick or D-pad to move the eyes, A button to blink. <br/>
**Keyboard**: Arrows or WASD to move the eyes, Z key to blink.

This was a fun warm-up project when first setting up this repo. I was
experimenting with using multiple types of user input (mouse, gamepad,
keyboard) and passing the result as "signals" to the shader.
