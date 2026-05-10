<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div><h1 class="brand-title">R&D 系统</h1><p class="brand-subtitle">AI 驱动型协作平台</p></div>
      </div>
      <button class="sidebar-primary-cta" type="button"><span class="material-symbols-outlined">edit_square</span>编辑项目</button>
      <nav class="sidebar-nav">
        <router-link class="nav-item" to="/dashboard"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></router-link>
        <router-link class="nav-item active" to="/projects"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></router-link>
        <router-link class="nav-item" to="/workbench"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></router-link>
        <router-link class="nav-item" to="/reports"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></router-link>
        <router-link class="nav-item" to="/settings"><span class="material-symbols-outlined">settings</span><span>系统设置</span></router-link>
        <router-link class="nav-item" to="/admin"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></router-link>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <button class="topbar-back-btn" type="button" @click="goBack"><span class="material-symbols-outlined">arrow_back_ios_new</span><span class="topbar-back-label">返回</span></button>
        <div>
          <h2 class="topbar-title">项目详情</h2>
          <div class="topbar-breadcrumb"><span>项目</span><span>/</span><span>{{ project.name }}</span><span>/</span><span>{{ tabLabelMap[currentTab] }}</span></div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell"><span class="material-symbols-outlined">search</span><input type="text" placeholder="搜索任务、里程碑或成员..." /></label>
        <button class="icon-btn notification-link" type="button"><span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span></button>
        <UserProfileHoverCard :user="currentUser" />
      </div>
    </header>

    <main class="app-content">
      <div class="page-stack">
        <div class="page-header">
          <div>
            <h1 class="page-title">项目详情</h1>
            <p class="page-subtitle">聚合项目状态、成员协作、任务流转、排期风险与报表数据，作为项目总工作区入口。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary"><span class="material-symbols-outlined">archive</span>归档项目</button>
            <button class="btn-primary"><span class="material-symbols-outlined">track_changes</span>设置基线</button>
          </div>
        </div>

        <section class="summary-card glass-panel">
          <div class="summary-content">
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
              <span class="pill pill-success">进行中</span>
              <span class="pill pill-ai">需求迭代模板</span>
            </div>
            <h2 class="page-title" style="margin-top:18px;">{{ project.name }}</h2>
            <p class="page-subtitle" style="max-width:880px;">{{ project.desc }}</p>
            <div class="summary-kpis">
              <div class="summary-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
              <div class="summary-kpi"><span>时间范围</span><strong>{{ project.range }}</strong></div>
              <div class="summary-kpi"><span>项目进度</span><strong>{{ project.progress }}%</strong></div>
              <div class="summary-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              <div class="summary-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
            </div>
            <!-- TODO(API): 项目基础信息需接项目详情查询接口 -->
          </div>
        </section>

        <nav class="subnav-bar glass-panel">
          <router-link class="subnav-link" :class="{ active: currentTab === 'overview' }" :to="tabRoute('overview')">概览</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'members' }" :to="tabRoute('members')">成员</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'kanban' }" :to="tabRoute('kanban')">项目看板</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'gantt' }" :to="tabRoute('gantt')">项目甘特图</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'risk' }" :to="tabRoute('risk')">风险看板</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'reports' }" :to="tabRoute('reports')">报表</router-link>
          <router-link class="subnav-link" :class="{ active: currentTab === 'docs' }" :to="tabRoute('docs')">文档</router-link>
        </nav>

        <section v-if="currentTab === 'overview'" class="grid-2-1">
          <div class="glass-panel" style="padding:24px;border-radius:24px;">
            <h2 class="section-title">里程碑与进展摘要</h2>
            <div class="timeline" style="margin-top:18px;">
              <div class="timeline-item" v-for="item in milestones" :key="item.id"><span class="timeline-dot" :style="{ background: item.color }"></span><div class="timeline-body"><h4>{{ item.title }}</h4><p>{{ item.desc }}</p></div></div>
            </div>
            <!-- TODO(API): 概览里程碑与偏差预警需接项目分析接口 -->
          </div>
          <div style="display:flex;flex-direction:column;gap:24px;">
            <div class="glass-panel" style="padding:24px;border-radius:24px;"><h2 class="section-title">基线偏差预警</h2><p class="page-subtitle" style="font-size:15px;margin-top:14px;">当前实际进度较最新基线落后 6%，里程碑“联调验证”偏差 2 天。</p></div>
            <div class="glass-panel" style="padding:24px;border-radius:24px;background:linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));"><h2 class="section-title">AI 项目建议</h2><p class="page-subtitle" style="font-size:15px;margin-top:14px;">建议将“数据回灌校验”拆分为独立子任务，并从平台组借调 1 名 QA 参与联调。</p></div>
          </div>
        </section>

        <section v-else-if="currentTab === 'members'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">成员列表</h2>
          <div class="member-table" style="margin-top:16px;">
            <div class="member-row" v-for="member in memberRows" :key="member.id"><div class="member-ident"><img :src="member.avatar" :alt="member.name" /><div><strong>{{ member.name }}</strong><p class="muted">{{ member.role }}</p></div></div><div>{{ member.load }}</div><div>{{ member.dept }}</div><div>{{ member.focus }}</div><div>{{ member.status }}</div><span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span></div>
          </div>
          <!-- TODO(API): 成员邀请、角色调整、组织树检索、负载热力图需接成员与组织接口 -->
        </section>

        <section v-else-if="currentTab === 'kanban'" class="kanban">
          <article class="kanban-column glass-panel" v-for="col in kanbanColumns" :key="col.id">
            <div class="kanban-column-header"><h3>{{ col.name }}</h3><span class="section-caption">{{ col.tasks.length }}</span></div>
            <div class="kanban-card" v-for="task in col.tasks" :key="task.id"><h4>{{ task.title }}</h4><p class="task-note">{{ task.owner }} · {{ task.deadline }}</p></div>
          </article>
          <!-- TODO(API): 看板列、任务卡片、拖拽状态流转需接任务看板接口 -->
        </section>

        <section v-else-if="currentTab === 'gantt'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">项目甘特图</h2>
          <div style="margin-top:16px;display:flex;flex-direction:column;gap:12px;">
            <div v-for="item in ganttItems" :key="item.id" class="mini-bar-row"><span>{{ item.name }}</span><div class="progress-track"><div class="progress-fill" :style="{ width: `${item.progress}%` }"></div></div><strong>{{ item.progress }}%</strong></div>
          </div>
          <!-- TODO(API): 甘特任务排期、基线对比、关键路径需接排期接口 -->
        </section>

        <section v-else-if="currentTab === 'risk'" class="glass-panel" style="padding:24px;border-radius:24px;">
          <h2 class="section-title">风险看板</h2>
          <div class="admin-list" style="margin-top:16px;"><div class="admin-list-item" v-for="risk in risks" :key="risk.id"><div><strong>{{ risk.title }}</strong><span>{{ risk.owner }}</span></div><span class="status-tag" :class="risk.class">{{ risk.status }}</span></div></div>
          <!-- TODO(API): 风险新增、状态流转、责任人分配、AI 根因分析需接风险管理接口 -->
        </section>

        <section v-else-if="currentTab === 'reports'" class="grid-2">
          <article class="chart-card glass-panel"><h3>进度报表</h3><p class="page-subtitle" style="font-size:15px;margin-top:10px;">当前阶段完成率：72%，较上周 +5%。</p></article>
          <article class="chart-card glass-panel"><h3>质量报表</h3><p class="page-subtitle" style="font-size:15px;margin-top:10px;">关键缺陷 3 个，已关闭 2 个。</p></article>
          <!-- TODO(API): 报表筛选、趋势图、导出、订阅下发需接报表统计接口 -->
        </section>

        <section v-else class="doc-grid">
          <article class="doc-card glass-panel" v-for="doc in docs" :key="doc.id"><h3 style="font-size:20px;">{{ doc.title }}</h3><p>{{ doc.desc }}</p></article>
          <!-- TODO(API): 文档列表、版本记录、AI 摘要、新建与编辑动作需接文档中心接口 -->
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const route = useRoute()
const router = useRouter()
const currentTab = 'kanban'

const currentUser = {
  name: '王志强',
  role: '项目负责人',
  avatar: 'https://i.pravatar.cc/80?img=47'
}

const project = ref({
  name: '纳米晶体结构优化',
  owner: '王志强',
  desc: '聚焦晶体结构稳定性与模型预测精度提升，当前处于“联调验证”阶段。项目已建立最新计划基线，整体健康可控。',
  range: '04/14 - 05/16',
  progress: 72,
  health: '良好',
  members: 12
})

const tabLabelMap = {
  overview: '概览',
  members: '成员',
  kanban: '项目看板',
  gantt: '项目甘特图',
  risk: '风险看板',
  reports: '报表',
  docs: '文档'
}

// TODO(API): 项目详情、成员、任务、风险、文档等应由后端聚合接口返回；当前为前端静态占位数据。
const milestones = ref([
  { id: 1, title: '需求评审', desc: '已完成。需求评审结论与实验约束已沉淀到项目文档。', color: 'var(--color-secondary-600)' },
  { id: 2, title: '开发实现', desc: '已完成 90%，剩余性能对齐与异常样本校验。', color: 'var(--color-secondary-600)' },
  { id: 3, title: '联调验证', desc: '相对基线延后 2 天。', color: 'var(--color-warning-600)' }
])

const memberRows = ref([
  { id: 1, name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47', role: '项目负责人', load: '86%', dept: '平台组', focus: '联调推进', status: '在岗' },
  { id: 2, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', role: '平台工程师', load: '74%', dept: '平台组', focus: '回灌链路', status: '在岗' },
  { id: 3, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', role: 'QA', load: '58%', dept: 'QA组', focus: '回归校验', status: '在岗' }
])

const kanbanColumns = ref([
  { id: 'todo', name: '待开始', tasks: [{ id: 1, title: '联调环境参数回灌', owner: '王雅婷', deadline: '05-08' }] },
  { id: 'doing', name: '进行中', tasks: [{ id: 2, title: '回归样本误差校验', owner: '陈思远', deadline: '05-09' }] },
  { id: 'review', name: '待评审', tasks: [{ id: 3, title: '开发任务复盘', owner: '王志强', deadline: '05-10' }] },
  { id: 'done', name: '已完成', tasks: [{ id: 4, title: '需求评审文档沉淀', owner: '王志强', deadline: '04-18' }] }
])

const ganttItems = ref([
  { id: 1, name: '需求评审', progress: 100 },
  { id: 2, name: '开发实现', progress: 90 },
  { id: 3, name: '联调验证', progress: 66 }
])

const risks = ref([
  { id: 1, title: '联调窗口冲突', owner: '王志强', status: '处理中', class: 'warning' },
  { id: 2, title: '测试环境冻结延迟', owner: '王雅婷', status: '待处理', class: 'danger' },
  { id: 3, title: '回灌链路波动', owner: '陈思远', status: '已缓解', class: 'success' }
])

const docs = ref([
  { id: 1, title: '需求评审纪要', desc: '记录需求边界、时间计划和依赖说明，供 PM、研发与 QA 对齐使用。' },
  { id: 2, title: '联调验证说明', desc: '包含当前联调阶段的前置条件、关键风险和任务引用。' },
  { id: 3, title: '回归样本池说明', desc: '当前文档为样式占位，可继续补充样本来源与版本关系。' }
])

const projectId = computed(() => route.params.id || 1)
const tabRoute = (tab) => {
  const id = projectId.value
  if (tab === 'overview') return `/project/${id}`
  return `/project/${id}/${tab}`
}
const goBack = () => router.push('/projects')

// TODO(API): 看板列、任务卡片、拖拽状态流转、任务详情弹窗需接任务看板接口。
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');
@import '../styles/shared.css';

.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }
</style>
