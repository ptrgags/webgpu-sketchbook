import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import { SunAndMoonSketch } from '@/sketches/SunAndMoonSketch'
import { EyesSketch } from '@/sketches/EyesSketch'
import { RaymarchSketch } from '@/sketches/RaymarchSketch'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/sun-and-moon',
      component: () => import('@/views/QuadMachineView.vue'),
      props: {
        sketch: SunAndMoonSketch
      }
    },
    {
      path: '/eyes',
      component: () => import('@/views/QuadMachineView.vue'),
      props: {
        sketch: EyesSketch
      }
    },
    {
      path: '/raymarch',
      component: () => import('@/views/SphereTracerView.vue'),
      props: {
        sketch: RaymarchSketch
      }
    }
  ]
})

export default router
