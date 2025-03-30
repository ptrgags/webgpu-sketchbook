import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { find_sketch } from '@/data/sketches'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/sketch/:sketch_id',
      component: () => import('@/views/SketchView.vue'),
      beforeEnter: (to) => {
        const sketch_id = to.params.sketch_id
        const id = Array.isArray(sketch_id) ? sketch_id[0] : sketch_id
        if (!find_sketch(id)) {
          return { path: '/404' }
        }
      }
    },
    {
      path: '/404',
      component: NotFoundView
    }
  ]
})

export default router
