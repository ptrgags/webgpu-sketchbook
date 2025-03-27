<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
</script>

<template>
    <div class="one-column vertical">
        <h1>WebGPU Sketchbook</h1>
        <PageLink>
            <template #thumbnail>
                <img
                    src="@/assets/thumbnails/meltaway.png"
                    alt=""
                    width="250"
                    height="350"
                />
            </template>
            <template #link>
                <RouterLink to="/meltaway">Meltaway</RouterLink> (2025)
            </template>
        </PageLink>
        <PageLink>
            <template #thumbnail>
                <img
                    src="@/assets/thumbnails/sun-and-moon.png"
                    alt=""
                    width="250"
                    height="350"
                />
            </template>
            <template #link>
                <RouterLink to="/sun-and-moon">Sun And Moon</RouterLink> (2025)
            </template>
        </PageLink>
        <PageLink>
            <template #thumbnail>
                <img
                    src="@/assets/thumbnails/eyes.png"
                    alt=""
                    width="250"
                    height="350"
                />
            </template>
            <template #link>
                <RouterLink to="/eyes">Eyes</RouterLink> (2025)
            </template>
        </PageLink>
        
    </div>
</template>

<style scoped>
img {
  width: 250px;
  height: 350px;
}

.expand {
  width: 50%;
}
</style>