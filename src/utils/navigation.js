const LEGACY_ROUTE_MAP = {
  'dashboard.html': '/dashboard',
  'projects.html': '/projects',
  'workbench.html': '/workbench',
  'reports.html': '/reports',
  'settings.html': '/settings',
  'notifications.html': '/notifications',
  'admin.html': '/admin',
  'admin-users.html': '/admin/users',
  'admin-roles.html': '/admin/roles',
  'admin-project-templates.html': '/admin/project-templates',
  'admin-logs.html': '/admin/logs',
  'admin-system.html': '/admin/system',
  'login.html': '/login',
  'register.html': '/register'
}

const normalizeLegacyKey = (path = '') => {
  return path.trim().replace(/^\.\//, '').replace(/^\//, '')
}

export const resolveAppPath = (path = '/dashboard') => {
  if (!path) {
    return '/dashboard'
  }

  if (path.startsWith('/')) {
    return path
  }

  const legacyKey = normalizeLegacyKey(path)
  return LEGACY_ROUTE_MAP[legacyKey] || path
}

export const pushAppPath = (router, path) => {
  return router.push(resolveAppPath(path))
}
