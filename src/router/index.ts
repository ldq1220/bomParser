import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute, asnycRoute } from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes: [...constantRoute, ...asnycRoute],
    scrollBehavior() {
        return {
            top: 0,
        }
    },
})

export default router
