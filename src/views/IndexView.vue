<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
</script>

<template>
    <div class="one-column vertical">
        <h1>WebGPU Sketchbook</h1>
        <p>lorem ipsum whatever</p>
        <PageLink>
            <template #thumbnail>
                <!--
                <img
                    src="@/assets/thumbnails/sun-and-moon.png"
                    alt=""
                />-->
            </template>
            <template #link>
                <RouterLink to="/sun-and-moon">Sun And Moon</RouterLink>
            </template>
            <template #description>Blah blah blah</template>
        </PageLink>
        <PageLink>
            <template #thumbnail>
                <!--
                <img
                    src="@/assets/thumbnails/sun-and-moon.png"
                    alt=""
                />-->
            </template>
            <template #link>
                <RouterLink to="/eyes">Eyes</RouterLink>
            </template>
            <template #description>Blah blah blah</template>
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