// 路由鉴权
import router from './index'

// 全局前置守卫
router.beforeEach(async (_to, _from, next) => {
    next()
})
