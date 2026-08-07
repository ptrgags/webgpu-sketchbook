---
layout: webgpu-sketch
id: kebab-case-id
title: Title Case Title
years: YYYY-MM
sort_key: YYYY-MM:NN
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {TEMPLATESketch as Sketch} from "./TEMPLATESketch"
const machine = Sketch.make_machine();
</script>

<WebGPUCard :machine="machine" />

DESCRIPTION GOES HERE
