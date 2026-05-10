<template>
  <!-- 来源页面：admin-logs.html -->
  <div class="admin-logs-page">
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="brand-box">
          <div class="brand-icon">
            <span class="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <h1 class="brand-title">Admin Console</h1>
            <p class="brand-subtitle">系统管理入口</p>
          </div>
        </div>

        <!-- TODO: 对接后台导出日志接口 -->
        <button
          class="sidebar-primary-cta"
          type="button"
          :disabled="isExporting"
          :aria-busy="isExporting ? 'true' : 'false'"
          @click="handleExportLogs"
        >
          <span class="material-symbols-outlined">download</span>
          导出日志
        </button>

        <!-- TODO: 接入 Vue Router 后统一替换为 RouterLink 或 router.push -->
        <nav class="sidebar-nav" style="margin-top: 20px;">
          <a
            v-for="item in sidebarNavItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: item.active }"
            href="#"
            @click.prevent="handleNavigate(item.path)"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-bottom">
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>返回主系统</span>
          </a>
        </div>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">审计日志</h2>
            <div class="topbar-breadcrumb">
              <span>后台管理</span>
              <span>/</span>
              <span>审计日志</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- TODO: 对接全局搜索能力，当前保留输入态 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="topbarKeyword"
              type="text"
              placeholder="搜索审计日志、操作者或动作..."
            />
          </label>

          <!-- TODO: 对接通知中心路由或通知抽屉 -->
          <a
            class="icon-btn notification-link"
            href="#"
            aria-label="打开通知中心"
            @click.prevent="handleOpenNotifications"
          >
            <span class="material-symbols-outlined">notifications</span>
            <span class="notification-badge">5</span>
          </a>

          <!-- TODO: 对接应用切换器 -->
          <button class="icon-btn" type="button" @click="handleOpenAppSwitcher">
            <span class="material-symbols-outlined">apps</span>
          </button>

          <!-- TODO: 对接全局 AI 助手抽屉 -->
          <button class="icon-btn" type="button" data-ai-toggle @click="handleOpenAiDrawer">
            <span class="material-symbols-outlined">auto_awesome</span>
          </button>

          <!-- TODO: 对接当前登录用户信息 -->
          <UserProfileHoverCard :user="currentUser" />
        </div>
      </header>

      <main class="app-content">
        <div class="page-stack">
          <div class="page-header">
            <div>
              <h1 class="page-title">审计日志</h1>
              <p class="page-subtitle">
                操作日志页维持高可读性表格风格，用于检查敏感操作、删除记录和系统改动。
              </p>
            </div>
          </div>

          <section class="admin-table-card glass-panel">
            <div class="admin-toolbar">
              <!-- TODO: 对接日志关键词检索接口；当前保留本地筛选，便于静态联调 -->
              <label class="search-shell">
                <span class="material-symbols-outlined">search</span>
                <input
                  v-model="tableKeyword"
                  type="text"
                  placeholder="搜索操作者、对象、动作..."
                />
              </label>

              <!-- TODO: 对接操作类型枚举或服务端筛选参数 -->
              <div class="table-chip-group">
                <button
                  v-for="option in filterOptions"
                  :key="option.value"
                  class="btn-chip"
                  :class="{ active: activeFilter === option.value }"
                  type="button"
                  @click="setFilter(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>操作者</th>
                  <th>动作</th>
                  <th>对象</th>
                  <th>结果</th>
                </tr>
              </thead>
              <tbody>
                <!-- TODO: 对接审计日志列表接口，字段结构建议与当前 mock 保持一致 -->
                <tr v-for="log in filteredLogs" :key="log.id" :data-action="log.type">
                  <td>{{ log.time }}</td>
                  <td>{{ log.operator }}</td>
                  <td>{{ log.action }}</td>
                  <td>{{ log.target }}</td>
                  <td>
                    <span class="pill" :class="log.resultClass">{{ log.result }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { pushAppPath } from "../../utils/navigation";
import UserProfileHoverCard from "../../components/topbar/UserProfileHoverCard.vue";

const router = useRouter();

defineOptions({
  name: "AdminLogsPage",
});

const props = defineProps({
  exportEndpoint: {
    type: String,
    default: "/api/admin/logs/export",
  },
});

const emit = defineEmits([
  "navigate",
  "export-logs",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
]);

const instance = getCurrentInstance();
const topbarKeyword = ref("");
const tableKeyword = ref("");
const activeFilter = ref("all");
const isExporting = ref(false);

const currentUser = {
  name: "系统管理员",
  role: "平台角色：Admin",
  avatar: "https://i.pravatar.cc/80?img=5",
};

const sidebarNavItems = [
  { label: "管理首页", icon: "grid_view", path: "/admin", active: false },
  { label: "用户管理", icon: "group", path: "/admin/users", active: false },
  { label: "角色管理", icon: "badge", path: "/admin/roles", active: false },
  { label: "审计日志", icon: "receipt_long", path: "/admin/logs", active: true },
  { label: "系统配置", icon: "settings", path: "/admin/system", active: false },
];

const filterOptions = [
  { label: "全部动作", value: "all" },
  { label: "删除", value: "delete" },
  { label: "配置", value: "config" },
];

// TODO: 对接审计日志列表接口后，将该 mock 数据替换为接口返回。
const auditLogs = ref([
  {
    id: "log-20260426-1043",
    time: "2026-04-26 10:43",
    operator: "系统管理员",
    action: "删除模板",
    target: "临时排障模板",
    result: "成功",
    resultClass: "pill-success",
    type: "delete",
  },
  {
    id: "log-20260426-0928",
    time: "2026-04-26 09:28",
    operator: "王志强",
    action: "更新权限",
    target: "项目归档恢复",
    result: "成功",
    resultClass: "pill-success",
    type: "config",
  },
  {
    id: "log-20260426-0915",
    time: "2026-04-26 09:15",
    operator: "张工",
    action: "修改配置",
    target: "系统参数",
    result: "失败",
    resultClass: "pill-danger",
    type: "config",
  },
  {
    id: "log-20260425-1811",
    time: "2026-04-25 18:11",
    operator: "李工",
    action: "导出报表",
    target: "全局效率周报",
    result: "成功",
    resultClass: "pill-success",
    type: "other",
  },
  {
    id: "log-20260425-1630",
    time: "2026-04-25 16:30",
    operator: "测试员",
    action: "登录系统",
    target: "后台管理",
    result: "失败",
    resultClass: "pill-danger",
    type: "other",
  },
]);

const filteredLogs = computed(() => {
  const keyword = tableKeyword.value.trim().toLowerCase();

  return auditLogs.value.filter((log) => {
    const matchesType = activeFilter.value === "all" || log.type === activeFilter.value;
    if (!matchesType) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return [log.time, log.operator, log.action, log.target, log.result]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
});

const setFilter = (type) => {
  activeFilter.value = type;
};

const createExportPayload = () => {
  const payload = {};
  const keyword = tableKeyword.value.trim();
  const globalKeyword = topbarKeyword.value.trim();

  if (keyword) {
    payload.keyword = keyword;
  }

  if (globalKeyword) {
    payload.globalKeyword = globalKeyword;
  }

  if (activeFilter.value !== "all") {
    payload.type = activeFilter.value;
  }

  return payload;
};

const hasExternalExportListener = () => {
  const vnodeProps = instance?.vnode.props ?? {};
  return Object.keys(vnodeProps).some(
    (key) => key === "onExportLogs" || key === "onExportLogsOnce",
  );
};

const buildExportUrl = () => {
  const baseUrl =
    typeof window === "undefined" ? "http://localhost" : window.location.origin;
  const requestUrl = new URL(props.exportEndpoint, baseUrl);
  const payload = createExportPayload();

  Object.entries(payload).forEach(([key, value]) => {
    requestUrl.searchParams.set(key, value);
  });

  return typeof window === "undefined"
    ? `${requestUrl.pathname}${requestUrl.search}`
    : requestUrl.toString();
};

const getFilenameFromResponse = (response) => {
  const disposition = response.headers.get("content-disposition") || "";
  const utf8Filename = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];

  if (utf8Filename) {
    return decodeURIComponent(utf8Filename);
  }

  const fallbackFilename = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  if (fallbackFilename) {
    return fallbackFilename;
  }

  return `audit-logs-${new Date().toISOString().slice(0, 10)}.xlsx`;
};

const notifyExportResult = (title, message, icon) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.showToast === "function") {
    window.showToast({ title, message, icon });
    return;
  }

  window.alert(`${title}\n${message}`);
};

const downloadBlobFile = (blob, filename) => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 0);
};

const handleNavigate = (path) => {
  pushAppPath(router, path);
};

const handleExportLogs = async () => {
  const payload = createExportPayload();

  emit("export-logs", payload);
  if (hasExternalExportListener() || isExporting.value) {
    return;
  }

  isExporting.value = true;

  try {
    const response = await fetch(buildExportUrl(), {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Export request failed with status ${response.status}`);
    }

    const fileBlob = await response.blob();
    downloadBlobFile(fileBlob, getFilenameFromResponse(response));
    notifyExportResult("Export complete", "Audit log download has started.", "download_done");
  } catch (error) {
    console.error("Failed to export audit logs.", error);
    notifyExportResult("Export failed", "Retry later or check the export endpoint.", "error");
  } finally {
    isExporting.value = false;
  }
};

const handleOpenNotifications = () => {
  emit("open-notifications");
  pushAppPath(router, "/notifications");
};

const handleOpenAppSwitcher = () => {
  emit("open-app-switcher");
};

const handleOpenAiDrawer = () => {
  emit("open-ai-drawer");
};
</script>

<style>

.admin-logs-page {
  min-height: 100vh;
  color: var(--color-text-primary);
  font-family: "Inter", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 0% 0%, rgba(173, 198, 255, 0.34) 0, transparent 42%),
    radial-gradient(circle at 100% 0%, rgba(236, 220, 255, 0.34) 0, transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(156, 239, 219, 0.22) 0, transparent 38%),
    radial-gradient(circle at 0% 100%, rgba(20, 112, 232, 0.12) 0, transparent 38%),
    #f7f8fc;
  background-attachment: fixed;
}

.admin-logs-page .app-shell {
  min-height: 100vh;
}
</style>
