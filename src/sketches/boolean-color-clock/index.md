---
layout: webgpu-sketch
id: boolean-color-clock
title: Boolean Color Clock
years: 2026-07
is_lab: false
---

<script setup lang="ts">
import WebGPUSketch from "../../components/WebGPUSketch.vue"
import {QuadMachine} from "../../machines/QuadMachine"
import {BooleanColorClockSketch} from "./BooleanColorClockSketch"

const sketch_metadata = {
    make_machine: () => new QuadMachine(new BooleanColorClockSketch())
}
</script>

# Boolean Color Clock (2026-07)

<div class="one-column vertical">
    <WebGPUSketch :sketch_metadata="sketch_metadata" />
</div>

This artistic clock is colored using Boolean Color
operations. The dial and the hands each get a gradient in different hues.
The colors are combined with bitwise exclusive or (XOR).
Loosely speaking, this highlights differences between the color values
in binary.

This clock was inspired by [this watch](https://www.amazon.com/dp/B0DS91C6MV)
I found on Amazon. It uses 2 translucent discs (one in red, one in
blue), plus a colored dial (yellow) that are overlaid to produce various
color gradients.
