---
layout: webgpu-sketch
id: meltaway
title: Meltaway
years: 2025
is_lab: false
---

<script setup lang="ts">
import WebGPUCard from "../../components/WebGPUCard.vue"
import {MeltawaySketch as Sketch} from "./MeltawaySketch"
import {useData} from 'vitepress'

const machine = Sketch.make_machine();

const {site} = useData();
const figures_dir = `${site.value.base}/figures`
</script>

<div class="one-column vertical">
    <WebGPUCard :machine="machine" />
</div>

Touchscreen: Drag towards the left/right halves of the canvas to rotate the camera. <br/>
Mouse: Hover the mouse towards the left/right halves of the canvas to rotate the camera. <br/>
Keyboard: Left and right arrows to rotate the camera.

This was a refresher on sphere tracing (also known as
<a href="https://iquilezles.org/articles/raymarchingdf/">ray marching</a>).
Here I have several shapes nested inside each other. Each one has a separate
clipping arranged in a vertical stack. As they descend, the clipping planes
peel back one layer at a time.

<img width="250" height="350" class="figure" alt="animated diagram of the clipping planes" :src="`${figures_dir}/2025-04-07_MeltawaySchematic.gif`" />
    
I've been reading <cite>Artists' Master Series: Color and Light</cite> by
Charlie Pickard et al. about color theory. The section on matte (diffuse) 
lighting gives a rule of thumb for where to put the lights, midtones and 
darks on a sphere and other 3D shapes. This is what inspired the lighting 
scheme. It's quite similar to toon shading.
    
<img width="500" class="figure" alt="digital illustration of shading a sphere" :src="`${figures_dir}/2025-04-07_LightingASphereExplainer.png`" />
