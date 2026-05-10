<template>
  <!-- 来源页面：settings.html -->
  <div class="settings-page">
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="brand-box">
          <div class="brand-icon">
            <span class="material-symbols-outlined">science</span>
          </div>
          <div>
            <h1 class="brand-title">R&D 系统</h1>
            <p class="brand-subtitle">AI 驱动型协作平台</p>
          </div>
        </div>

        <!-- TODO: 对接保存设置接口 -->
        <button class="sidebar-primary-cta" type="button" @click="handleSaveSettings">
          <span class="material-symbols-outlined">save</span>
          保存设置
        </button>

        <!-- TODO: 接入 Vue Router 后统一替换为 RouterLink 或 router.push -->
        <nav class="sidebar-nav">
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')">
            <span class="material-symbols-outlined">dashboard</span>
            <span>全局工作台</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')">
            <span class="material-symbols-outlined">account_tree</span>
            <span>项目列表</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')">
            <span class="material-symbols-outlined">space_dashboard</span>
            <span>个人工作台</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/reports')">
            <span class="material-symbols-outlined">query_stats</span>
            <span>全局报表</span>
          </a>
          <a class="nav-item active" href="#" @click.prevent="handleNavigate('/settings')">
            <span class="material-symbols-outlined">settings</span>
            <span>系统设置</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')">
            <span class="material-symbols-outlined">admin_panel_settings</span>
            <span>后台管理</span>
          </a>
        </nav>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">系统设置</h2>
            <div class="topbar-breadcrumb">
              <span>个人</span>
              <span>/</span>
              <span>设置</span>
            </div>
          </div>
        </div>
        <div class="topbar-right">
          <!-- TODO: 对接设置项搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索设置项、通知或安全策略..."
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
          <button class="icon-btn" type="button" data-ai-toggle @click="openAiDrawer">
            <span class="material-symbols-outlined">auto_awesome</span>
          </button>
          <UserProfileHoverCard :user="currentUser" />
        </div>
      </header>

      <main class="app-content">
        <div class="page-stack">
          <div class="page-header">
            <div>
              <h1 class="page-title">系统设置</h1>
              <p class="page-subtitle">
                采用分组设置卡组织个人资料、通知偏好与账户安全，装饰最少，以表单清晰为主。
              </p>
            </div>
            <div class="page-actions">
              <!-- TODO: 对接恢复默认设置接口 -->
              <button class="btn-secondary" type="button" @click="handleResetSettings">恢复默认</button>
              <!-- TODO: 对接保存设置接口 -->
              <button class="btn-primary" type="button" @click="handleSaveSettings">保存修改</button>
            </div>
          </div>

          <section class="settings-layout">
            <aside class="settings-nav glass-panel">
              <a class="subnav-link" :class="{ active: activeTab === 'profile' }" href="#" @click.prevent="activeTab = 'profile'">个人资料</a>
              <a class="subnav-link" :class="{ active: activeTab === 'notification' }" href="#" @click.prevent="activeTab = 'notification'">通知偏好</a>
              <a class="subnav-link" :class="{ active: activeTab === 'security' }" href="#" @click.prevent="activeTab = 'security'">账户安全</a>
              <a class="subnav-link" :class="{ active: activeTab === 'ai' }" href="#" @click.prevent="activeTab = 'ai'">AI 偏好</a>
            </aside>

            <div class="settings-panel">
              <!-- 个人资料 -->
              <article v-show="activeTab === 'profile'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">个人资料</h2>
                  <span class="section-caption">修改基础信息</span>
                </div>
                <div class="field-inline">
                  <div class="field-stack">
                    <label class="field-label">姓名</label>
                    <div class="field-input">
                      <input v-model="profileForm.name" />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">部门</label>
                    <div class="field-input">
                      <input v-model="profileForm.department" />
                    </div>
                  </div>
                </div>
                <div class="field-inline" style="margin-top: 16px;">
                  <div class="field-stack">
                    <label class="field-label">邮箱</label>
                    <div class="field-input">
                      <input v-model="profileForm.email" />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">手机号</label>
                    <div class="field-input">
                      <input v-model="profileForm.phone" />
                    </div>
                  </div>
                </div>
              </article>

              <!-- 通知偏好 -->
              <article v-show="activeTab === 'notification'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">通知偏好</h2>
                  <span class="section-caption">站内 / 邮件 / 企微</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>任务状态变更</strong>
                      <span>任务完成、阻塞、待评审时提醒我</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.taskStatus }"
                      type="button"
                      :aria-pressed="notificationPrefs.taskStatus ? 'true' : 'false'"
                      @click="togglePref('taskStatus')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>日志互动</strong>
                      <span>有人评论或点赞日志时提醒我</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.logFeedback }"
                      type="button"
                      :aria-pressed="notificationPrefs.logFeedback ? 'true' : 'false'"
                      @click="togglePref('logFeedback')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>报表订阅</strong>
                      <span>接收定时周报和项目报表</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.reportSubscription }"
                      type="button"
                      :aria-pressed="notificationPrefs.reportSubscription ? 'true' : 'false'"
                      @click="togglePref('reportSubscription')"
                    ></button>
                  </div>
                </div>
              </article>

              <!-- 账户安全 -->
              <article v-show="activeTab === 'security'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">账户安全</h2>
                  <span class="section-caption">密码与会话管理</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>修改密码</strong>
                      <span>上次修改时间：2026-03-12</span>
                    </div>
                    <!-- TODO: 对接修改密码流程 -->
                    <button class="btn-chip active" type="button" @click="handleSecurityAction('password')">操作</button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>设备会话</strong>
                      <span>当前有 3 个登录设备</span>
                    </div>
                    <!-- TODO: 对接设备会话管理流程 -->
                    <button class="btn-chip" type="button" @click="handleSecurityAction('session')">查看</button>
                  </div>
                </div>
              </article>

              <!-- AI 偏好 -->
              <article v-show="activeTab === 'ai'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">AI 偏好</h2>
                  <span class="section-caption">智能助手设置</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>AI 助手自动总结</strong>
                      <span>每日自动总结项目进展和待办事项</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.autoSummary }"
                      type="button"
                      :aria-pressed="aiPrefs.autoSummary ? 'true' : 'false'"
                      @click="toggleAiPref('autoSummary')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>智能排期建议</strong>
                      <span>AI 根据项目状态提供优化建议</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.scheduling }"
                      type="button"
                      :aria-pressed="aiPrefs.scheduling ? 'true' : 'false'"
                      @click="toggleAiPref('scheduling')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>风险预警</strong>
                      <span>自动识别项目风险并预警</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.riskAlert }"
                      type="button"
                      :aria-pressed="aiPrefs.riskAlert ? 'true' : 'false'"
                      @click="toggleAiPref('riskAlert')"
                    ></button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>

    <button class="floating-ai-btn" type="button" data-ai-toggle @click="openAiDrawer">
      <span class="material-symbols-outlined">auto_awesome</span>
    </button>

    <!-- Toast 提示 -->
    <div v-if="showToast" class="toast-stack">
      <div class="toast-card">
        <span class="material-symbols-outlined">check_circle</span>
        <div class="toast-body">
          <strong>操作成功</strong>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
    <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" data-ai-overlay @click="closeAiDrawer"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }" data-ai-drawer>
      <div class="ai-header">
        <div>
          <h3>AI 助手</h3>
          <p class="section-caption">当前上下文：系统设置</p>
        </div>
        <button class="icon-btn" type="button" data-ai-close @click="closeAiDrawer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="ai-card">
        <h4>偏好建议</h4>
        <p>你当前同时开启了任务和日志通知，建议保留站内提醒并关闭邮件提醒，减少高频干扰。</p>
        <div class="ai-actions">
          <!-- TODO: 对接 AI 偏好建议采纳流程 -->
          <button class="btn-primary" type="button" @click="handleAcceptAiSuggestion">采纳建议</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import UserProfileHoverCard from "../components/topbar/UserProfileHoverCard.vue";

const router = useRouter();

defineOptions({
  name: "SettingsPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "save-settings",
  "reset-settings",
  "security-action",
  "accept-ai-suggestion",
]);

const keyword = ref("");
const isAiDrawerOpen = ref(false);
const activeTab = ref("profile"); // profile, notification, security, ai
const toastMessage = ref("");
const showToast = ref(false);

const currentUser = {
  name: "张工",
  role: "研发总监",
  avatar: "https://i.pravatar.cc/80?img=12",
};

const defaultProfileForm = {
  name: "张工",
  department: "研发中心",
  email: "zhang@example.com",
  phone: "138****7788",
};

const defaultNotificationPrefs = {
  taskStatus: true,
  logFeedback: true,
  reportSubscription: false,
};

const defaultAiPrefs = {
  autoSummary: true,
  scheduling: true,
  riskAlert: false,
};

// 从 localStorage 加载保存的设置，若无则使用默认值
const loadSettings = () => {
  const savedSettings = localStorage.getItem('app-settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
  }
  return null;
};

const savedSettings = loadSettings();

const profileForm = reactive(savedSettings?.profile ? { ...savedSettings.profile } : { ...defaultProfileForm });
const notificationPrefs = reactive(savedSettings?.notifications ? { ...savedSettings.notifications } : { ...defaultNotificationPrefs });
const aiPrefs = reactive(savedSettings?.aiPrefs ? { ...savedSettings.aiPrefs } : { ...defaultAiPrefs });

const buildSettingsPayload = () => ({
  profile: { ...profileForm },
  notifications: { ...notificationPrefs },
  aiPrefs: { ...aiPrefs },
});

const handleNavigate = (path) => {
  router.push(path);
};

const handleOpenNotifications = () => {
  emit("open-notifications");
};

const handleOpenAppSwitcher = () => {
  emit("open-app-switcher");
};

const openAiDrawer = () => {
  isAiDrawerOpen.value = true;
  emit("open-ai-drawer");
};

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false;
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
};

const togglePref = (key) => {
  notificationPrefs[key] = !notificationPrefs[key];
};

const toggleAiPref = (key) => {
  aiPrefs[key] = !aiPrefs[key];
};

// TODO: Connect the save settings API.
const handleSaveSettings = () => {
  const payload = buildSettingsPayload();
  // 保存到 localStorage
  localStorage.setItem('app-settings', JSON.stringify(payload));
  emit("save-settings", payload);
  showToastMessage("设置已保存");
};

// TODO: Connect the reset settings API.
const handleResetSettings = () => {
  Object.assign(profileForm, defaultProfileForm);
  // 将所有通知偏好设置为关闭（变暗）
  notificationPrefs.taskStatus = false;
  notificationPrefs.logFeedback = false;
  notificationPrefs.reportSubscription = false;
  // 将所有 AI 偏好设置为关闭（变暗）
  aiPrefs.autoSummary = false;
  aiPrefs.scheduling = false;
  aiPrefs.riskAlert = false;
  // 自动保存
  emit("reset-settings", buildSettingsPayload());
  handleSaveSettings();
};

const handleSecurityAction = (action) => {
  emit("security-action", action);
};

// TODO: Connect the AI preference suggestion workflow.
const handleAcceptAiSuggestion = () => {
  emit("accept-ai-suggestion");
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeAiDrawer();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style>

.settings-page {
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

.settings-page .app-shell {
  min-height: 100vh;
}
</style>
