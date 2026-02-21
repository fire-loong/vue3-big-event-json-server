<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card style="max-width: 100%" class="page-container">
    <template #header>
      <div class="card-header">
        <!-- 父传子props拿title -->
        <span>{{ title }}</span>
        <!-- 具名插槽定制header右侧额外内容 -->
        <div class="extra"><slot name="extra"></slot></div>
      </div>
    </template>
    <!-- 默认插槽获取需要渲染的数据 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
