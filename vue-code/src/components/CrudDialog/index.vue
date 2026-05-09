<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-width="labelWidth"
    >
      <el-row :gutter="16">
        <el-col
          v-for="field in fields"
          :key="field.prop"
          :span="field.span || defaultSpan"
        >
          <el-form-item :label="field.label" :prop="field.prop">
            <!-- 文本输入 -->
            <el-input
              v-if="['ElInput'].includes(field.component) && field.type !== 'textarea'"
              v-model="formData[field.prop]"
              :type="field.type || 'text'"
              :readonly="field.readonly"
              :placeholder="`请输入${field.label}`"
              clearable
            />
            <!-- 文本域 -->
            <el-input
              v-else-if="field.component === 'ElInput' && field.type === 'textarea'"
              v-model="formData[field.prop]"
              type="textarea"
              :rows="4"
              :readonly="field.readonly"
              :placeholder="`请输入${field.label}`"
            />
            <!-- 数字输入 -->
            <el-input-number
              v-else-if="field.component === 'ElInputNumber'"
              v-model="formData[field.prop]"
              :readonly="field.readonly"
              style="width: 100%"
            />
            <!-- 开关 -->
            <el-switch
              v-else-if="field.component === 'ElSwitch'"
              v-model="formData[field.prop]"
              :disabled="field.readonly"
            />
            <!-- 下拉选择 -->
            <el-select
              v-else-if="field.component === 'ElSelect'"
              v-model="formData[field.prop]"
              :disabled="field.readonly"
              :placeholder="`请选择${field.label}`"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="opt in field.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="['ElDatePicker'].includes(field.component)"
              v-model="formData[field.prop]"
              v-bind="field.componentProps || {}"
              :disabled="field.readonly"
              :placeholder="`请选择${field.label}`"
              style="width: 100%"
            />
            <!-- 默认 -->
            <el-input v-else v-model="formData[field.prop]" :readonly="field.readonly" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { deepClone } from '@/utils'
import { FormFieldConfig } from '@/models/common/types'

const props = defineProps<{
  modelValue: boolean
  title?: string
  fields: FormFieldConfig[]
  rules?: FormRules
  initialData?: Record<string, any>
  width?: string
  labelWidth?: string
  cols?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'submit', data: Record<string, any>): void
}>()

const visible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const formData = reactive<Record<string, any>>({})
const submitting = ref(false)
const defaultSpan = props.cols ? Math.floor(24 / props.cols) : 12

watch(() => props.modelValue, (v) => {
  visible.value = v
})

watch(visible, (v) => {
  emit('update:modelValue', v)
  if (v) {
    nextTick(() => {
    })
  }
})

watch(() => props.initialData, (data) => {
  if (data) {
    const cloned = deepClone(data)
    Object.keys(formData).forEach(key => delete formData[key])
    Object.assign(formData, cloned)
  } else {
    Object.keys(formData).forEach(key => delete formData[key])
  }
}, { deep: true })

function handleClose() {
  visible.value = false
  formRef.value?.resetFields()
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  try {
    emit('submit', deepClone(formData))
  } finally {
    submitting.value = false
  }
}

defineExpose({ formData, submitting })
</script>
