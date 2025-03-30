import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
//import { SunAndMoonSketch } from '@/sketches/SunAndMoonSketch'
//import { EyesSketch } from '@/sketches/EyesSketch'
//import { MeltawaySketch } from '@/sketches/MeltawaySketch'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/sketch/:sketch_id',
      component: () => import('@/views/SketchView.vue')
    }
    /*
    {
      path: '/eyes',
      component: () => import('@/views/QuadMachineView.vue'),
      props: {
        sketch: EyesSketch
      }
    },
    {
      path: '/meltaway',
      component: () => import('@/views/SphereTracerView.vue'),
      props: {
        sketch: MeltawaySketch
      }
    }
      */
  ]
})

export default router
