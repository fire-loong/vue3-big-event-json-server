<script setup>
import { ref } from 'vue'
import { articleCatesRequest } from '@/api/article'

const cateList = ref([])
const getCateList = async () => {
  const res = await articleCatesRequest()
  cateList.value = res.data.data
}
getCateList()
const modelValue = defineModel()
</script>

<template>
  <el-select v-model="modelValue" placeholder="请选择">
    <el-option
      v-for="item in cateList"
      :key="item.id"
      :value="item.id"
      :label="item.cate_name"
    ></el-option>
  </el-select>
</template>
