<template>
  <div>
    <CrudTable
      ref="tableRef"
      :columns="productTableColumns"
      :search-fields="productSearchFields"
      :api-fn="fetchList"
      @create="openDialog()"
      @edit="openDialog($event)"
      @delete="handleDelete"
    />

    <CrudDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="productFormFields"
      :rules="productFormRules"
      :initial-data="editRow"
      :cols="2"
      label-width="120px"
      width="720px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CrudTable from '@/components/CrudTable/index.vue'
import CrudDialog from '@/components/CrudDialog/index.vue'
import { productTableColumns, productSearchFields } from '@/models/shop/product/product.table'
import { productFormFields, productFormRules } from '@/models/shop/product/product.form'
import productApi from '@/models/shop/product/product.api'

const tableRef = ref()
const dialogVisible = ref(false)
const dialogTitle = ref('新建商品')
const editRow = ref<Record<string, any>>({})

async function fetchList(params: Record<string, any>) {
  return productApi.list(params)
}

function openDialog(row?: Record<string, any>) {
  editRow.value = row ? { ...row } : {}
  dialogTitle.value = row ? '编辑商品' : '新建商品'
  dialogVisible.value = true
}

async function handleSubmit(data: Record<string, any>) {
  if (data.id) {
    await productApi.update(data.id, data)
    ElMessage.success('更新成功')
  } else {
    await productApi.create(data)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  tableRef.value?.fetchData()
}

async function handleDelete(row: Record<string, any>) {
  await productApi.remove(row.id)
  ElMessage.success('删除成功')
  tableRef.value?.fetchData()
}
</script>
