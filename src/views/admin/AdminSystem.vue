<template>
  <!-- 来源页面：admin-system.html -->
  <div class="admin-system-page">
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

        <!-- TODO: 对接后台系统配置保存接口 -->
        <button class="sidebar-primary-cta" type="button" @click="handleSaveConfig">
          <span class="material-symbols-outlined">save</span>
          保存配置
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
            <h2 class="topbar-title">系统配置</h2>
            <div class="topbar-breadcrumb">
              <span>后台管理</span>
              <span>/</span>
              <span>系统配置</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- TODO: 对接系统配置全局搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="topbarKeyword"
              type="text"
              placeholder="搜索配置项、策略或通知通道..."
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
              <h1 class="page-title">系统配置</h1>
              <p class="page-subtitle">
                系统全局配置页延续设置页模式，但信息更偏平台规则、通知通道和安全策略。
              </p>
            </div>
            <div class="page-actions">
              <!-- TODO: 对接恢复默认配置接口或统一配置中心默认值 -->
              <button class="btn-secondary" type="button" @click="handleResetToDefault">
                <span class="material-symbols-outlined">restart_alt</span>
                恢复默认
              </button>

              <!-- TODO: 对接后台系统配置保存接口 -->
              <button class="btn-primary" type="button" @click="handleSaveConfig">
                <span class="material-symbols-outlined">save</span>
                保存配置
              </button>
            </div>
          </div>

          <section class="settings-panel">
            <article
              v-for="section in settingSections"
              :key="section.key"
              class="settings-card glass-panel"
            >
              <div class="settings-card-head">
                <h2 class="section-title">{{ section.title }}</h2>
                <span class="section-caption">{{ section.caption }}</span>
              </div>

              <div class="settings-list">
                <div v-for="item in section.items" :key="item.key" class="settings-row">
                  <div>
                    <strong>{{ item.label }}</strong>
                    <span>{{ item.description }}</span>
                  </div>
                  <button
                    class="toggle"
                    :class="{ on: settingState[item.key] }"
                    type="button"
                    :aria-label="item.label"
                    :aria-pressed="settingState[item.key] ? 'true' : 'false'"
                    data-switch-control
                    data-switch-group="admin-system"
                    :data-switch-label="item.label"
                    @click="toggleSetting(item.key)"
                  ></button>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>

    <div v-if="showSuccessToast" class="success-toast" role="status" aria-live="polite">
      <span class="material-symbols-outlined">check_circle</span>
      <span>{{ successToastMessage }}</span>
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
  name: "AdminSystemPage",
});

const emit = defineEmits([
  "navigate",
  "save-config",
  "reset-config",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
]);

const STORAGE_KEY = "systemConfig";
const topbarKeyword = ref("");
const showSuccessToast = ref(false);
const successToastMessage = ref("\u914d\u7f6e\u6210\u529f");

let toastTimer = null;

const currentUser = {
  name: "\u7cfb\u7edf\u7ba1\u7406\u5458",
  role: "\u5e73\u53f0\u89d2\u8272\uff1aAdmin",
  avatar: "https://i.pravatar.cc/80?img=5",
};

const sidebarNavItems = [
  { label: "管理首页", icon: "grid_view", path: "/admin", active: false },
  { label: "用户管理", icon: "group", path: "/admin/users", active: false },
  { label: "角色管理", icon: "badge", path: "/admin/roles", active: false },
  { label: "审计日志", icon: "receipt_long", path: "/admin/logs", active: false },
  { label: "系统配置", icon: "settings", path: "/admin/system", active: true },
];

const settingSections = [
  {
    key: "notice",
    title: "\u901a\u77e5\u901a\u9053",
    caption: "\u7ad9\u5185 / \u90ae\u4ef6 / \u4f01\u5fae / \u9489\u9489",
    items: [
      {
        key: "siteNotice",
        label: "\u7ad9\u5185\u901a\u77e5",
        description: "\u5168\u5c40\u9ed8\u8ba4\u5f00\u542f",
      },
      {
        key: "wecomPush",
        label: "\u4f01\u4e1a\u5fae\u4fe1\u63a8\u9001",
        description: "\u4efb\u52a1\u963b\u585e\u3001\u8bc4\u8bba\u3001\u62a5\u8868\u8ba2\u9605",
      },
      {
        key: "emailSubscription",
        label: "\u90ae\u4ef6\u8ba2\u9605",
        description: "\u5468\u62a5\u3001\u5bfc\u51fa\u62a5\u8868\u3001\u5ba1\u8ba1\u544a\u8b66",
      },
    ],
  },
  {
    key: "security",
    title: "\u5b89\u5168\u7b56\u7565",
    caption: "CSRF / \u5ba1\u8ba1 / \u8131\u654f",
    items: [
      {
        key: "auditTrail",
        label: "\u654f\u611f\u64cd\u4f5c\u5ba1\u8ba1",
        description: "\u5220\u9664\u3001\u5f52\u6863\u3001\u89d2\u8272\u53d8\u66f4\u3001\u6a21\u677f\u4fee\u6539",
      },
      {
        key: "maskSensitiveData",
        label: "\u654f\u611f\u6570\u636e\u8131\u654f\u663e\u793a",
        description: "\u624b\u673a\u53f7\u3001\u90ae\u7bb1\u9ed8\u8ba4\u90e8\u5206\u9690\u85cf",
      },
    ],
  },
];

const initialSettingState = {
  siteNotice: true,
  wecomPush: true,
  emailSubscription: false,
  auditTrail: true,
  maskSensitiveData: true,
};

const resetSettingState = {
  siteNotice: true,
  wecomPush: false,
  emailSubscription: false,
  auditTrail: true,
  maskSensitiveData: false,
};

// TODO: Connect the config load API and hydrate the local state from the response.
const settingState = reactive({ ...initialSettingState });

const buildConfigPayload = () => ({ ...settingState });

const applySettingState = (source) => {
  Object.keys(source).forEach((key) => {
    settingState[key] = source[key];
  });
};

const persistLocalConfig = (payload) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const loadLocalConfig = () => {
  if (typeof window === "undefined") {
    return;
  }

  const savedConfig = window.localStorage.getItem(STORAGE_KEY);
  if (!savedConfig) {
    return;
  }

  try {
    const parsedConfig = JSON.parse(savedConfig);
    Object.keys(initialSettingState).forEach((key) => {
      if (typeof parsedConfig[key] === "boolean") {
        settingState[key] = parsedConfig[key];
      }
    });
  } catch (error) {
    console.error("Failed to parse local system config.", error);
  }
};

const showToast = (message) => {
  successToastMessage.value = message;
  showSuccessToast.value = true;

  if (toastTimer !== null) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    showSuccessToast.value = false;
    toastTimer = null;
  }, 2000);
};

const toggleSetting = (key) => {
  settingState[key] = !settingState[key];
};

const handleNavigate = (path) => {
  pushAppPath(router, path);
};

// TODO: Connect the config save API.
const handleSaveConfig = () => {
  const payload = buildConfigPayload();
  persistLocalConfig(payload);
  emit("save-config", payload);
  showToast("\u914d\u7f6e\u6210\u529f");
};

// TODO: Connect the reset-to-default API or shared config defaults.
const handleResetToDefault = () => {
  applySettingState(resetSettingState);
  const payload = buildConfigPayload();
  persistLocalConfig(payload);
  emit("reset-config", payload);
  showToast("\u5df2\u6062\u590d\u9ed8\u8ba4\u914d\u7f6e");
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

onMounted(() => {
  loadLocalConfig();
});

onBeforeUnmount(() => {
  if (toastTimer !== null) {
    window.clearTimeout(toastTimer);
  }
});
</script>

<style>

.admin-system-page {
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

.admin-system-page .app-shell {
  min-height: 100vh;
}

.success-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 10000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  color: #fff;
  background: #10b981;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 500;
}
</style>
