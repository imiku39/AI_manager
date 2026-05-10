<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="logo">
        <h2>AI 项目管理系统</h2>
      </div>
      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item" :class="{ active: isActive('/dashboard') }">
          <span class="nav-icon">📊</span>
          <span class="nav-text">全局工作台</span>
        </router-link>
        <router-link to="/projects" class="nav-item" :class="{ active: isActive('/projects') || isActive('/project/') }">
          <span class="nav-icon">📁</span>
          <span class="nav-text">项目列表</span>
        </router-link>
        <router-link to="/workbench" class="nav-item" :class="{ active: isActive('/workbench') }">
          <span class="nav-icon">💼</span>
          <span class="nav-text">个人工作台</span>
        </router-link>
        <router-link to="/reports" class="nav-item" :class="{ active: isActive('/reports') }">
          <span class="nav-icon">📈</span>
          <span class="nav-text">项目报表</span>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: isActive('/settings') }">
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">系统设置</span>
        </router-link>
      </nav>
      <div v-if="canAccessAdmin" class="nav-divider"></div>
      <nav v-if="canAccessAdmin" class="nav-menu">
        <div class="nav-label">后台管理</div>
        <router-link to="/admin" class="nav-item" :class="{ active: isActive('/admin') }">
          <span class="nav-icon">🔧</span>
          <span class="nav-text">后台首页</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" :class="{ active: isActive('/admin/users') }">
          <span class="nav-icon">👥</span>
          <span class="nav-text">用户管理</span>
        </router-link>
        <router-link to="/admin/roles" class="nav-item" :class="{ active: isActive('/admin/roles') }">
          <span class="nav-icon">🎭</span>
          <span class="nav-text">角色管理</span>
        </router-link>
        <router-link to="/admin/project-templates" class="nav-item" :class="{ active: isActive('/admin/project-templates') }">
          <span class="nav-icon">📋</span>
          <span class="nav-text">项目模板</span>
        </router-link>
        <router-link to="/admin/logs" class="nav-item" :class="{ active: isActive('/admin/logs') }">
          <span class="nav-icon">📝</span>
          <span class="nav-text">审计日志</span>
        </router-link>
        <router-link to="/admin/system" class="nav-item" :class="{ active: isActive('/admin/system') }">
          <span class="nav-icon">⚡</span>
          <span class="nav-text">系统配置</span>
        </router-link>
      </nav>
    </aside>
    <div class="main-content">
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">☰</button>
          <div class="breadcrumb">{{ currentPageTitle }}</div>
        </div>
        <div class="header-right">
          <button class="header-btn notification-btn" :class="{ active: showNotification }" @click="toggleNotification">🔔 <span class="badge">3</span></button>
          <UserProfileHoverCard :user="currentUser" />
          <select v-model="currentRole" @change="setRole(currentRole)" class="role-select">
            <option value="super_admin">超级管理员</option>
            <option value="admin">系统管理员</option>
            <option value="pm">项目经理</option>
            <option value="developer">开发工程师</option>
            <option value="qa">测试人员</option>
            <option value="product">产品经理</option>
            <option value="collaborator">协作者</option>
          </select>
        </div>
      </header>
      <main class="page-content">
        <router-view />
      </main>
    </div>
    <!-- AI 助手 -->
    <AIAssistant />
    <!-- 通知弹窗 -->
    <div class="notification-popup" v-if="showNotification" @click.stop>
      <div class="notification-header">
        <h3>通知</h3>
        <button class="close-btn" @click="showNotification = false">×</button>
      </div>
      <div class="notification-list">
        <div class="notification-item" v-for="notification in notifications" :key="notification.id">
          <p>{{ notification.content }}</p>
          <p class="notification-time">{{ notification.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AIAssistant from '../components/ai/AIAssistant.vue'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'
import usePermission from '../composables/usePermission'

const router = useRouter()
const route = useRoute()
const { currentRole, setRole, hasPermission, isAnyRole } = usePermission()

const currentUser = {
  name: '张三',
  role: '超级管理员',
  avatar: ''
}

const showNotification = ref(false)
const notifications = ref([
  { id: 1, content: '任务 "完成登录页面开发" 已分配给您', time: '2026-04-25 10:00' },
  { id: 2, content: '项目 "AI项目管理系统" 进度更新', time: '2026-04-24 15:30' },
  { id: 3, content: '您有新的系统通知', time: '2026-04-24 10:00' }
])

const toggleNotification = () => {
  showNotification.value = !showNotification.value
}

// 监听角色变化，更新权限
watch(currentRole, (newRole) => {
  console.log('角色已切换为:', newRole)
  // 可以在这里添加角色切换后的逻辑，例如重新加载路由或刷新页面
  // 为了演示效果，我们可以重新导航到当前页面
  router.replace(route.path)
})

const isActive = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/'
  }
  if (path === '/projects') {
    return route.path === '/projects' || route.path.startsWith('/project/')
  }
  return route.path.startsWith(path)
}

const currentPageTitle = computed(() => {
  const routeMap = {
    '/dashboard': '全局工作台',
    '/projects': '项目列表',
    '/project/': '项目详情',
    '/workbench': '个人工作台',
    '/reports': '项目报表',
    '/settings': '系统设置',
    '/admin': '后台管理',
    '/admin/users': '用户管理',
    '/admin/roles': '角色管理',
    '/admin/project-templates': '项目模板管理',
    '/admin/logs': '审计日志',
    '/admin/system': '系统配置'
  }

  for (const [path, title] of Object.entries(routeMap)) {
    if (route.path.startsWith(path)) {
      return title
    }
  }
  return ''
})

const toggleSidebar = () => {
  document.querySelector('.sidebar').classList.toggle('collapsed')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  router.push('/login')
}

// 检查是否有权限访问后台管理
const canAccessAdmin = computed(() => {
  return hasPermission('admin:access')
})
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: #304156;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #3d4a5c;
}

.logo h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .logo h2 {
  font-size: 14px;
  text-align: center;
}

.nav-menu {
  padding: 10px 0;
}

.nav-label {
  padding: 10px 20px;
  font-size: 12px;
  color: #7f8c9a;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #bfcbd9;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #3d4a5c;
  color: white;
}

.nav-item.active {
  background-color: #409eff;
  color: white;
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  white-space: nowrap;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-divider {
  height: 1px;
  background-color: #3d4a5c;
  margin: 10px 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.breadcrumb {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #f56c6c;
  color: white;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.role-select {
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
}

.logout-btn {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #e4e7ed;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.notification-btn {
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.notification-btn:hover {
  background-color: #f0f2f5;
  transform: scale(1.05);
}

.notification-btn:active {
  transform: scale(0.95);
  background-color: #e4e7ed;
}

.notification-btn.active {
  background-color: #ecf5ff;
}

.notification-popup {
  position: fixed;
  top: 60px;
  right: 80px;
  width: 360px;
  max-height: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.notification-header .close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.notification-header .close-btn:hover {
  color: #333;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.notification-item {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.notification-item:last-child {
  margin-bottom: 0;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item p {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-item .notification-time {
  font-size: 12px;
  color: #999;
}
</style>