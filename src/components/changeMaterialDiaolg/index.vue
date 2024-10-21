<template>
  <el-dialog
    title="更换物料"
    v-model="visible"
    width="40%"
    :before-close="beforClose"
  >
    <span></span>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel("visible", { type: Boolean, default: false });

const beforClose = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped></style>
