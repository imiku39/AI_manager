<template>
  <!-- 来源页面：admin-roles.html -->
  <div class="admin-roles-page">
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

        <!-- TODO: 对接“新建角色模板”业务流程，当前仅打开原型弹层 -->
        <button class="sidebar-primary-cta" type="button" @click="openCreateTemplateModal">
          <span class="material-symbols-outlined">badge</span>
          新建角色模板
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
            <h2 class="topbar-title">角色管理</h2>
            <div class="topbar-breadcrumb">
              <span>后台管理</span>
              <span>/</span>
              <span>角色管理</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- TODO: 对接角色/权限全局搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="topbarKeyword"
              type="text"
              placeholder="搜索角色、模板或权限..."
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
              <h1 class="page-title">角色模板管理</h1>
              <p class="page-subtitle">
                平台角色、项目角色模板和权限矩阵在同一页表达，方便你检查结构与视觉层级。
              </p>
            </div>
          </div>

          <section class="grid-2">
            <article v-for="card in overviewCards" :key="card.title" class="glass-panel admin-card">
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
              <div class="ai-actions">
                <button
                  class="btn-chip active"
                  type="button"
                  @click="card.action === 'matrix' ? openRoleMatrixModal() : openEditTemplateModal()"
                >
                  <span class="material-symbols-outlined">{{ card.buttonIcon }}</span>
                  {{ card.buttonLabel }}
                </button>
              </div>
            </article>
          </section>

          <section class="admin-table-card glass-panel">
            <div class="admin-toolbar">
              <h2 class="section-title">权限矩阵摘要</h2>
              <span class="section-caption">按钮、路由、Tab 级权限</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>角色</th>
                  <th>创建项目</th>
                  <th>编辑里程碑</th>
                  <th>导出报表</th>
                  <th>后台管理</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in summaryPermissionRows" :key="row.role">
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
          </section>
        </div>
      </main>
    </div>

    <div class="modal-shell" :class="{ open: modalState.roleMatrix }" data-modal-id="role-matrix-modal">
      <div class="modal-backdrop" data-modal-close @click="closeModal('roleMatrix')"></div>
      <section class="modal-panel glass-panel-strong">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">权限矩阵</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">角色功能矩阵</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              按平台角色与项目角色双层查看页面、按钮、路由和数据范围能力，保持与后台其他界面的玻璃拟态层级一致。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('roleMatrix')">
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
            <span class="material-symbols-outlined">table_chart</span>
            当前矩阵基于 2026-04-26 的权限草稿
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" type="button" data-modal-close @click="closeModal('roleMatrix')">
              <span class="material-symbols-outlined">close</span>
              关闭
            </button>
            <!-- TODO: 对接矩阵导出任务 -->
            <button class="btn-primary" type="button" data-matrix-export @click="handleExportMatrix">
              <span class="material-symbols-outlined">download</span>
              导出矩阵
            </button>
          </div>
        </div>
      </section>
    </div>

    <div
      class="modal-shell"
      :class="{ open: modalState.editTemplate }"
      data-modal-id="edit-template-modal"
    >
      <div class="modal-backdrop" data-modal-close @click="closeModal('editTemplate')"></div>
      <section class="modal-panel glass-panel-strong">
        <div class="modal-header">
          <div>
            <span class="pill pill-success">模板编辑</span>
            <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">编辑项目角色模板</h2>
            <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">
              模拟后台内对项目角色模板的配置面板，保持高可读性和玻璃层级，不退回默认表单风格。
            </p>
          </div>
          <button class="icon-btn" type="button" data-modal-close @click="closeModal('editTemplate')">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-grid">
          <aside class="modal-side">
            <div
              v-for="item in templateItems"
              :key="`edit-${item.key}`"
              class="template-item"
              :class="{ active: editTemplateKey === item.key }"
              :data-template-key="item.key"
              @click="selectEditTemplate(item.key)"
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
                    <input
                      v-model="editTemplateForm.title"
                      data-template-name
                      @input="markEditTemplateDirty"
                    />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">适用范围</label>
                  <div class="field-input">
                    <input
                      v-model="editTemplateForm.scope"
                      data-template-scope
                      @input="markEditTemplateDirty"
                    />
                  </div>
                </div>
              </div>
              <div class="field-stack" style="margin-top: 16px;">
                <label class="field-label">模板说明</label>
                <div class="field-input">
                  <textarea
                    v-model="editTemplateForm.desc"
                    data-template-desc
                    @input="markEditTemplateDirty"
                  ></textarea>
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
                  :key="`edit-visible-${chip.key}`"
                  class="permission-chip"
                  :class="{ on: editTemplateForm.visible.includes(chip.key) }"
                  type="button"
                  data-chip-group="visible"
                  :data-chip-key="chip.key"
                  @click="toggleEditChip('visible', chip.key)"
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
                  :key="`edit-action-${chip.key}`"
                  class="permission-chip"
                  :class="{ on: editTemplateForm.actions.includes(chip.key) }"
                  type="button"
                  data-chip-group="action"
                  :data-chip-key="chip.key"
                  @click="toggleEditChip('actions', chip.key)"
                >
                  {{ chip.label }}
                </button>
              </div>
            </article>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-status" data-template-status>
            <span class="material-symbols-outlined">{{ editTemplateStatus.icon }}</span>
            {{ editTemplateStatus.text }}
          </div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" type="button" data-modal-close @click="closeModal('editTemplate')">
              <span class="material-symbols-outlined">close</span>
              取消
            </button>
            <!-- TODO: 对接模板“另存为”接口 -->
            <button class="btn-secondary" type="button" data-template-save-as @click="handleEditTemplateSaveAs">
              <span class="material-symbols-outlined">content_copy</span>
              另存为新模板
            </button>
            <!-- TODO: 对接角色模板保存接口 -->
            <button class="btn-primary" type="button" data-template-save @click="handleEditTemplateSave">
              <span class="material-symbols-outlined">save</span>
              保存模板
            </button>
          </div>
        </div>
      </section>
    </div>

    <div
      class="modal-shell"
      :class="{ open: modalState.createTemplate }"
      data-modal-id="create-template-modal"
    >
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
              :key="`create-${item.key}`"
              class="template-item"
              :class="{ active: createTemplateKey === item.key }"
              :data-template-key="item.key"
              @click="createTemplateKey = item.key"
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
                    <input
                      id="create-template-name"
                      v-model="createTemplateForm.title"
                      placeholder="请输入模板名称"
                    />
                  </div>
                </div>
                <div class="field-stack">
                  <label class="field-label">适用范围</label>
                  <div class="field-input">
                    <input
                      id="create-template-scope"
                      v-model="createTemplateForm.scope"
                      placeholder="请输入适用范围"
                    />
                  </div>
                </div>
              </div>
              <div class="field-stack" style="margin-top: 16px;">
                <label class="field-label">模板说明</label>
                <div class="field-input">
                  <textarea
                    id="create-template-desc"
                    v-model="createTemplateForm.desc"
                    placeholder="请输入模板说明"
                  ></textarea>
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
                  :key="`create-visible-${chip.key}`"
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
                  :key="`create-action-${chip.key}`"
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
            <button
              class="btn-secondary"
              type="button"
              data-create-template-save-as
              @click="handleCreateTemplateSaveAs"
            >
              <span class="material-symbols-outlined">content_copy</span>
              另存为新模板
            </button>
            <!-- TODO: 对接新模板保存接口 -->
            <button
              class="btn-primary"
              type="button"
              data-create-template-save
              @click="handleCreateTemplateSave"
            >
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
  name: "AdminRolesPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "export-matrix",
  "save-template",
  "save-template-as",
  "create-template",
  "create-template-as",
]);

const topbarKeyword = ref("");
const editTemplateKey = ref("pm");
const createTemplateKey = ref(null);
const editTemplateStatus = ref({
  icon: "verified",
  text: "当前模板已同步",
});
const toasts = ref([]);

const currentUser = {
  name: "系统管理员",
  role: "平台角色：Admin",
  avatar: "https://i.pravatar.cc/80?img=5",
};

const sidebarNavItems = [
  { label: "管理首页", icon: "grid_view", path: "/admin", active: false },
  { label: "用户管理", icon: "group", path: "/admin/users", active: false },
  { label: "角色管理", icon: "badge", path: "/admin/roles", active: true },
  { label: "审计日志", icon: "receipt_long", path: "/admin/logs", active: false },
  { label: "系统配置", icon: "settings", path: "/admin/system", active: false },
];

const overviewCards = [
  {
    title: "平台角色",
    description: "超级管理员、系统管理员、普通用户。用于控制是否可进入后台管理。",
    buttonIcon: "table_chart",
    buttonLabel: "查看矩阵",
    action: "matrix",
  },
  {
    title: "项目角色模板",
    description: "PM、研发、QA、产品、协作者。可在后台创建与编辑默认权限集合。",
    buttonIcon: "edit_note",
    buttonLabel: "编辑模板",
    action: "edit",
  },
];

const createPermission = (label, stateClass, icon) => ({
  label,
  stateClass,
  icon,
});

const summaryPermissionRows = [
  {
    role: "PM",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "研发",
    cells: [
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "系统管理员",
    cells: [
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
      createPermission("允许", "allow", "check_circle"),
    ],
  },
];

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
      createPermission("自己相关", "limited", "visibility"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
    ],
  },
  {
    role: "QA",
    cells: [
      createPermission("Bug", "limited", "bug_report"),
      createPermission("禁止", "deny", "do_not_disturb_on"),
      createPermission("自己", "limited", "tune"),
      createPermission("自己相关", "limited", "visibility"),
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
    description: "关注缺陷创建、验证流转和质量报表查看。",
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

// TODO: 对接角色模板接口后，建议保持以下字段结构不变，方便直接替换 mock。
const templateLibrary = reactive({
  pm: {
    title: "PM 模板",
    scope: "项目内身份",
    desc: "默认用于项目负责人。允许创建项目、编辑里程碑、设置基线、导出项目报表，并可管理成员与角色分配。",
    visible: ["overview", "kanban", "gantt", "risk", "members", "reports"],
    actions: [
      "create-task",
      "assign-owner",
      "edit-milestone",
      "set-baseline",
      "drag-gantt",
      "invite-member",
      "export-report",
      "schedule-report",
    ],
  },
  dev: {
    title: "研发模板",
    scope: "项目内身份",
    desc: "面向执行角色，强调任务创建、个人状态流转、日志与个人看板协同，默认不开放项目级导出。",
    visible: ["overview", "kanban", "gantt", "reports"],
    actions: ["create-task", "drag-gantt"],
  },
  qa: {
    title: "QA 模板",
    scope: "项目内身份",
    desc: "关注缺陷创建、验证流转与质量报表查看，适合质量保障成员的项目默认权限集合。",
    visible: ["overview", "kanban", "reports"],
    actions: ["create-task"],
  },
  collab: {
    title: "协作者模板",
    scope: "项目内身份",
    desc: "默认只读，适用于跨团队旁路协同、管理查看与周报确认场景。",
    visible: ["overview", "reports"],
    actions: [],
  },
});

const modalState = reactive({
  roleMatrix: false,
  editTemplate: false,
  createTemplate: false,
});

const editTemplateForm = reactive({
  title: "",
  scope: "",
  desc: "",
  visible: [],
  actions: [],
});

const createTemplateForm = reactive({
  title: "",
  scope: "",
  desc: "",
  visible: [],
  actions: [],
});

const cloneTemplate = (template) => ({
  title: template.title,
  scope: template.scope,
  desc: template.desc,
  visible: [...template.visible],
  actions: [...template.actions],
});

const assignEditTemplate = (template) => {
  editTemplateForm.title = template.title;
  editTemplateForm.scope = template.scope;
  editTemplateForm.desc = template.desc;
  editTemplateForm.visible = [...template.visible];
  editTemplateForm.actions = [...template.actions];
};

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

const setEditTemplateSynced = () => {
  editTemplateStatus.value = {
    icon: "verified",
    text: "当前模板已同步",
  };
};

const markEditTemplateDirty = () => {
  editTemplateStatus.value = {
    icon: "edit",
    text: "存在未保存更改",
  };
};

const pushToast = ({ title, message, icon = "check_circle" }) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  toasts.value.push({ id, title, message, icon });
  window.setTimeout(() => {
    const index = toasts.value.findIndex((item) => item.id === id);
    if (index >= 0) {
      toasts.value.splice(index, 1);
    }
  }, 2600);
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

const openRoleMatrixModal = () => {
  modalState.roleMatrix = true;
};

const openEditTemplateModal = () => {
  modalState.editTemplate = true;
};

const openCreateTemplateModal = () => {
  resetCreateTemplateForm();
  modalState.createTemplate = true;
};

const closeModal = (key) => {
  modalState[key] = false;
};

const closeAllModals = () => {
  modalState.roleMatrix = false;
  modalState.editTemplate = false;
  modalState.createTemplate = false;
};

const selectEditTemplate = (key) => {
  editTemplateKey.value = key;
  assignEditTemplate(cloneTemplate(templateLibrary[key]));
  setEditTemplateSynced();
};

const toggleArrayItem = (source, key) => {
  const index = source.indexOf(key);
  if (index >= 0) {
    source.splice(index, 1);
  } else {
    source.push(key);
  }
};

const toggleEditChip = (group, key) => {
  toggleArrayItem(editTemplateForm[group], key);
  markEditTemplateDirty();
};

const toggleCreateChip = (group, key) => {
  toggleArrayItem(createTemplateForm[group], key);
};

const handleExportMatrix = () => {
  emit("export-matrix");
  pushToast({
    title: "矩阵导出任务已创建",
    message: "角色功能矩阵将按当前视图导出为 PDF 草稿。",
    icon: "download",
  });
};

const handleEditTemplateSave = () => {
  templateLibrary[editTemplateKey.value] = cloneTemplate(editTemplateForm);
  editTemplateStatus.value = {
    icon: "task_alt",
    text: "模板已保存",
  };
  emit("save-template", {
    key: editTemplateKey.value,
    template: cloneTemplate(editTemplateForm),
  });
  pushToast({
    title: "模板已保存",
    message: `${editTemplateForm.title || templateLibrary[editTemplateKey.value].title} 已更新到角色配置草稿。`,
    icon: "task_alt",
  });
};

const handleEditTemplateSaveAs = () => {
  emit("save-template-as", {
    key: editTemplateKey.value,
    template: cloneTemplate(editTemplateForm),
  });
  pushToast({
    title: "已另存为新模板",
    message: `${editTemplateForm.title || templateLibrary[editTemplateKey.value].title} 副本已生成，可继续修改。`,
    icon: "content_copy",
  });
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

const handleCreateTemplateSave = () => {
  if (!validateCreateTemplate()) {
    return;
  }

  emit("create-template", cloneTemplate(createTemplateForm));
  pushToast({
    title: "模板已保存",
    message: `${createTemplateForm.title} 已添加到角色配置草稿。`,
    icon: "task_alt",
  });
  closeModal("createTemplate");
};

const handleCreateTemplateSaveAs = () => {
  if (!validateCreateTemplate()) {
    return;
  }

  emit("create-template-as", cloneTemplate(createTemplateForm));
  pushToast({
    title: "已另存为新模板",
    message: `${createTemplateForm.title} 副本已生成，可继续修改。`,
    icon: "content_copy",
  });
  closeModal("createTemplate");
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
};

onMounted(() => {
  selectEditTemplate("pm");
  resetCreateTemplateForm();
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style>

.admin-roles-page {
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

.admin-roles-page .app-shell {
  min-height: 100vh;
}
</style>
