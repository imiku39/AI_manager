<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div>
          <h1 class="brand-title">R&D 系统</h1>
          <p class="brand-subtitle">AI 驱动型协作平台</p>
        </div>
      </div>
      <button class="sidebar-primary-cta"><span class="material-symbols-outlined">download</span>导出全局报表</button>
      <nav class="sidebar-nav">
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/reports')"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/settings')"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></a>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <div>
          <h2 class="topbar-title">全局报表</h2>
          <div class="topbar-breadcrumb">
            <span>报表</span>
            <span>/</span>
            <span>全局汇总</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、成员、图表..." />
        </label>
        <a class="icon-btn notification-link" href="#" @click.prevent="handleNavigate('/notifications')" aria-label="打开通知中心"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></a>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">全局报表</h1>
            <p class="page-subtitle">相比项目级报表，这里更偏跨项目对比、管理趋势和多项目 AI 洞察。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary">跨项目筛选</button>
            <button class="btn-primary">定时订阅</button>
          </div>
        </div>

        <section class="summary-card glass-panel">
          <div class="summary-content">
            <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>管理视角 AI 洞察</span>
            <h2 class="section-title" style="font-size:32px; margin-top:18px;">本周团队整体效率提升 9%，但 3 个项目共享同一 QA 资源，存在下周资源冲突风险。</h2>
            <p class="page-subtitle" style="margin-top:14px;">建议从全局层面优先平衡 QA 资源窗口，并提前对“联调验证”“自动化巡检”和“协议升级”三条线做时间切分。</p>
            <div class="ai-actions" style="margin-top:20px;">
              <button class="btn-primary">生成周报</button>
              <button class="btn-secondary">导出 CSV</button>
            </div>
          </div>
        </section>

        <section class="grid-2">
          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">项目健康度分布</h2>
              <span class="section-caption">按项目统计</span>
            </div>
            <div class="bar-chart">
              <div class="bar-item">
                <div class="bar-track"><div class="bar-fill" style="height:85%; background: linear-gradient(180deg,#38c59b,var(--color-secondary-600));"></div></div>
                <span>核心实验室</span>
              </div>
              <div class="bar-item">
                <div class="bar-track"><div class="bar-fill" style="height:44%; background: linear-gradient(180deg,#f7c455,var(--color-warning-600));"></div></div>
                <span>材料迭代</span>
              </div>
              <div class="bar-item">
                <div class="bar-track"><div class="bar-fill" style="height:18%; background: linear-gradient(180deg,#f36b63,var(--color-danger-600));"></div></div>
                <span>协议升级</span>
              </div>
              <div class="bar-item">
                <div class="bar-track"><div class="bar-fill" style="height:66%; background: linear-gradient(180deg,#a871ff,var(--color-tertiary-600));"></div></div>
                <span>自动化平台</span>
              </div>
            </div>
          </div>

          <div class="chart-card glass-panel">
            <div class="chart-header">
              <h2 class="section-title">成员负载分布</h2>
              <span class="section-caption">跨项目资源</span>
            </div>
            <div class="mini-bars">
              <div class="mini-bar-row">
                <span>QA 资源</span>
                <div class="progress-track"><div class="progress-fill" style="width:89%; background: linear-gradient(90deg,#f36b63,var(--color-danger-600));"></div></div>
                <strong>89%</strong>
              </div>
              <div class="mini-bar-row">
                <span>平台组</span>
                <div class="progress-track"><div class="progress-fill" style="width:78%; background: linear-gradient(90deg,#f7c455,var(--color-warning-600));"></div></div>
                <strong>78%</strong>
              </div>
              <div class="mini-bar-row">
                <span>材料组</span>
                <div class="progress-track"><div class="progress-fill" style="width:62%; background: linear-gradient(90deg,var(--color-primary-400),var(--color-primary-700));"></div></div>
                <strong>62%</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <button class="floating-ai-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
  <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" @click="closeAiDrawer"></div>
  <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }">
    <div class="ai-header">
      <div>
        <h3>AI 助手</h3>
        <p class="section-caption">当前上下文：全局报表</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>全局建议</h4>
      <p>建议从下周一开始冻结 QA 的跨项目时段，避免 3 个高优先级项目在同一时间抢占验证资源。</p>
      <div class="ai-actions">
        <button class="btn-primary">生成管理周报</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pushAppPath } from '../utils/navigation'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const router = useRouter()
const currentUser = {
  name: '张工',
  role: '研发总监',
  avatar: 'https://i.pravatar.cc/80?img=12'
}

const isAiDrawerOpen = ref(false)

const handleNavigate = (path) => {
  pushAppPath(router, path)
}

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
}

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false
}
</script>
