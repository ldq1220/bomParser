// 路由鉴权
import router from './index'
import useBomParserStore from '@/store/bomParser'

enum xApiKey {
  HJS = 'lJWA1kv3RyM61Q8BmOkylB0Aaja9dNiQ'
}

// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
  const bomParserStore = useBomParserStore()
  if (to.path === '/hjsCrm') bomParserStore.xApiKey = xApiKey.HJS

  next()
})
