export default {
  '/api': {
    target: 'http://192.168.11.111:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, '')
  },

  '/heibai': {
    target: 'http://192.168.11.111:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/heibai/, '')
  },

  '/shengfa': {
    target: 'http://192.168.11.243:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/shengfa/, '')
  },

  '/jinlong': {
    target: 'http://192.168.11.131:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/jinlong/, '')
  },

  '/dianqi': {
    target: 'http://192.168.11.246:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/dianqi/, '')
  },

  '/test': {
    target: 'http://192.168.11.124:3000/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/test/, '')
  },

  '/prod': {
    target: 'https://gmab-api.we5.fun/api',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/prod/, '')
  }
}
