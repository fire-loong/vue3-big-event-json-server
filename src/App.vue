<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import { batchCreateArticles } from './utils/add'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView></RouterView>
    <!-- <button @click="batchCreateArticles(20)">执行脚本</button> -->
  </el-config-provider>
</template>

<style scoped></style>
