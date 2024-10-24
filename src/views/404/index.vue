<template>
  <div class="code">
    <div class="code_text flex_center">
      <p>404</p>
      <el-button type="primary" @click="goHome">回到首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.code {
  width: 100vw;
  height: 100vh;
  position: relative;
  .code_text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;

    p {
      font-size: 148px;
      font-weight: bold;
      margin-bottom: 20px;
      color: $base-theme-color;
      background: linear-gradient(to bottom, white, black);
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
    }
  }
}
</style>
