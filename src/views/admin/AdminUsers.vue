<template>
  <!-- 来源页面：admin-users.html -->
  <div class="admin-users-page">
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

        <!-- TODO: 对接新增用户接口或创建流程 -->
        <button class="sidebar-primary-cta" type="button" @click="openCreateUserModal">
          <span class="material-symbols-outlined">person_add</span>
          新增用户
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
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>返回主系统</span>
          </a>
        </div>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">用户管理</h2>
            <div class="topbar-breadcrumb">
              <span>后台管理</span>
              <span>/</span>
              <span>用户管理</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- TODO: 对接用户、部门、角色全局搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="topbarKeyword"
              type="text"
              placeholder="搜索用户、部门、角色..."
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
              <h1 class="page-title">用户管理</h1>
              <p class="page-subtitle">
                用户增删改查页延续玻璃表格容器，同时保留新增与导入操作的统一后台交互层级。
              </p>
            </div>
            <div class="page-actions">
              <!-- TODO: 对接批量导入用户接口 -->
              <button class="btn-secondary" type="button" @click="openImportUsersModal">
                <span class="material-symbols-outlined">upload_file</span>
                导入用户
              </button>

              <!-- TODO: 对接新增用户接口或创建流程 -->
              <button class="btn-primary" type="button" @click="openCreateUserModal">
                <span class="material-symbols-outlined">person_add</span>
                新增用户
              </button>
            </div>
          </div>

          <section class="admin-table-card glass-panel">
            <div class="admin-toolbar">
              <!-- TODO: 对接用户列表关键字搜索接口；当前保留本地筛选 -->
              <label class="search-shell">
                <span class="material-symbols-outlined">search</span>
                <input
                  v-model="tableKeyword"
                  type="text"
                  placeholder="搜索姓名、部门、邮箱..."
                />
              </label>

              <!-- TODO: 对接用户角色筛选枚举或服务端筛选参数 -->
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
                  <th>姓名</th>
                  <th>邮箱</th>
                  <th>部门</th>
                  <th>平台角色</th>
                  <th>状态</th>
                  <th>加入时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <!-- TODO: 对接用户列表接口，字段结构建议与当前 mock 保持一致 -->
                <tr v-for="user in filteredUsers" :key="user.id" :data-role="user.roleKey">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.department }}</td>
                  <td>{{ user.roleLabel }}</td>
                  <td>
                    <span class="pill" :class="user.statusClass">{{ user.status }}</span>
                  </td>
                  <td>{{ user.joinDate }}</td>
                  <td>
                    <div class="user-row-actions">
                      <button
                        v-for="action in user.actions"
                        :key="`${user.id}-${action.label}`"
                        class="btn-chip"
                        :class="{ active: action.active }"
                        type="button"
                        @click="handleUserAction(user, action)"
                      >
                        {{ action.label }}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredUsers.length">
                  <td colspan="7">暂无符合条件的用户数据</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>

    <div class="modal-shell" :class="{ open: modalState.createUser }" data-modal-id="create-user-modal">
      <div class="modal-backdrop" data-modal-close @click="closeModal('createUser')"></div>
      <section class="modal-panel glass-panel-strong user-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-success">账户创建</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">新增用户</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              沿用后台模块的玻璃层级和统一表单风格，先完成基础账户信息，再决定平台角色和初始激活状态。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('createUser')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="user-modal-grid">
          <aside class="user-modal-side">
            <article class="glass-panel user-note-card">
              <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span class="pill pill-ai">快速配置</span>
                <span class="pill pill-neutral">管理员入口</span>
              </div>
              <h3 class="section-title" style="font-size: 24px; margin-top: 16px;">新用户创建草稿</h3>
              <p class="page-subtitle" style="font-size: 14px; margin-top: 12px;">
                创建后可继续在角色管理、系统配置和通知中心中扩展权限、启用状态与通知策略。
              </p>
              <div class="user-kpi-grid">
                <div class="user-kpi"><span>默认状态</span><strong>待激活</strong></div>
                <div class="user-kpi"><span>角色粒度</span><strong>平台级</strong></div>
                <div class="user-kpi"><span>建议校验</span><strong>邮箱必填</strong></div>
                <div class="user-kpi"><span>后续动作</span><strong>发送邀请</strong></div>
              </div>
            </article>

            <article
              class="glass-panel user-note-card"
              style="background: linear-gradient(180deg, rgba(236,220,255,0.32), rgba(255,255,255,0.42));"
            >
              <h3 class="section-title" style="font-size: 22px;">填写建议</h3>
              <div class="user-note-list">
                <div class="user-note-item">
                  <h4>优先保证邮箱与部门准确</h4>
                  <p>这两个字段会直接影响后续邀请通知、组织筛选与导入校验结果。</p>
                </div>
                <div class="user-note-item">
                  <h4>管理员角色谨慎授予</h4>
                  <p>平台管理员默认拥有后台访问能力，建议仅在确有需要时开启。</p>
                </div>
                <div class="user-note-item">
                  <h4>待激活状态更适合批量入场</h4>
                  <p>如果需要和导入用户一起统一开通，可先保留待激活，后续批量发送邀请。</p>
                </div>
              </div>
            </article>
          </aside>

          <div class="user-modal-main">
            <article class="glass-panel user-form-card">
              <div class="user-form-card-head">
                <div>
                  <h3 class="section-title" style="font-size: 22px;">基础信息</h3>
                  <p class="section-caption" style="margin-top: 6px;">对应用户列表的主要展示字段和检索字段</p>
                </div>
                <span class="pill pill-neutral">主字段</span>
              </div>

              <!-- TODO: 对接新增用户提交接口 -->
              <form @submit.prevent="handleCreateUserSubmit">
                <div class="field-inline" style="margin-top: 0;">
                  <div class="field-stack">
                    <label class="field-label">姓名</label>
                    <div class="field-input">
                      <span class="material-symbols-outlined">person</span>
                      <input v-model="createUserForm.name" type="text" placeholder="请输入姓名" required />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">邮箱</label>
                    <div class="field-input">
                      <span class="material-symbols-outlined">mail</span>
                      <input v-model="createUserForm.email" type="email" placeholder="请输入邮箱" required />
                    </div>
                  </div>
                </div>

                <div class="field-inline">
                  <div class="field-stack">
                    <label class="field-label">部门</label>
                    <div class="field-input">
                      <span class="material-symbols-outlined">apartment</span>
                      <input v-model="createUserForm.department" type="text" placeholder="请输入部门" />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">加入日期</label>
                    <div class="field-input">
                      <span class="material-symbols-outlined">calendar_today</span>
                      <input v-model="createUserForm.joinDate" type="text" />
                    </div>
                  </div>
                </div>

                <article class="glass-soft user-form-card" style="padding: 18px; margin-top: 18px;">
                  <div class="user-form-card-head" style="margin-bottom: 0;">
                    <div>
                      <h3 class="section-title" style="font-size: 20px;">账户配置</h3>
                      <p class="section-caption" style="margin-top: 6px;">决定后台访问范围与初始启用状态</p>
                    </div>
                    <span class="pill pill-warning">权限配置</span>
                  </div>
                  <div class="field-inline">
                    <div class="field-stack">
                      <label class="field-label">平台角色</label>
                      <div class="field-input">
                        <span class="material-symbols-outlined">badge</span>
                        <select v-model="createUserForm.role">
                          <option value="user">普通用户</option>
                          <option value="admin">管理员</option>
                        </select>
                      </div>
                    </div>
                    <div class="field-stack">
                      <label class="field-label">状态</label>
                      <div class="field-input">
                        <span class="material-symbols-outlined">toggle_on</span>
                        <select v-model="createUserForm.status">
                          <option value="待激活">待激活</option>
                          <option value="正常">正常</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="field-stack" style="margin-top: 16px;">
                    <label class="field-label">说明备注</label>
                    <div class="field-input">
                      <span class="material-symbols-outlined">notes</span>
                      <input
                        v-model="createUserForm.note"
                        type="text"
                        placeholder="可选：记录来源、协作组或分配说明"
                      />
                    </div>
                  </div>
                </article>

                <div class="modal-footer">
                  <div class="modal-status">
                    <span class="material-symbols-outlined">person_add</span>
                    新增用户会保留为后台草稿，可继续在角色与通知配置中补齐后续信息。
                  </div>
                  <div class="modal-footer-actions">
                    <button class="btn-secondary" type="button" data-modal-close @click="closeModal('createUser')">
                      <span class="material-symbols-outlined">close</span>
                      取消
                    </button>
                    <button class="btn-primary" type="submit">
                      <span class="material-symbols-outlined">task_alt</span>
                      确认添加
                    </button>
                  </div>
                </div>
              </form>
            </article>
          </div>
        </div>
      </section>
    </div>

    <div class="modal-shell" :class="{ open: modalState.importUsers }" data-modal-id="import-users-modal">
      <div class="modal-backdrop" data-modal-close @click="closeModal('importUsers')"></div>
      <section class="modal-panel glass-panel-strong user-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-success">批量导入</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">导入用户</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              批量导入改成与后台其他弹窗一致的上传、预览和确认结构，避免出现单页外观割裂。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('importUsers')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="user-modal-grid">
          <aside class="user-modal-side">
            <article class="glass-panel user-note-card">
              <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span class="pill pill-ai">导入流程</span>
                <span class="pill pill-neutral">Excel</span>
              </div>
              <h3 class="section-title" style="font-size: 24px; margin-top: 16px;">批量导入说明</h3>
              <p class="page-subtitle" style="font-size: 14px; margin-top: 12px;">
                支持 Excel 拖拽上传、预览检查和统一确认；完成导入后可继续在用户列表中逐条编辑。
              </p>
              <div class="user-note-list">
                <div class="user-note-item">
                  <h4>支持文件类型</h4>
                  <p>仅支持 `.xlsx` 和 `.xls`，建议按模板字段顺序准备数据。</p>
                </div>
                <div class="user-note-item">
                  <h4>预览后再确认</h4>
                  <p>预览区会先展示解析结果，确认无误后再执行导入，减少后台脏数据。</p>
                </div>
                <div class="user-note-item">
                  <h4>建议统一待激活</h4>
                  <p>如果是批量导入新同事，建议先设置为待激活，再分批发出通知。</p>
                </div>
              </div>
            </article>
          </aside>

          <div class="user-modal-main">
            <article class="glass-panel import-upload-card">
              <div class="import-card-head">
                <div>
                  <h3 class="section-title" style="font-size: 22px;">上传文件</h3>
                  <p class="section-caption" style="margin-top: 6px;">与项目其他表单保持统一玻璃容器和操作按钮层级</p>
                </div>
                <span class="pill pill-neutral">步骤 1 / 2</span>
              </div>

              <!-- TODO: 对接用户导入文件上传、解析与模板下载接口 -->
              <div
                class="upload-zone"
                :class="{ 'drag-over': isDragOver }"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @drop.prevent="handleDrop"
                @click="handleUploadZoneClick"
              >
                <div class="upload-zone-icon">
                  <span class="material-symbols-outlined">upload_file</span>
                </div>
                <div>
                  <h4 style="font-size: 16px; margin: 0;">点击或拖拽上传 Excel 文件</h4>
                  <p style="margin-top: 8px;">支持 `.xlsx` 和 `.xls` 格式，建议单次导入不超过 1000 条数据。</p>
                </div>
                <div class="upload-zone-actions">
                  <button class="btn-primary" type="button" @click.stop="triggerFileSelect">
                    <span class="material-symbols-outlined">upload</span>
                    选择文件
                  </button>
                  <button class="btn-chip active" type="button" @click.stop="handleDownloadTemplate">
                    <span class="material-symbols-outlined">download</span>
                    下载导入模板
                  </button>
                </div>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".xlsx,.xls"
                  hidden
                  @change="handleFileInputChange"
                />
              </div>

              <div class="import-preview-wrap" :class="{ active: Boolean(importPreview) }">
                <article v-if="importPreview" class="glass-panel import-preview-card">
                  <div class="import-preview-head">
                    <div>
                      <h4>导入预览</h4>
                      <p>
                        文件：{{ importPreview.fileName }} · 共 {{ importPreview.totalCount }} 条数据，确认无误后再执行导入。
                      </p>
                    </div>
                    <span class="pill pill-success">步骤 2 / 2</span>
                  </div>

                  <table class="data-table import-table">
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>邮箱</th>
                        <th>部门</th>
                        <th>平台角色</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in importPreview.rows" :key="row.email">
                        <td>{{ row.name }}</td>
                        <td>{{ row.email }}</td>
                        <td>{{ row.department }}</td>
                        <td>{{ row.roleLabel }}</td>
                      </tr>
                    </tbody>
                  </table>
                </article>
              </div>
            </article>

            <div class="modal-footer">
              <div class="import-helper">
                <span class="material-symbols-outlined">info</span>
                导入前请确认姓名、邮箱、部门和平台角色字段格式正确。
              </div>
              <div class="modal-footer-actions">
                <button class="btn-secondary" type="button" data-modal-close @click="closeModal('importUsers')">
                  <span class="material-symbols-outlined">close</span>
                  取消
                </button>
                <!-- TODO: 对接批量导入确认接口 -->
                <button class="btn-primary" type="button" :disabled="!importPreview" @click="handleImportSubmit">
                  <span class="material-symbols-outlined">upload</span>
                  导入用户
                </button>
              </div>
            </div>
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
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { pushAppPath } from "../../utils/navigation";
import UserProfileHoverCard from "../../components/topbar/UserProfileHoverCard.vue";

const router = useRouter();

defineOptions({
  name: "AdminUsersPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "create-user",
  "download-import-template",
  "import-users",
]);

const topbarKeyword = ref("");
const tableKeyword = ref("");
const activeFilter = ref("all");
const isDragOver = ref(false);
const fileInputRef = ref(null);
const importPreview = ref(null);
const toasts = ref([]);

const modalState = reactive({
  createUser: false,
  importUsers: false,
});

const createUserForm = reactive({
  name: "",
  email: "",
  department: "",
  joinDate: "2026-04-28",
  role: "user",
  status: "待激活",
  note: "",
});

const currentUser = {
  name: "系统管理员",
  role: "平台角色：Admin",
  avatar: "https://i.pravatar.cc/80?img=5",
};

const sidebarNavItems = [
  { label: "管理首页", icon: "grid_view", path: "/admin", active: false },
  { label: "用户管理", icon: "group", path: "/admin/users", active: true },
  { label: "角色管理", icon: "badge", path: "/admin/roles", active: false },
  { label: "审计日志", icon: "receipt_long", path: "/admin/logs", active: false },
  { label: "系统配置", icon: "settings", path: "/admin/system", active: false },
];

const filterOptions = [
  { label: "全部", value: "all" },
  { label: "管理员", value: "admin" },
  { label: "普通用户", value: "user" },
];

// TODO: 对接用户列表接口后，将该 mock 数据替换为接口返回。
const users = ref([
  {
    id: "user-zhang",
    name: "张工",
    email: "zhang@example.com",
    department: "研发中心",
    roleKey: "user",
    roleLabel: "普通用户",
    status: "正常",
    statusClass: "pill-success",
    joinDate: "2026-04-01",
    actions: [
      { label: "编辑", active: false },
      { label: "停用", active: false },
    ],
  },
  {
    id: "user-admin",
    name: "系统管理员",
    email: "admin@example.com",
    department: "平台组",
    roleKey: "admin",
    roleLabel: "管理员",
    status: "正常",
    statusClass: "pill-success",
    joinDate: "2026-01-01",
    actions: [{ label: "编辑", active: false }],
  },
  {
    id: "user-li",
    name: "李技术员",
    email: "li@example.com",
    department: "测试组",
    roleKey: "user",
    roleLabel: "普通用户",
    status: "待激活",
    statusClass: "pill-warning",
    joinDate: "2026-04-15",
    actions: [{ label: "激活", active: true }],
  },
]);

const importPreviewRows = [
  {
    name: "赵经理",
    email: "zhao@example.com",
    department: "产品部",
    roleLabel: "普通用户",
  },
  {
    name: "钱工程师",
    email: "qian@example.com",
    department: "研发中心",
    roleLabel: "管理员",
  },
  {
    name: "孙测试",
    email: "sun@example.com",
    department: "测试组",
    roleLabel: "普通用户",
  },
];

const toastTimers = new Set();

const searchKeywords = computed(() =>
  [topbarKeyword.value, tableKeyword.value]
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean),
);

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesRole = activeFilter.value === "all" || user.roleKey === activeFilter.value;
    if (!matchesRole) {
      return false;
    }

    if (!searchKeywords.value.length) {
      return true;
    }

    const searchableText = [
      user.name,
      user.email,
      user.department,
      user.roleLabel,
      user.status,
      user.joinDate,
    ]
      .join(" ")
      .toLowerCase();

    return searchKeywords.value.every((keyword) => searchableText.includes(keyword));
  });
});

const resetCreateUserForm = () => {
  createUserForm.name = "";
  createUserForm.email = "";
  createUserForm.department = "";
  createUserForm.joinDate = "2026-04-28";
  createUserForm.role = "user";
  createUserForm.status = "待激活";
  createUserForm.note = "";
};

const resetImportState = () => {
  importPreview.value = null;
  isDragOver.value = false;

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const showToast = ({ title, message, icon = "check_circle" }) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toasts.value.push({ id, title, message, icon });

  const timer = window.setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
    toastTimers.delete(timer);
  }, 2600);

  toastTimers.add(timer);
};

const setFilter = (role) => {
  activeFilter.value = role;
};

const openCreateUserModal = () => {
  resetCreateUserForm();
  modalState.createUser = true;
};

const openImportUsersModal = () => {
  resetImportState();
  modalState.importUsers = true;
};

const closeModal = (key) => {
  modalState[key] = false;

  if (key === "createUser") {
    resetCreateUserForm();
  }

  if (key === "importUsers") {
    resetImportState();
  }
};

const closeAllModals = () => {
  modalState.createUser = false;
  modalState.importUsers = false;
  resetImportState();
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
  emit("open-ai-drawer");
};

const handleUserAction = (user, action) => {
  showToast({
    title: `${action.label}任务已创建`,
    message: `${user.name} 的${action.label}操作待后续接口统一接入。`,
    icon: action.label === "激活" ? "task_alt" : "edit_note",
  });
};

// TODO: Connect the create-user submit API.
const handleCreateUserSubmit = () => {
  emit("create-user", { ...createUserForm });
  showToast({
    title: "用户添加成功",
    message: "新用户草稿已创建，可继续在用户列表中编辑角色与状态。",
    icon: "task_alt",
  });
  closeModal("createUser");
};

// TODO: Connect the import template download API.
const handleDownloadTemplate = () => {
  emit("download-import-template");
  showToast({
    title: "模板下载任务已创建",
    message: "导入模板将按当前字段结构导出，请稍后查看下载记录。",
    icon: "download",
  });
};

const showImportPreview = (fileName) => {
  importPreview.value = {
    fileName,
    totalCount: importPreviewRows.length,
    rows: importPreviewRows,
  };
};

const handleSelectedFile = (file) => {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".xlsx") && !lowerName.endsWith(".xls")) {
    showToast({
      title: "文件格式错误",
      message: "请上传 Excel 文件（.xlsx 或 .xls）。",
      icon: "error",
    });
    resetImportState();
    return;
  }

  showImportPreview(file.name);
};

const triggerFileSelect = () => {
  fileInputRef.value?.click();
};

const handleUploadZoneClick = (event) => {
  if (event.target.closest("button")) {
    return;
  }

  triggerFileSelect();
};

const handleFileInputChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    handleSelectedFile(file);
  }
};

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    handleSelectedFile(file);
  }
};

// TODO: Connect the batch import submit API.
const handleImportSubmit = () => {
  if (!importPreview.value) {
    return;
  }

  emit("import-users", {
    fileName: importPreview.value.fileName,
    rows: importPreview.value.rows,
  });
  showToast({
    title: "导入成功",
    message: `成功导入 ${importPreview.value.totalCount} 条用户数据，建议继续检查角色与状态字段。`,
    icon: "task_alt",
  });
  closeModal("importUsers");
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  toastTimers.forEach((timer) => window.clearTimeout(timer));
  toastTimers.clear();
});
</script>

<style>

.admin-users-page {
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

.admin-users-page .app-shell {
  min-height: 100vh;
}

.user-row-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.user-modal {
  width: min(920px, calc(100vw - 48px));
}

.user-modal-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.user-form-card,
.user-note-card,
.import-upload-card,
.import-preview-card {
  padding: 20px;
  border-radius: 24px;
}

.user-form-card-head,
.import-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.user-form-card-head h3,
.user-form-card-head p,
.user-note-card h3,
.user-note-card p,
.import-card-head h3,
.import-card-head p,
.import-preview-card h4,
.import-preview-card p {
  margin: 0;
}

.user-modal-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.88fr) minmax(0, 1.18fr);
  gap: 20px;
}

.user-modal-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.user-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.user-kpi {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.user-kpi span,
.user-kpi strong {
  display: block;
}

.user-kpi span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.user-kpi strong {
  margin-top: 8px;
  font-size: 18px;
}

.user-note-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.user-note-item {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.user-note-item h4,
.user-note-item p {
  margin: 0;
}

.user-note-item p {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.user-modal .field-inline {
  margin-top: 16px;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 24px;
  border-radius: 22px;
  border: 2px dashed rgba(20, 104, 199, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.34));
  text-align: center;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: rgba(20, 104, 199, 0.32);
  background: linear-gradient(180deg, rgba(173, 198, 255, 0.18), rgba(255, 255, 255, 0.44));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transform: translateY(-1px);
}

.upload-zone-icon {
  width: 68px;
  height: 68px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: var(--color-primary-700);
  background: rgba(20, 104, 199, 0.12);
  border: 1px solid rgba(20, 104, 199, 0.16);
}

.upload-zone-icon .material-symbols-outlined {
  font-size: 34px;
}

.upload-zone p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.upload-zone-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.import-preview-wrap {
  margin-top: 18px;
  display: none;
}

.import-preview-wrap.active {
  display: block;
}

.import-preview-card {
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.import-preview-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.import-preview-card p {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.import-table {
  margin-top: 12px;
}

.import-helper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-chip:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 1279px) {
  .user-modal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
