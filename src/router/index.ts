import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import { SunAndMoonSketch } from '@/sketches/SunAndMoonSketch'
import { EyesSketch } from '@/sketches/EyesSketch'
import { RaymarchSketch } from '@/sketches/RaymarchSketch'
import { ColorSpacesSketch } from '@/sketches/ColorSpacesSketch'

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
      component: () => import('@/views/QuadMachineView.vue'),
      props: {
        sketch: RaymarchSketch
      }
    },
    {
      path: '/color-spaces',
      component: () => import('@/views/QuadMachineView.vue'),
      props: {
        sketch: ColorSpacesSketch
      }
    }
  ]
})

export default router
