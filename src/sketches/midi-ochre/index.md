---
layout: webgpu-sketch
id: midi-ochre
title: MIDI Ochre
years: 2026-08
sort_key: 2026-08:00
is_lab: false
head:
  - - meta
    - property: og:title
      content: MIDI Ochre | WebGPU Sketchbook
  - - meta
    - property: og:url
      content: 'https://ptrgags.dev/webgpu-sketchbook/midi-ochre/'
  - - meta
    - property: og:image
      content: '/webgpu-sketchbook/thumbnails/midi-ochre.png'
  - - meta
    - property: og:description
      content: 'A test of using MIDI in a WebGPU shader'
  - - meta
    - property: og:type
      content: 'article'
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
