<template>
  <div>
    <CrudTable
      ref="tableRef"
      :columns="ProductTableColumns"
      :search-fields="ProductSearchFields"
      :data="productData"
      @create="openDialog()"
      @edit="openDialog($event)"
      @delete="handleDelete"
      @query="handleSearch"
    />

    <CrudDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="ProductFormFields"
      :rules="ProductFormRules"
      :initial-data="editRow"
      :cols="2"
      label-width="120px"
      width="720px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import CrudTable from '@/components/CrudTable/index.vue'
import CrudDialog from '@/components/CrudDialog/index.vue'
import { ProductTableColumns, ProductSearchFields } from '@/models/shop/product/generated/product.table'
import { ProductFormFields, ProductFormRules } from '@/models/shop/product/generated/product.form'
import { useWsStore } from '@/stores'
import productApi from '@/models/shop/product/product.api'
import type { QueryParams } from '@/models/common/types'

const tableRef = ref()
const dialogVisible = ref(false)
const dialogTitle = ref('新建商品')
const editRow = ref<Record<string, any>>({})
const wsStore = useWsStore()

const productData = computed(() => wsStore.moduleData['shop/product']?.list || [])

function openDialog(row?: Record<string, any>) {
  editRow.value = row ? { ...row } : {}
  dialogTitle.value = row ? '编辑商品' : '新建商品'
  dialogVisible.value = true
}

async function handleSubmit(data: Record<string, any>) {
  if (data.id) {
    await productApi.update(data)
    ElMessage.success('更新成功')
  } else {
    await productApi.create(data)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
}

async function handleDelete(row: Record<string, any>) {
  await productApi.remove({id: row.id})
  ElMessage.success('删除成功')
}

function handleSearch(params: QueryParams) {
  wsStore.watch({ module: 'shop/product', params: {
    ...params.searchParams,
    page: params.pageInfo.page,
    pageSize: params.pageInfo.pageSize,
  } })
}

onMounted(() => {
  wsStore.watch({ module: 'shop/product', params: { page: 1, pageSize: 20 } })
})

onUnmounted(() => {
  wsStore.unwatch({ module: 'shop/product' })
})
</script>
