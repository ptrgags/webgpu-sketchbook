import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'src',
  base: '/webgpu-sketchbook/',
  title: 'WebGPU Sketchbook',
  description: 'Math Art Experiments in WebGPU',
  head: [
    ['link', { rel: 'icon', href: '/webgpu-sketchbook/favicon.ico' }],
    ['meta', { property: 'og:title', content: 'WebGPU Sketchbook' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://ptrgags.dev/webgpu-sketchbook/' }],
    [
      'meta',
      { property: 'og:image', content: '/webgpu-sketchbook/thumbnails/boolean-color-clock.png' }
    ],
    ['meta', { property: 'og:description', content: 'Math Art Experiments in WebGPU' }]
  ],
  rewrites: {
    'sketches/:sketch*': ':sketch*'
  },
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
