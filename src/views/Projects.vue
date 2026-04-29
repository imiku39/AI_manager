<template>
  <div class="projects-page">
    <div class="page-stack">
      <section class="page-header">
        <div>
          <h1 class="page-title">项目矩阵</h1>
          <p class="page-subtitle">展示所有有权限查看的项目，支持搜索、筛选、排序和快速新建。</p>
        </div>
        <div class="page-actions">
          <div class="member-summary">
            <div class="avatar-stack">
              <img src="https://i.pravatar.cc/80?img=15" alt="成员1" />
              <img src="https://i.pravatar.cc/80?img=32" alt="成员2" />
              <img src="https://i.pravatar.cc/80?img=45" alt="成员3" />
            </div>
            <span class="muted">12 位活跃成员</span>
          </div>
          <button class="btn-primary" type="button" v-permission="'project:create'">
            <span class="material-symbols-outlined">add</span>
            新建项目
          </button>
        </div>
      </section>

      <section class="glass-panel filter-bar">
        <label class="search-shell grow">
          <span class="material-symbols-outlined">search</span>
          <input v-model="searchQuery" type="text" placeholder="按项目名称或关键字筛选..." />
        </label>
        <button class="btn-chip" :class="{ active: !statusFilter }" type="button" @click="cycleStatus">
          <span class="material-symbols-outlined">tune</span>
          {{ statusChipText }}
        </button>
        <button class="btn-chip" :class="{ active: Boolean(ownerFilter) }" type="button" @click="cycleOwner">
          <span class="material-symbols-outlined">person_search</span>
          {{ ownerChipText }}
        </button>
        <button class="btn-chip" :class="{ active: Boolean(tagFilter) }" type="button" @click="cycleTag">
          <span class="material-symbols-outlined">sell</span>
          {{ tagChipText }}
        </button>
        <button class="btn-chip" :class="{ active: sortMode === 'deadline' }" type="button" @click="toggleDeadlineSort">
          <span class="material-symbols-outlined">calendar_today</span>
          截止日期
        </button>
        <button class="btn-chip" :class="{ active: sortMode === 'health' }" type="button" @click="toggleHealthSort">
          <span class="material-symbols-outlined">monitor_heart</span>
          健康度排序
        </button>
        <button class="btn-chip" :class="{ active: sortMode === 'priority' }" type="button" @click="togglePrioritySort">
          <span class="material-symbols-outlined">sort</span>
          权重排序
        </button>
      </section>

      <section class="project-list-wrap">
        <a
          v-for="project in sortedProjects"
          :key="project.idCode"
          class="glass-panel project-row"
          href="#"
          @click.prevent="goToProject(project.routeId)"
        >
          <div class="project-meta">
            <div class="project-title-line">
              <span class="project-dot" :style="{ background: project.dotColor }"></span>
              <h3>{{ project.name }}</h3>
            </div>
            <p>{{ project.department }} · 项目编号：{{ project.idCode }} · 标签：{{ project.tagsDisplay }}</p>
          </div>
          <div>
            <div class="project-progress-head">
              <span class="section-caption">完成度</span>
              <strong :style="{ color: project.progressTextColor }">{{ project.progress }}%</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${project.progress}%`, background: project.progressGradient }"></div>
            </div>
          </div>
          <div>
            <span class="status-tag" :class="project.healthClass">健康度：{{ project.healthLabel }}</span>
            <p class="task-note">状态：{{ project.status }}</p>
          </div>
          <div class="member-chip">
            <img :src="project.ownerAvatar" :alt="project.owner" />
            <div>
              <strong>{{ project.owner }}</strong>
              <span class="section-caption">负责人</span>
            </div>
          </div>
          <div>
            <strong>{{ project.deadline }}</strong>
            <p class="task-note">成员数：{{ project.members }}</p>
          </div>
          <span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span>
        </a>

        <div v-if="!sortedProjects.length" class="glass-panel empty-card">
          <h3>暂无匹配项目</h3>
          <p>请调整筛选条件后重试。</p>
        </div>
      </section>

      <section class="grid-3">
        <div class="glass-panel metric-card">
          <h3>研发预算分配</h3>
          <div class="value budget-value">¥ 12.4M</div>
          <div class="trend budget-trend">+4.2% 较上周</div>
          <div class="progress-track mt18">
            <div class="progress-fill budget-fill"></div>
          </div>
        </div>
        <div class="glass-panel metric-card center">
          <span class="material-symbols-outlined metric-icon rocket">rocket_launch</span>
          <div class="value metric-number">24</div>
          <p class="page-subtitle small">本月新启动实验</p>
        </div>
        <div class="glass-panel metric-card center">
          <span class="material-symbols-outlined metric-icon verified">verified</span>
          <div class="value metric-number">182</div>
          <p class="page-subtitle small">累计专利申请量</p>
        </div>
      </section>
    </div>

    <button class="floating-ai-btn" type="button" @click="toggleAI">
      <span class="material-symbols-outlined">auto_awesome</span>
    </button>

    <aside class="ai-panel" :class="{ open: isAIOpen }">
      <div class="ai-header">
        <div>
          <h3>AI 助手</h3>
          <p class="section-caption">当前上下文：项目矩阵</p>
        </div>
        <button class="icon-btn" type="button" @click="toggleAI"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="ai-card">
        <h4>智能分组建议</h4>
        <p>建议将“量子纠缠通信协议 V2”提升至重点风险视图，并将“深度学习实验室自动化”的联调节点提前 3 天，以降低周四并发评审压力。</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('')
const ownerFilter = ref('')
const tagFilter = ref('')
const sortMode = ref('priority')
const isAIOpen = ref(false)

const projects = ref([
  { routeId: 1, name: '纳米晶体结构优化', department: '材料科学部', idCode: 'RD-2026-089', tags: ['结构迭代', 'AI 预测'], progress: 72, progressTextColor: 'var(--color-primary-700)', progressGradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700))', healthClass: 'success', healthLabel: '良好', status: '进行中', owner: '王志强', ownerAvatar: 'https://i.pravatar.cc/80?img=47', members: 12, deadline: '2026-05-16', dotColor: 'var(--color-primary-600)', priority: 3 },
  { routeId: 4, name: '深度学习实验室自动化', department: '计算物理组', idCode: 'RD-2026-112', tags: ['平台改造', '自动化'], progress: 45, progressTextColor: 'var(--color-tertiary-600)', progressGradient: 'linear-gradient(90deg, #a871ff, var(--color-tertiary-600))', healthClass: 'warning', healthLabel: '风险', status: '进行中', owner: '陈思远', ownerAvatar: 'https://i.pravatar.cc/80?img=22', members: 9, deadline: '2026-05-30', dotColor: 'var(--color-tertiary-600)', priority: 2 },
  { routeId: 3, name: '量子纠缠通信协议 V2', department: '前沿实验室', idCode: 'RD-2025-456', tags: ['协议升级', '高风险'], progress: 15, progressTextColor: 'var(--color-danger-600)', progressGradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', healthClass: 'danger', healthLabel: '严重', status: '已暂停', owner: '林博士', ownerAvatar: 'https://i.pravatar.cc/80?img=11', members: 7, deadline: '2026-06-08', dotColor: 'var(--color-danger-600)', priority: 1 },
  { routeId: 2, name: '生物聚合材料耐久性测试', department: '生物工程组', idCode: 'RD-2026-201', tags: ['性能验证', '已交付'], progress: 100, progressTextColor: 'var(--color-secondary-600)', progressGradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', healthClass: 'success', healthLabel: '完成', status: '已归档', owner: '周雅楠', ownerAvatar: 'https://i.pravatar.cc/80?img=35', members: 5, deadline: '2026-04-18', dotColor: 'var(--color-secondary-600)', priority: 2 }
])

const statusOptions = computed(() => ['', ...new Set(projects.value.map((item) => item.status))])
const ownerOptions = computed(() => ['', ...new Set(projects.value.map((item) => item.owner))])
const tagOptions = computed(() => ['', ...new Set(projects.value.flatMap((item) => item.tags))])

const statusChipText = computed(() => (statusFilter.value ? `状态：${statusFilter.value}` : '全部状态'))
const ownerChipText = computed(() => (ownerFilter.value ? `负责人：${ownerFilter.value}` : '负责人'))
const tagChipText = computed(() => (tagFilter.value ? `标签：${tagFilter.value}` : '标签'))

const cycleValue = (current, options) => {
  const index = options.indexOf(current)
  return index === -1 || index === options.length - 1 ? options[0] : options[index + 1]
}

const cycleStatus = () => {
  statusFilter.value = cycleValue(statusFilter.value, statusOptions.value)
}

const cycleOwner = () => {
  ownerFilter.value = cycleValue(ownerFilter.value, ownerOptions.value)
}

const cycleTag = () => {
  tagFilter.value = cycleValue(tagFilter.value, tagOptions.value)
}

const toggleDeadlineSort = () => {
  sortMode.value = sortMode.value === 'deadline' ? 'default' : 'deadline'
}

const togglePrioritySort = () => {
  sortMode.value = sortMode.value === 'priority' ? 'default' : 'priority'
}

const toggleHealthSort = () => {
  sortMode.value = sortMode.value === 'health' ? 'default' : 'health'
}

const filteredProjects = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  return projects.value.filter((item) => {
    const haystack = [item.name, item.department, item.owner, item.idCode, item.tags.join(' ')].join(' ').toLowerCase()
    const matchKeyword = !keyword || haystack.includes(keyword)
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    const matchOwner = !ownerFilter.value || item.owner === ownerFilter.value
    const matchTag = !tagFilter.value || item.tags.includes(tagFilter.value)
    return matchKeyword && matchStatus && matchOwner && matchTag
  })
})

const sortedProjects = computed(() => {
  const list = filteredProjects.value.map((item) => ({
    ...item,
    tagsDisplay: item.tags.join(' / '),
    deadlineAt: new Date(item.deadline).getTime()
  }))

  if (sortMode.value === 'deadline') return list.sort((a, b) => a.deadlineAt - b.deadlineAt)
  if (sortMode.value === 'health') {
    const healthScoreMap = { 严重: 4, 风险: 3, 良好: 2, 完成: 1 }
    return list.sort((a, b) => (healthScoreMap[b.healthLabel] || 0) - (healthScoreMap[a.healthLabel] || 0))
  }
  if (sortMode.value === 'priority') return list.sort((a, b) => b.priority - a.priority)
  return list
})

const goToProject = (routeId) => {
  router.push(`/project/${routeId}`)
}

const toggleAI = () => {
  isAIOpen.value = !isAIOpen.value
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600&display=swap');

.projects-page {
  --color-primary-700: #0058bd;
  --color-primary-600: #1468c7;
  --color-primary-400: #4f8ff6;
  --color-secondary-600: #148d7b;
  --color-tertiary-600: #7a2fdd;
  --color-danger-600: #d83a34;
  --color-text-primary: #1a1c1e;
  --color-text-secondary: #414754;
  --color-text-tertiary: #727785;
  --color-border-soft: rgba(255, 255, 255, 0.55);
  --shadow-soft: 0 18px 48px rgba(41, 72, 152, 0.08);
  --shadow-hover: 0 22px 56px rgba(41, 72, 152, 0.12);
  --shadow-glow-primary: 0 16px 40px rgba(20, 104, 199, 0.28);
  min-height: 100%;
  padding: 32px;
  color: var(--color-text-primary);
  background:
    radial-gradient(circle at 0% 0%, rgba(173, 198, 255, 0.34) 0, transparent 42%),
    radial-gradient(circle at 100% 0%, rgba(236, 220, 255, 0.34) 0, transparent 42%),
    #f7f8fc;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input {
  font: inherit;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-border-soft);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-soft);
}

.page-stack {
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.page-title {
  margin: 0;
  font-size: 40px;
  line-height: 1.08;
  font-weight: 700;
}

.page-subtitle {
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  font-size: 18px;
}

.page-subtitle.small {
  font-size: 14px;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.member-summary {
  padding: 10px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.52);
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-stack img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  margin-left: -8px;
  object-fit: cover;
}

.avatar-stack img:first-child {
  margin-left: 0;
}

.muted {
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.filter-bar {
  padding: 16px;
  border-radius: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.search-shell {
  min-width: 320px;
  height: 46px;
  border-radius: 999px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.62);
}

.search-shell input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
}

.search-shell.grow {
  flex: 1;
  min-width: 260px;
  margin-right: auto;
}

.btn-primary,
.btn-chip {
  border: 0;
  cursor: pointer;
}

.btn-primary {
  min-height: 48px;
  padding: 0 22px;
  border-radius: 24px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  box-shadow: var(--shadow-glow-primary);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-chip {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-chip.active {
  background: rgba(20, 104, 199, 0.12);
  color: var(--color-primary-700);
}

.project-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-row {
  display: grid;
  grid-template-columns: minmax(250px, 1.2fr) minmax(220px, 0.8fr) 180px 180px 160px 52px;
  gap: 20px;
  align-items: center;
  padding: 24px 26px;
  border-radius: 24px;
}

.project-row:hover {
  transform: translateX(3px);
  box-shadow: var(--shadow-hover);
}

.project-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-title-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-title-line h3,
.project-meta p {
  margin: 0;
}

.project-meta p {
  color: var(--color-text-tertiary);
}

.project-progress-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-caption {
  color: var(--color-text-tertiary);
  font-size: 12px;
}

.progress-track {
  height: 9px;
  border-radius: 999px;
  background: rgba(216, 221, 232, 0.7);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

.status-tag {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-tag::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-tag.success {
  color: var(--color-secondary-600);
  background: rgba(156, 239, 219, 0.22);
  border-color: rgba(20, 141, 123, 0.22);
}

.status-tag.warning {
  color: #ab7300;
  background: rgba(252, 230, 176, 0.62);
  border-color: rgba(240, 161, 26, 0.2);
}

.status-tag.danger {
  color: var(--color-danger-600);
  background: rgba(255, 218, 214, 0.72);
  border-color: rgba(216, 58, 52, 0.18);
}

.task-note {
  margin: 8px 0 0;
  color: var(--color-text-tertiary);
  font-size: 12px;
}

.member-chip {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-chip img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  object-fit: cover;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.26);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.metric-card {
  padding: 24px;
  border-radius: 24px;
}

.metric-card h3 {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.value {
  margin-top: 18px;
  font-size: 48px;
  line-height: 1;
  font-weight: 800;
}

.trend {
  margin-top: 18px;
  font-size: 13px;
  font-weight: 700;
}

.budget-value {
  font-size: 38px;
  color: var(--color-primary-700);
}

.budget-trend {
  color: var(--color-secondary-600);
}

.budget-fill {
  width: 60%;
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));
}

.mt18 {
  margin-top: 18px;
}

.center {
  text-align: center;
}

.metric-icon {
  font-size: 48px;
}

.metric-icon.rocket {
  color: var(--color-tertiary-600);
}

.metric-icon.verified {
  color: var(--color-secondary-600);
}

.metric-number {
  font-size: 46px;
}

.empty-card {
  padding: 36px 28px;
  text-align: center;
  border-radius: 24px;
}

.empty-card h3,
.empty-card p {
  margin: 0;
}

.empty-card p {
  margin-top: 10px;
  color: var(--color-text-secondary);
}

.floating-ai-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  width: 62px;
  height: 62px;
  border: 0;
  border-radius: 24px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #6c41ff, #1468c7);
  box-shadow: 0 24px 60px rgba(79, 97, 244, 0.34);
  cursor: pointer;
}

.ai-panel {
  position: fixed;
  right: 24px;
  bottom: 100px;
  z-index: 39;
  width: min(420px, calc(100vw - 48px));
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(27, 40, 87, 0.2);
  transform: translateY(20px) scale(0.98);
  opacity: 0;
  pointer-events: none;
  transition: all 220ms ease;
}

.ai-panel.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.ai-header h3,
.ai-header p {
  margin: 0;
}

.ai-card {
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(236, 220, 255, 0.42), rgba(255, 255, 255, 0.74));
  border: 1px solid rgba(122, 47, 221, 0.14);
}

.ai-card h4,
.ai-card p {
  margin: 0;
}

.ai-card p {
  margin-top: 8px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

@media (max-width: 1439px) {
  .project-row {
    grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.8fr) 160px 150px 140px 44px;
  }
}

@media (max-width: 1279px) {
  .projects-page {
    padding: 24px;
  }

  .grid-3,
  .project-row {
    grid-template-columns: 1fr;
  }

  .project-row {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .projects-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-shell,
  .search-shell.grow {
    min-width: 0;
  }
}
</style>
