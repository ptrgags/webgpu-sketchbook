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
    TODO: Description
    </p>
    <p>
        <a href="${base_url}/figures/2026-02-10_ScrambledShapesMirrorCurve.pdf">Concept art of circle trajectories</a>
    </p>
