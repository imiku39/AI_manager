import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  // 新页面（自带 glassmorphism 布局）
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue')
  },
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('../views/Workbench.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/Notifications.vue')
  },
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('../views/admin/AdminHome.vue')
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/AdminUsers.vue')
  },
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: () => import('../views/admin/AdminRoles.vue')
  },
  {
    path: '/admin/project-templates',
    name: 'AdminProjectTemplates',
    component: () => import('../views/admin/AdminProjectTemplates.vue')
  },
  {
    path: '/admin/logs',
    name: 'AdminLogs',
    component: () => import('../views/admin/AdminLogs.vue')
  },
  {
    path: '/admin/system',
    name: 'AdminSystem',
    component: () => import('../views/admin/AdminSystem.vue')
  },
  // 项目详情（自带 glassmorphism 布局）
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('../views/ProjectDetail.vue')
  },
  {
    path: '/project/:id/:tab',
    name: 'ProjectDetailTab',
    component: () => import('../views/ProjectDetail.vue')
  },
  // 原有页面（使用 MainLayout）
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'task/:id',
        name: 'TaskDetail',
        meta: { routeLoader: true },
        component: () => import('../views/TaskDetail.vue')
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取当前角色
  const currentRole = localStorage.getItem('userRole') || 'super_admin'
  
  // 角色权限映射
  const rolePermissions = {
    super_admin: ['admin:access'],
    admin: ['admin:access'],
    pm: [],
    developer: [],
    qa: [],
    product: [],
    collaborator: []
  }
  
  // 检查是否需要权限访问
  if (to.path.startsWith('/admin')) {
    const hasAdminAccess = rolePermissions[currentRole]?.includes('admin:access')
    if (!hasAdminAccess) {
      // 无权限访问后台管理，重定向到全局工作台
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router
