<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            |
            <a href="https://github.com/ptrgags/webgpu-sketchbook">GitHub</a>
        </nav>
    </header>
</template>

<style scoped>
nav {
    background-color: var(--color-background-light);
    padding: 10px;
}
</style>