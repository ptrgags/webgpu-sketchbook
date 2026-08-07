---
layout: webgpu-sketch
id: boolean-color
title: Boolean Color
years: 2026-01
sort_key: 2026-01:00
is_lab: false
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {BooleanColorSketch as Sketch} from "./BooleanColorSketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" />

## Controls

**Cycle Palette A**: A + D-pad up/down (Gamepad), Z + up/down arrow (Keyboard), Click the top/bottom of left palette (Touchscreen)<br/>
**Cycle Palette B**: B + D-pad up/down (Gamepad), X + up/down arrow (Keyboard), Click the left/right of the top palette (Touchscreen)<br/>
**Select Boolean Operator**: X + D-pad up/down (Gamepad), A + up/down arrow (Keyboard), Click the left/right of the Venn Diagram (Touchscreen)<br/>
**Adjust Bit Depth**: Y + D-pad up/down (Gamepad), S + up/down arrow (Keyboard), Click the the left/right side of the bit visualization at the bottom (Touchscreen)

This sketch explores what happens when you take two colors and combine them with a bitwise logic operator (such as A AND B or A XOR B).
Some image editors (such as Krita) allow these operations as blend modes. The resulting color can be hard to predict, so I made this tool
to explore the results for various color combinations.
