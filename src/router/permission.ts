// 路由鉴权
import router from './index'
import useBomParserStore from '@/store/bomParser'

enum xApiKey {
  HJS = 'lJWA1kv3RyM61Q8BmOkylB0Aaja9dNiQ'
}

// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
  const bomParserStore = useBomParserStore()
  const { path, query } = to
  let xapikey = ''
  if (query.apikey) xapikey = query.apikey as string
  if (path === '/hjsCrm') xapikey = xApiKey.HJS
  if (xapikey) bomParserStore.setXApiKey(xapikey)

  next()
})
