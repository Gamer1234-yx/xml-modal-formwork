<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-body">
            <el-icon :style="{ color: item.color }" class="stat-icon">
              <component :is="item.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <span>框架说明</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="前端框架">Vue3 + TypeScript + Element Plus</el-descriptions-item>
            <el-descriptions-item label="后端框架">NestJS + TypeORM + class-validator</el-descriptions-item>
            <el-descriptions-item label="代码生成">XML Modal Framework</el-descriptions-item>
            <el-descriptions-item label="构建工具">Vite 5.x</el-descriptions-item>
            <el-descriptions-item label="XML定义目录">xml-modal/</el-descriptions-item>
            <el-descriptions-item label="生成命令">node modal-gen-control/src/cli.js --all</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Goods, Document, Setting } from '@element-plus/icons-vue'

const stats = [
  { title: '用户总数', value: '128', icon: 'User', color: '#409eff' },
  { title: '商品总数', value: '56', icon: 'Goods', color: '#67c23a' },
  { title: '模型定义', value: '2', icon: 'Document', color: '#e6a23c' },
  { title: '系统模块', value: '4', icon: 'Setting', color: '#f56c6c' },
]
</script>

<style lang="scss" scoped>
.dashboard { padding: 0; }
.stat-card {
  .stat-body {
    display: flex;
    align-items: center;
    gap: 16px;
    .stat-icon { font-size: 48px; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .stat-title { color: #999; margin-top: 4px; }
  }
}
</style>
