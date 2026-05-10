<template>
  <div class="admin-project-templates">
    <div class="admin-header">
      <h1>项目模板管理</h1>
      <button class="create-btn">新建模板</button>
    </div>
    <div class="header-actions">
      <button class="secondary-btn" @click="router.push('/admin')">Back Admin</button>
      <button class="secondary-btn" @click="router.push('/admin/roles')">Roles</button>
    </div>
    <div class="templates-table">
      <table>
        <thead>
          <tr>
            <th>模板名称</th>
            <th>描述</th>
            <th>里程碑数</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="template in templates" :key="template.id">
            <td>{{ template.name }}</td>
            <td>{{ template.description }}</td>
            <td>{{ template.milestones }}</td>
            <td>{{ template.createTime }}</td>
            <td>
              <button class="edit-btn">编辑</button>
              <button class="delete-btn">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const templates = ref([
  {
    id: 1,
    name: '需求迭代',
    description: '适用于产品需求迭代的项目模板',
    milestones: 5,
    createTime: '2026-04-01'
  },
  {
    id: 2,
    name: '技术重构',
    description: '适用于系统技术重构的项目模板',
    milestones: 4,
    createTime: '2026-04-01'
  },
  {
    id: 3,
    name: '线上故障',
    description: '适用于线上故障修复的项目模板',
    milestones: 3,
    createTime: '2026-04-01'
  }
])
</script>

<style scoped>
.admin-project-templates {
  padding: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.create-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.secondary-btn {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.secondary-btn:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.create-btn:hover {
  background-color: #66b1ff;
}

.templates-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

td {
  font-size: 14px;
  color: #666;
}

.edit-btn, .delete-btn {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-btn {
  background-color: #f5f7fa;
  color: #409eff;
}

.edit-btn:hover {
  background-color: #ecf5ff;
}

.delete-btn {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fbc4c4;
}

.delete-btn:hover {
  background-color: #fde2e2;
}
</style>
