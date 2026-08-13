---
layout: webgpu-sketch
id: midi-ochre
title: MIDI Ochre
years: 2026-08
sort_key: 2026-08:00
is_lab: false
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {MidiOchreSketch as Sketch} from "./MidiOchreSketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" :use_midi="true"/>

🎹 This sketch requires a MIDI piano keyboard or other controller.

This sketch is a simple proof-of-concept for adding MIDI notes to the shader.
Press keys on your controller to highlight the corresponding pitches in the
shader.
