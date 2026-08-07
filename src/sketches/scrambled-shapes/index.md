---
layout: webgpu-sketch
id: scrambled-shapes
title: Scrambled Shapes
years: 2026-02
sort_key: 2026-02:00
is_lab: true
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {ScrambledShapesSketch as Sketch} from "./ScrambledShapesSketch"
import {useData} from 'vitepress'
const machine = Sketch.make_machine();

const {site} = useData();
const figures_dir = `${site.value.base}/figures`;
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

TODO: Description

<a :href="`${figures_dir}/2026-02-10_ScrambledShapesMirrorCurve.pdf`">Concept art of circle trajectories</a>
