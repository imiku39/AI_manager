<template>
  <!-- 来源页面：admin.html -->
  <div class="admin-dashboard-page">
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

        <!-- TODO: 对接“新增角色模板”业务流程，当前仅打开原型弹层 -->
        <button class="sidebar-primary-cta" type="button" @click="openCreateTemplateModal">
          <span class="material-symbols-outlined">manage_accounts</span>
          新增角色模板
        </button>

        <!-- TODO: 接入 Vue Router 后统一替换为 RouterLink 或 router.push -->
        <nav class="sidebar-nav">
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
          <a class="nav-item" href="#" @click.prevent="handleNavigate('./dashboard.html')">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>返回主系统</span>
          </a>
        </div>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">后台管理</h2>
            <div class="topbar-breadcrumb">
              <span>管理后台</span>
              <span>/</span>
              <span>首页</span>
            </div>
          </div>
        </div>
        <div class="topbar-right">
          <!-- TODO: 对接后台全局搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="topbarKeyword"
              type="text"
              placeholder="搜索用户、角色、日志..."
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
              <h1 class="page-title">后台管理首页</h1>
              <p class="page-subtitle">
                统一处理用户、角色模板、系统配置与审计日志，同时保持与主业务系统一致的玻璃拟态风格。
              </p>
            </div>
            <div class="page-actions">
              <button class="btn-secondary" type="button" @click="openMatrixModal">
                <span class="material-symbols-outlined">shield</span>
                权限矩阵
              </button>
              <button class="btn-secondary" type="button" @click="handleNavigate('/admin/project-templates')">
                <span class="material-symbols-outlined">dashboard_customize</span>
                椤圭洰妯℃澘
              </button>
              <button class="btn-primary" type="button" @click="handleNavigate('./admin-system.html')">
                <span class="material-symbols-outlined">settings</span>
                系统配置
              </button>
            </div>
          </div>

          <section class="admin-grid">
            <div
              v-for="card in metricCards"
              :key="card.label"
              class="admin-card glass-panel"
              style="min-height: 184px; display: flex; flex-direction: column; justify-content: space-between;"
            >
              <span class="pill" :class="card.pillClass">{{ card.status }}</span>
              <h3 style="font-size: 28px; margin-top: 14px;">{{ card.value }}</h3>
              <p>{{ card.label }}</p>
            </div>
          </section>

          <section class="grid-2-1">
            <div class="glass-panel chart-card" style="min-height: 560px;">
              <div class="chart-header">
                <h2 class="section-title">角色模板使用分布</h2>
                <span class="section-caption">按项目内身份统计</span>
              </div>
              <div class="bar-chart">
                <div v-for="item in roleUsageBars" :key="item.label" class="bar-item">
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ height: item.height, background: item.background }"></div>
                  </div>
                  <span>{{ item.label }}</span>
                </div>
              </div>

              <div style="height: 1px; margin: 24px 0; background: rgba(216, 221, 232, 0.58);"></div>

              <div class="chart-header" style="margin-bottom: 14px;">
                <h2 class="section-title">最近系统配置改动</h2>
                <span class="section-caption">按影响范围排序</span>
              </div>
              <div class="mini-bars">
                <div v-for="item in configChangeRows" :key="item.label" class="mini-bar-row">
                  <span>{{ item.label }}</span>
                  <div class="progress-track">
                    <div class="progress-fill" :style="{ width: item.width, background: item.background }"></div>
                  </div>
                  <strong>{{ item.level }}</strong>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div
                class="glass-panel"
                style="padding: 24px; min-height: 248px; border-radius: 24px; background: linear-gradient(180deg, rgba(236,220,255,0.32), rgba(255,255,255,0.42));"
              >
                <h2 class="section-title">AI 管理建议</h2>
                <p class="page-subtitle" style="font-size: 14px; margin-top: 14px;">
                  本周审计日志中有 4 条高频权限变更操作，建议检查是否存在角色边界过宽的问题；同时建议收紧“项目归档恢复”权限，仅保留管理员与 PM。
                </p>
                <div class="ai-actions">
                  <!-- TODO: 对接 AI 建议应用流程 -->
                  <button class="btn-primary" type="button" @click="handleApplyAiSuggestion">应用建议</button>
                  <button class="btn-secondary" type="button" @click="handleNavigate('./admin-logs.html')">
                    查看日志
                  </button>
                </div>
              </div>

              <div class="glass-panel" style="padding: 24px; min-height: 288px; border-radius: 24px;">
                <h2 class="section-title">最近审计事件</h2>
                <div class="timeline" style="margin-top: 18px;">
                  <div v-for="item in recentAuditItems" :key="item.title" class="timeline-item">
                    <span class="timeline-dot" :style="{ background: item.dotColor }"></span>
                    <div class="timeline-body">
                      <h4>{{ item.title }}</h4>
                      <p>{{ item.description }}</p>
                      <span>{{ item.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <button class="floating-ai-btn" type="button" data-ai-toggle @click="handleOpenAiDrawer">
      <span class="material-symbols-outlined">auto_awesome</span>
    </button>

    <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" data-ai-overlay @click="closeAiDrawer"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }" data-ai-drawer>
      <div class="ai-header">
        <div>
          <h3>AI 助手</h3>
          <p class="section-caption">当前上下文：后台管理</p>
        </div>
        <button class="icon-btn" type="button" data-ai-close @click="closeAiDrawer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="ai-card">
        <h4>权限建议</h4>
        <p>
          建议把高风险权限变更操作增加二次确认和审计级别标记，同时默认开启操作日志导出提醒。
        </p>
        <div class="ai-actions">
          <!-- TODO: 对接 AI 权限策略应用流程 -->
          <button class="btn-primary" type="button" @click="handleApplyAiStrategy">应用策略</button>
          <button class="btn-secondary" type="button" @click="handleDeferAiSuggestion">稍后处理</button>
        </div>
      </div>
    </aside>

    <div class="modal-shell" :class="{ open: modalState.matrix }" data-modal-id="matrix-modal">
      <div class="modal-backdrop" data-modal-close @click="closeModal('matrix')"></div>
      <section class="modal-panel glass-panel-strong admin-matrix-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">权限矩阵</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">角色功能矩阵</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              按平台角色与项目角色双层查看页面、按钮、路由和数据范围能力。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('matrix')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="matrix-section">
          <div class="chart-header" style="margin-bottom: 0;">
            <h3 class="section-title" style="font-size: 22px;">平台角色矩阵</h3>
            <span class="section-caption">后台访问与全局管理能力</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>角色</th>
                <th>访问后台</th>
                <th>用户管理</th>
                <th>角色管理</th>
                <th>审计日志</th>
                <th>系统配置</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in platformMatrixRows" :key="row.role">
                <td>{{ row.role }}</td>
                <td v-for="(cell, index) in row.cells" :key="`${row.role}-${index}`">
                  <span class="perm-state" :class="cell.stateClass">
                    <span class="material-symbols-outlined">{{ cell.icon }}</span>
                    {{ cell.label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="matrix-section">
          <div class="chart-header" style="margin-bottom: 0;">
            <h3 class="section-title" style="font-size: 22px;">项目角色矩阵</h3>
            <span class="section-caption">项目内默认权限集合</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>角色</th>
                <th>创建任务</th>
                <th>分配负责人</th>
                <th>变更状态</th>
                <th>查看报表</th>
                <th>导出报表</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in projectMatrixRows" :key="row.role">
                <td>{{ row.role }}</td>
                <td v-for="(cell, index) in row.cells" :key="`${row.role}-${index}`">
                  <span class="perm-state" :class="cell.stateClass">
                    <span class="material-symbols-outlined">{{ cell.icon }}</span>
                    {{ cell.label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">schedule</span>
            当前矩阵基于 2026-04-26 的权限草稿
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" type="button" data-modal-close @click="closeModal('matrix')">
              <span class="material-symbols-outlined">close</span>
              关闭
            </button>
            <!-- TODO: 对接矩阵导出任务 -->
            <button class="btn-primary" type="button" @click="handleExportMatrix">
              <span class="material-symbols-outlined">download</span>
              导出矩阵
            </button>
          </div>
        </div>
      </section>
    </div>

    <div class="modal-shell" :class="{ open: modalState.createTemplate }" data-modal-id="create-template-modal">
      <div class="modal-backdrop" data-modal-close @click="closeModal('createTemplate')"></div>
      <section class="modal-panel glass-panel-strong">
        <div class="modal-header">
          <div>
            <span class="pill pill-success">模板编辑</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">新建项目角色模板</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              模拟后台内对项目角色模板的配置面板，保持高可读性和玻璃层级，不退回默认表单风格。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('createTemplate')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-grid">
          <aside class="modal-side">
            <div
              v-for="item in templateItems"
              :key="item.key"
              class="template-item"
              :class="{ active: selectedTemplateKey === item.key }"
              :data-template-key="item.key"
              @click="selectedTemplateKey = item.key"
            >
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
            </div>
          </aside>

          <div class="modal-main">
            <article class="glass-panel" style="padding: 20px; border-radius: 22px;">
              <div class="field-inline">
                <div class="field-stack">
                  <label class="field-label">模板名称</label>
                  <div class="field-input">
                    <input v-model="createTemplateForm.title" placeholder="请输入模板名称" />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">适用范围</label>
                  <div class="field-input">
                    <input v-model="createTemplateForm.scope" placeholder="请输入适用范围" />
                  </div>
                </div>
              </div>
              <div class="field-stack" style="margin-top: 16px;">
                <label class="field-label">模板说明</label>
                <div class="field-input">
                  <textarea v-model="createTemplateForm.desc" placeholder="请输入模板说明"></textarea>
                </div>
              </div>
            </article>

            <article class="glass-panel" style="padding: 20px; border-radius: 22px;">
              <div class="chart-header" style="margin-bottom: 14px;">
                <h3 class="section-title" style="font-size: 20px;">页面可见性</h3>
                <span class="section-caption">控制主页面和项目内页面是否可见</span>
              </div>
              <div class="permission-chip-grid">
                <button
                  v-for="chip in visibilityChips"
                  :key="chip.key"
                  class="permission-chip"
                  :class="{ on: createTemplateForm.visible.includes(chip.key) }"
                  type="button"
                  data-chip-group="create-visible"
                  :data-chip-key="chip.key"
                  @click="toggleCreateChip('visible', chip.key)"
                >
                  {{ chip.label }}
                </button>
              </div>
            </article>

            <article class="glass-panel" style="padding: 20px; border-radius: 22px;">
              <div class="chart-header" style="margin-bottom: 14px;">
                <h3 class="section-title" style="font-size: 20px;">操作权限</h3>
                <span class="section-caption">按钮、状态流转与导出能力</span>
              </div>
              <div class="permission-chip-grid">
                <button
                  v-for="chip in actionChips"
                  :key="chip.key"
                  class="permission-chip"
                  :class="{ on: createTemplateForm.actions.includes(chip.key) }"
                  type="button"
                  data-chip-group="create-action"
                  :data-chip-key="chip.key"
                  @click="toggleCreateChip('actions', chip.key)"
                >
                  {{ chip.label }}
                </button>
              </div>
            </article>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status">
            <span class="material-symbols-outlined">cloud_upload</span>
            当前模板未保存
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" type="button" data-modal-close @click="closeModal('createTemplate')">
              <span class="material-symbols-outlined">close</span>
              取消
            </button>
            <!-- TODO: 对接新模板“另存为”接口 -->
            <button class="btn-secondary" type="button" data-create-template-save-as @click="handleCreateTemplateSaveAs">
              <span class="material-symbols-outlined">content_copy</span>
              另存为新模板
            </button>
            <!-- TODO: 对接新模板保存接口 -->
            <button class="btn-primary" type="button" data-create-template-save @click="handleCreateTemplateSave">
              <span class="material-symbols-outlined">save</span>
              保存模板
            </button>
          </div>
        </div>
      </section>
    </div>

    <div v-if="toasts.length" class="toast-stack" data-toast-stack>
      <div v-for="toast in toasts" :key="toast.id" class="toast-card">
        <span class="material-symbols-outlined">{{ toast.icon }}</span>
        <div class="toast-body">
          <strong>{{ toast.title }}</strong>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { pushAppPath } from "../../utils/navigation";
import UserProfileHoverCard from "../../components/topbar/UserProfileHoverCard.vue";

const router = useRouter();

defineOptions({
  name: "AdminDashboardPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "export-matrix",
  "create-template",
  "create-template-as",
]);

const topbarKeyword = ref("");
const isAiDrawerOpen = ref(false);
const selectedTemplateKey = ref("pm");
const toasts = ref([]);

const modalState = reactive({
  matrix: false,
  createTemplate: false,
});

const currentUser = {
  name: "系统管理员",
  role: "平台角色：Admin",
  avatar: "https://i.pravatar.cc/80?img=5",
};

const sidebarNavItems = [
  { label: "管理首页", icon: "grid_view", path: "/admin", active: true },
  { label: "用户管理", icon: "group", path: "/admin/users", active: false },
  { label: "角色管理", icon: "badge", path: "/admin/roles", active: false },
  { label: "审计日志", icon: "receipt_long", path: "/admin/logs", active: false },
  { label: "系统配置", icon: "settings", path: "/admin/system", active: false },
];

const metricCards = [
  { status: "正常", pillClass: "pill-success", value: "1,284", label: "活跃账号数" },
  { status: "待处理", pillClass: "pill-warning", value: "12", label: "角色模板变更申请" },
  { status: "关注", pillClass: "pill-danger", value: "4", label: "异常审计事件" },
  { status: "AI", pillClass: "pill-ai", value: "67%", label: "推荐规则采纳率" },
];

const roleUsageBars = [
  {
    label: "PM",
    height: "88%",
    background: "linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700))",
  },
  {
    label: "研发",
    height: "96%",
    background: "linear-gradient(180deg, #a871ff, var(--color-tertiary-600))",
  },
  {
    label: "QA",
    height: "58%",
    background: "linear-gradient(180deg, #38c59b, var(--color-secondary-600))",
  },
  {
    label: "产品",
    height: "42%",
    background: "linear-gradient(180deg, #f7c455, var(--color-warning-600))",
  },
];

const configChangeRows = [
  {
    label: "通知偏好规则",
    width: "44%",
    background: "linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700))",
    level: "低",
  },
  {
    label: "项目归档权限",
    width: "68%",
    background: "linear-gradient(90deg, #f7c455, var(--color-warning-600))",
    level: "中",
  },
  {
    label: "权限变更操作",
    width: "84%",
    background: "linear-gradient(90deg, #f36b63, var(--color-danger-600))",
    level: "高",
  },
];

const recentAuditItems = [
  {
    title: "修改系统配置",
    description: "管理员李工更新了通知通道策略，已生成审计记录。",
    time: "今天 10:43",
    dotColor: "var(--color-danger-600)",
  },
  {
    title: "更新角色矩阵",
    description: "PM 的“项目归档恢复”权限已调整为仅限本人负责项目。",
    time: "今天 09:28",
    dotColor: "var(--color-primary-600)",
  },
];

const templateItems = [
  {
    key: "pm",
    title: "PM 模板",
    description: "项目负责人，拥有项目级编辑、分配、导出与成员管理能力。",
  },
  {
    key: "dev",
    title: "研发模板",
    description: "面向执行角色，强调任务创建、状态流转和个人工作台协同。",
  },
  {
    key: "qa",
    title: "QA 模板",
    description: "关注缺陷创建、验证流程和质量报表查看。",
  },
  {
    key: "collab",
    title: "协作者模板",
    description: "默认只读，适用于跨团队旁路协同。",
  },
];

const visibilityChips = [
  { key: "overview", label: "项目详情" },
  { key: "kanban", label: "项目看板" },
  { key: "gantt", label: "项目甘特图" },
  { key: "risk", label: "风险看板" },
  { key: "members", label: "成员管理" },
  { key: "reports", label: "项目报表" },
  { key: "admin", label: "后台管理" },
];

const actionChips = [
  { key: "create-task", label: "创建任务" },
  { key: "assign-owner", label: "分配负责人" },
  { key: "edit-milestone", label: "编辑里程碑" },
  { key: "set-baseline", label: "设置基线" },
  { key: "drag-gantt", label: "拖拽甘特条" },
  { key: "invite-member", label: "邀请成员" },
  { key: "export-report", label: "导出报表" },
  { key: "schedule-report", label: "定时订阅" },
  { key: "delete-template", label: "删除角色模板" },
];

const createTemplateForm = reactive({
  title: "",
  scope: "",
  desc: "",
  visible: [],
  actions: [],
});

const createPermission = (label, stateClass, icon) => ({
  label,
  stateClass,
  icon,
});

const platformMatrixRows = [
  {
    role: "超级管理员",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
    ],
  },
  {
    role: "系统管理员",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
    ],
  },
  {
    role: "普通用户",
    cells: [
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
];

const projectMatrixRows = [
  {
    role: "PM",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
    ],
  },
  {
    role: "研发",
    cells: [
      createPermission("自己/下属", "limited", "tune"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("自己", "limited", "tune"),
      createPermission("自己相关", "limited", "tune"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "QA",
    cells: [
      createPermission("Bug", "limited", "tune"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("自己", "limited", "tune"),
      createPermission("自己相关", "limited", "tune"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "产品",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("自己", "limited", "tune"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "协作者",
    cells: [
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("只读", "limited", "visibility"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
];

const toastTimers = new Set();

const resetCreateTemplateForm = () => {
  createTemplateForm.title = "";
  createTemplateForm.scope = "";
  createTemplateForm.desc = "";
  createTemplateForm.visible = ["overview", "kanban", "gantt", "risk", "members", "reports"];
  createTemplateForm.actions = [
    "create-task",
    "assign-owner",
    "edit-milestone",
    "set-baseline",
    "drag-gantt",
    "invite-member",
    "export-report",
    "schedule-report",
  ];
};

const pushToast = ({ title, message, icon = "check_circle" }) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toasts.value.push({ id, title, message, icon });

  const timer = window.setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id);
    toastTimers.delete(timer);
  }, 2600);

  toastTimers.add(timer);
};

const toggleArrayItem = (source, key) => {
  const index = source.indexOf(key);
  if (index >= 0) {
    source.splice(index, 1);
  } else {
    source.push(key);
  }
};

const openMatrixModal = () => {
  modalState.matrix = true;
};

const openCreateTemplateModal = () => {
  selectedTemplateKey.value = "pm";
  resetCreateTemplateForm();
  modalState.createTemplate = true;
};

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false;
};

const closeModal = (key) => {
  modalState[key] = false;
};

const closeAllOverlays = () => {
  modalState.matrix = false;
  modalState.createTemplate = false;
  isAiDrawerOpen.value = false;
};

const handleNavigate = (path) => {
  pushAppPath(router, path);
};

const handleOpenNotifications = () => {
  emit("open-notifications");
  pushAppPath(router, "/notifications");
};

const handleOpenAppSwitcher = () => {
  emit("open-app-switcher");
};

const handleOpenAiDrawer = () => {
  isAiDrawerOpen.value = true;
  emit("open-ai-drawer");
};

const toggleCreateChip = (group, key) => {
  toggleArrayItem(createTemplateForm[group], key);
};

const validateCreateTemplate = () => {
  if (!createTemplateForm.title.trim()) {
    pushToast({
      title: "请输入模板名称",
      message: "模板名称不能为空，请填写后重试。",
      icon: "error",
    });
    return false;
  }

  return true;
};

// TODO: Connect the matrix export workflow.
const handleExportMatrix = () => {
  emit("export-matrix");
  pushToast({
    title: "矩阵导出任务已创建",
    message: "角色功能矩阵将按当前视图导出为 PDF 草稿。",
    icon: "download",
  });
};

// TODO: Connect the create-template save workflow.
const handleCreateTemplateSave = () => {
  if (!validateCreateTemplate()) {
    return;
  }

  emit("create-template", {
    key: selectedTemplateKey.value,
    template: {
      title: createTemplateForm.title,
      scope: createTemplateForm.scope,
      desc: createTemplateForm.desc,
      visible: [...createTemplateForm.visible],
      actions: [...createTemplateForm.actions],
    },
  });
  pushToast({
    title: "模板已保存",
    message: `${createTemplateForm.title} 已添加到角色配置草稿。`,
    icon: "task_alt",
  });
  closeModal("createTemplate");
};

// TODO: Connect the create-template save-as workflow.
const handleCreateTemplateSaveAs = () => {
  if (!validateCreateTemplate()) {
    return;
  }

  emit("create-template-as", {
    key: selectedTemplateKey.value,
    template: {
      title: createTemplateForm.title,
      scope: createTemplateForm.scope,
      desc: createTemplateForm.desc,
      visible: [...createTemplateForm.visible],
      actions: [...createTemplateForm.actions],
    },
  });
  pushToast({
    title: "已另存为新模板",
    message: `${createTemplateForm.title} 副本已生成，可继续修改。`,
    icon: "content_copy",
  });
  closeModal("createTemplate");
};

const handleApplyAiSuggestion = () => {
  pushToast({
    title: "AI 建议已加入待办",
    message: "建议草稿已记录，后续可统一接入自动化审批流程。",
    icon: "auto_awesome",
  });
};

const handleApplyAiStrategy = () => {
  pushToast({
    title: "策略草稿已生成",
    message: "权限策略变更建议已放入待处理队列。",
    icon: "policy",
  });
};

const handleDeferAiSuggestion = () => {
  closeAiDrawer();
  pushToast({
    title: "已稍后处理",
    message: "AI 建议已保留在当前上下文中。",
    icon: "schedule",
  });
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeAllOverlays();
  }
};

onMounted(() => {
  resetCreateTemplateForm();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  toastTimers.forEach((timer) => window.clearTimeout(timer));
  toastTimers.clear();
});
</script>

<style>

.admin-dashboard-page {
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

.admin-dashboard-page .app-shell {
  min-height: 100vh;
}

.admin-matrix-modal {
  width: min(960px, calc(100vw - 40px));
  max-height: min(90vh, 920px);
  overflow-y: auto;
}

.matrix-section + .matrix-section {
  margin-top: 28px;
}
</style>
