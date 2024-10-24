<template>
    <div class="app">
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
    const env = import.meta.env.VITE_ENV
    if (env === 'development') {
        // 配置切换代理
        const apiHost = localStorage.getItem('proxy')
        if (!apiHost) localStorage.setItem('proxy', '/api')

        proxyMonitoring()
        addEventListener()
    }
})

// 代理监控
const proxyMonitoring = () => {
    let lastProxy = localStorage.getItem('proxy') || '/api'

    watch(
        () => route.query.proxy,
        (newProxy: any) => {
            if (newProxy && !lastProxy.includes(newProxy)) {
                localStorage.setItem('proxy', '/' + newProxy)
                lastProxy = newProxy
                location.replace(window.location.href)
            }
        },
    )
}

// iframe 嵌套监控
const addEventListener = () => {
    if (window.top !== window.self) {
        // 页面被嵌套在 iframe 中
        const allowedOrigins = ['https://hjs.we5.fun/', 'http://localhost:13000/', 'http://192.168.11.246:13000/']
        const iframeOrigin = document.referrer
        if (!allowedOrigins.includes(iframeOrigin)) {
            alert('嵌入来源不允许')
            if (window.top) window.top.location = 'https://www.yingxiaoli.com' // 跳走
        }
    }
}
</script>

<style lang="scss" scoped></style>
