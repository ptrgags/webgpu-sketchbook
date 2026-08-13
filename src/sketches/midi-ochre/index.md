---
layout: webgpu-sketch
id: midi-ochre
title: MIDI Ochre
years: 2026-08
sort_key: 2026-08:00
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {MidiOchreSketch as Sketch} from "./MidiOchreSketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" :use_midi="true"/>

DESCRIPTION GOES HERE
