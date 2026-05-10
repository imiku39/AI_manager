<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand-box">
        <div class="brand-icon"><span class="material-symbols-outlined">science</span></div>
        <div><h1 class="brand-title">R&D 系统</h1><p class="brand-subtitle">AI 驱动型协作平台</p></div>
      </div>
      <button class="sidebar-primary-cta" type="button" @click="isEditModalOpen = true">
        <span class="material-symbols-outlined">edit_square</span>编辑项目
      </button>
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
        <button class="topbar-back-icon" type="button" @click="goBack">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 class="topbar-title">项目详情</h2>
          <div class="topbar-breadcrumb">
            <span>项目</span><span>/</span><span>{{ project.name }}</span><span>/</span><span>{{ tabLabel }}</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell"><span class="material-symbols-outlined">search</span><input type="text" placeholder="搜索任务、里程碑或成员..." /></label>
        <router-link class="icon-btn notification-link" to="/notifications" aria-label="打开通知中心">
          <span class="material-symbols-outlined">notifications</span><span class="notification-badge">5</span>
        </router-link>
        <button class="icon-btn"><span class="material-symbols-outlined">apps</span></button>
        <button class="icon-btn" @click="isAiDrawerOpen = true"><span class="material-symbols-outlined">auto_awesome</span></button>
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
            <div class="summary-head">
              <div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                  <span class="pill pill-success">进行中</span>
                  <span class="pill pill-ai">需求迭代模板</span>
                </div>
                <h2 class="page-title" style="margin-top:18px;">{{ project.name }}</h2>
                <p class="page-subtitle" style="max-width:880px;">{{ project.desc }}</p>
              </div>
            </div>
            <div class="summary-kpis">
              <div class="summary-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
              <div class="summary-kpi"><span>时间范围</span><strong>{{ project.range }}</strong></div>
              <div class="summary-kpi"><span>项目进度</span><strong>{{ project.progress }}%</strong></div>
              <div class="summary-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              <div class="summary-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
            </div>
          </div>
        </section>

        <nav class="subnav-bar glass-panel">
          <router-link v-for="t in tabs" :key="t.key" class="subnav-link" :class="{ active: currentTab === t.key }" :to="tabRoute(t.key)">{{ t.label }}</router-link>
        </nav>

        <!-- Overview -->
        <div v-show="currentTab === 'overview'" class="tab-panel">
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="panel-head">
                <h2 class="section-title">里程碑与进展摘要</h2>
                <button class="btn-chip active">查看全部</button>
              </div>
              <div class="timeline" style="margin-top:18px;">
                <div class="timeline-item" v-for="m in milestones" :key="m.id">
                  <span class="timeline-dot" :style="{ background: m.color }"></span>
                  <div class="timeline-body">
                    <h4>{{ m.title }}</h4>
                    <p>{{ m.desc }}</p>
                    <span>{{ m.meta }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <div class="panel-head">
                  <h2 class="section-title" style="font-size:24px;">基线偏差预警</h2>
                  <span class="pill pill-danger">需关注</span>
                </div>
                <p class="page-subtitle" style="font-size:15px;margin-top:14px;">当前实际进度较最新基线落后 6%，里程碑“联调验证”偏差 2 天；若周三前完成环境修复，整体交付仍可控制在基线范围内。</p>
                <div class="summary-kpis" style="margin-top:16px;">
                  <div class="summary-kpi"><span>偏差里程碑</span><strong style="color:var(--color-danger-600);">1 个</strong></div>
                  <div class="summary-kpi"><span>预计追回</span><strong>0.8 天</strong></div>
                </div>
              </div>
              <div class="glass-panel panel-pad ai-gradient">
                <div style="display:flex;align-items:center;gap:10px;">
                  <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                  <h2 class="section-title" style="font-size:24px;">AI 项目建议</h2>
                </div>
                <p class="page-subtitle" style="font-size:15px;margin-top:14px;">建议将“数据回灌校验”拆分为独立子任务，并从平台组借调 1 名 QA 参与联调，预计可将偏差从 2 天压缩至 1.2 天。</p>
                <div class="ai-actions">
                  <button class="btn-primary">一键采纳</button>
                  <button class="btn-secondary">查看任务拆解</button>
                </div>
              </div>
            </div>
          </section>
          <section class="grid-3-2">
            <div class="glass-panel panel-pad">
              <div class="panel-head">
                <h2 class="section-title">本周任务进展</h2>
                <span class="section-caption">42 个任务 · 3 个阻塞</span>
              </div>
              <div class="task-list">
                <div class="task-row" v-for="t in weekTasks" :key="t.id">
                  <div class="task-icon" :class="t.iconClass"><span class="material-symbols-outlined">{{ t.icon }}</span></div>
                  <div style="flex:1;">
                    <p class="task-title">{{ t.title }}</p>
                    <p class="task-note">{{ t.note }}</p>
                  </div>
                  <span class="pill" :class="t.pillClass">{{ t.status }}</span>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <h2 class="section-title">成员负载概览</h2>
                <div class="load-list">
                  <div v-for="l in loads" :key="l.name">
                    <div class="load-head"><strong>{{ l.name }}</strong><span>{{ l.value }}%</span></div>
                    <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" :style="{ width: l.value + '%', background: l.gradient }"></div></div>
                  </div>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">风险摘要</h2>
                <div class="risk-tags">
                  <span class="status-tag warning">资源调度冲突</span>
                  <span class="status-tag danger">联调节点延后 2 天</span>
                  <span class="status-tag success">需求评审与开发实现稳定</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Members -->
        <div v-show="currentTab === 'members'" class="tab-panel">
          <section class="grid-3">
            <div class="glass-panel metric-card"><h3>项目成员</h3><div class="value">12</div><div class="trend" style="color:var(--color-primary-700);">2 位待接受</div></div>
            <div class="glass-panel metric-card"><h3>超阈值负载</h3><div class="value">3</div><div class="trend" style="color:var(--color-warning-600);">>80% 需调度</div></div>
            <div class="glass-panel metric-card"><h3>AI 推荐采纳率</h3><div class="value">67%</div><div class="trend" style="color:var(--color-secondary-600);">本周 6 次采纳</div></div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">成员列表</h2>
                <div class="report-chip-group">
                  <span class="pill pill-neutral">全部成员</span>
                  <span class="pill pill-warning">待接受 2</span>
                </div>
              </div>
              <div class="member-table">
                <div class="member-row" v-for="m in memberList" :key="m.id">
                  <div class="member-ident"><img :src="m.avatar" :alt="m.name" /><div><strong>{{ m.name }}</strong><p class="task-note">{{ m.dept }} · {{ m.role }}</p></div></div>
                  <div><span class="role-badge" :class="m.badge">{{ m.badgeLabel }}</span></div>
                  <div><span class="pill" :class="m.joinClass">{{ m.joinStatus }}</span></div>
                  <div><strong>当前任务 {{ m.tasks }}</strong><p class="task-note">预估 {{ m.estimate }}</p></div>
                  <div><span class="status-tag" :class="m.loadClass">{{ m.load }}%</span></div>
                  <button class="icon-btn"><span class="material-symbols-outlined">more_vert</span></button>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad ai-gradient">
                <h2 class="section-title">AI 智能分配建议</h2>
                <p class="page-subtitle" style="font-size:14px;margin-top:14px;">建议将“联调回灌日志补录”分配给 QA 成员王雅婷，置信度 91%；并将“测试环境参数冻结”交由赵扬处理，置信度 86%。</p>
                <div class="ai-actions">
                  <button class="btn-primary">一键采纳</button>
                  <button class="btn-secondary">手动调整</button>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">邀请流程</h2>
                <div class="timeline" style="margin-top:18px;">
                  <div class="timeline-item" v-for="s in inviteSteps" :key="s.title">
                    <span class="timeline-dot" :style="{ background: s.color }"></span>
                    <div class="timeline-body"><h4>{{ s.title }}</h4><p>{{ s.desc }}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="glass-panel panel-pad">
            <div class="chart-header">
              <h2 class="section-title">未来一周负载热力图</h2>
              <span class="section-caption">颜色越深负载越高，超过 80% 显示预警。</span>
            </div>
            <div class="calendar-grid">
              <div></div>
              <div v-for="d in weekDays" :key="d" class="calendar-head">{{ d }}</div>
              <template v-for="r in heatmap" :key="r.name">
                <div class="calendar-name">{{ r.name }}</div>
                <div v-for="(c, i) in r.cells" :key="i" :class="'load-' + c"></div>
              </template>
            </div>
          </section>
        </div>

        <!-- Kanban -->
        <div v-show="currentTab === 'kanban'" class="tab-panel">
          <section class="glass-panel filter-bar">
            <button class="btn-chip active">全部状态</button>
            <button class="btn-chip">P0 / P1</button>
            <button class="btn-chip">本周截止</button>
            <button class="btn-chip">仅阻塞</button>
            <button class="btn-chip">关联里程碑</button>
            <div class="report-chip-group" style="margin-left:auto;">
              <span class="pill pill-neutral">任务总数 26</span>
              <span class="pill pill-warning">阻塞 3</span>
            </div>
          </section>
          <section class="kanban-5">
            <div v-for="col in kanbanCols" :key="col.name" class="kanban-column glass-panel" :style="col.style">
              <div class="kanban-column-header"><h3>{{ col.name }}</h3><span class="pill" :class="col.pillClass">{{ col.count }}</span></div>
              <div class="kanban-card" v-for="card in col.cards" :key="card.title">
                <h4>{{ card.title }}</h4>
                <div class="kanban-meta">
                  <span v-for="tag in card.tags" :key="tag.text" class="micro-tag" :class="tag.class" :style="tag.style">{{ tag.text }}</span>
                </div>
                <p class="task-note">{{ card.note }}</p>
              </div>
            </div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">状态流转规则</h2>
                <span class="section-caption">待开始 → 进行中 → 待评审 → 已完成 / 已阻塞</span>
              </div>
              <table class="data-table">
                <thead><tr><th>规则</th><th>说明</th><th>通知</th></tr></thead>
                <tbody>
                  <tr v-for="r in flowRules" :key="r.rule"><td>{{ r.rule }}</td><td>{{ r.desc }}</td><td>{{ r.notify }}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="glass-panel panel-pad ai-gradient">
              <h2 class="section-title">AI 分配建议</h2>
              <p class="page-subtitle" style="font-size:14px;margin-top:14px;">建议把“联调回灌日志补录”从平台组调整给 QA 协作者王雅婷，置信度 91%，预计可在不影响主路径的情况下减少 0.4 天等待。</p>
              <div class="ai-actions">
                <button class="btn-primary">一键采纳</button>
                <button class="btn-secondary">手动调整</button>
              </div>
            </div>
          </section>
        </div>

        <!-- Gantt -->
        <div v-show="currentTab === 'gantt'" class="tab-panel">
          <section class="glass-panel" style="padding:20px 24px;border-radius:24px;">
            <div class="gantt-info-head">
              <div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                  <span class="pill pill-success">进行中</span>
                  <span class="pill pill-warning">联调偏差 +2 天</span>
                </div>
                <h2 class="section-title" style="margin-top:14px;">{{ project.name }}</h2>
                <p class="page-subtitle" style="font-size:15px;margin-top:8px;">负责人：{{ project.owner }} · 时间范围：{{ project.range }} · 当前进度：{{ project.progress }}%</p>
              </div>
              <div class="summary-kpis" style="margin-top:0;">
                <div class="summary-kpi"><span>关键路径</span><strong>3 段</strong></div>
                <div class="summary-kpi"><span>基线版本</span><strong>V2</strong></div>
                <div class="summary-kpi"><span>超期节点</span><strong style="color:var(--color-danger-600);">1 个</strong></div>
              </div>
            </div>
          </section>
          <section class="grid-3-2">
            <div class="gantt-shell glass-panel">
              <div class="gantt-toolbar">
                <div class="chip-group">
                  <button class="btn-chip active">按周</button>
                  <button class="btn-chip">按日</button>
                  <button class="btn-chip">按月</button>
                </div>
                <div class="chip-group">
                  <button class="btn-chip active">显示基线</button>
                  <button class="btn-chip"><span class="material-symbols-outlined">share</span>依赖关系</button>
                  <button class="btn-chip"><span class="material-symbols-outlined">unfold_more</span>缩放</button>
                </div>
              </div>
              <div class="gantt-layout">
                <div class="gantt-side">
                  <div class="gantt-head-row"><div>里程碑 / 任务</div><div>负责人</div></div>
                  <div class="gantt-item-row" v-for="g in ganttData" :key="g.name"><div><strong>{{ g.name }}</strong></div><div class="section-caption">{{ g.owner }}</div></div>
                </div>
                <div class="gantt-stage">
                  <div class="gantt-head-row"><div v-for="d in ganttDates" :key="d">{{ d }}</div></div>
                  <div class="gantt-item-row" v-for="g in ganttData" :key="g.name">
                    <div v-for="d in ganttDates" :key="d"></div>
                    <div class="gantt-bar-layer">
                      <div class="gantt-baseline" :style="{ left: g.baseLeft, width: g.baseWidth }"></div>
                      <div class="gantt-bar" :class="g.barClass" :style="{ left: g.barLeft, width: g.barWidth }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-stack">
              <div class="glass-panel panel-pad">
                <h2 class="section-title">排期摘要</h2>
                <div class="summary-kpis" style="margin-top:16px;">
                  <div class="summary-kpi"><span>关键路径</span><strong>开发 → 联调 → 验收</strong></div>
                  <div class="summary-kpi"><span>偏差</span><strong style="color:var(--color-danger-600);">+2 天</strong></div>
                </div>
                <p class="page-subtitle" style="font-size:14px;margin-top:16px;">当前实际计划主要偏差集中在“联调验证”，其余里程碑仍在可控范围内。</p>
              </div>
              <div class="glass-panel panel-pad ai-gradient">
                <h2 class="section-title">AI 排期建议</h2>
                <p class="page-subtitle" style="font-size:14px;margin-top:14px;">若将 QA 提前一周介入联调准备，并拆分“回灌验证”与“异常样本校正”两项任务，可追回 0.8 天，并降低关键路径波动。</p>
                <div class="ai-actions">
                  <button class="btn-primary">采纳建议</button>
                  <button class="btn-secondary">生成任务</button>
                </div>
              </div>
              <div class="glass-panel panel-pad">
                <h2 class="section-title">图例</h2>
                <div class="legend-list">
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-primary-700);">timeline</span>当前计划</div>
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-text-tertiary);">layers</span>基线计划</div>
                  <div class="gantt-flag"><span class="material-symbols-outlined" style="color:var(--color-danger-600);">warning</span>偏差节点</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Risk -->
        <div v-show="currentTab === 'risk'" class="tab-panel">
          <section class="grid-3">
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-danger-600);">report</span>
              <h3>高危任务</h3><div class="value">6</div>
              <div class="trend" style="color:var(--color-danger-600);"><span class="material-symbols-outlined" style="font-size:18px;">trending_up</span>+2 较上周</div>
            </div>
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-warning-600);">notification_important</span>
              <h3>中度预警</h3><div class="value">11</div>
              <div class="trend" style="color:var(--color-warning-600);"><span class="material-symbols-outlined" style="font-size:18px;">trending_flat</span>持平</div>
            </div>
            <div class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark" style="color:var(--color-secondary-600);">verified</span>
              <h3>整体稳定度</h3><div class="value">81%</div>
              <div class="trend" style="color:var(--color-secondary-600);"><span class="material-symbols-outlined" style="font-size:18px;">verified</span>仍可控</div>
            </div>
          </section>
          <section class="grid-2-1">
            <div class="glass-panel panel-pad">
              <div class="chart-header">
                <h2 class="section-title">资源冲突预警热力图</h2>
                <div class="legend">
                  <span>低负载</span>
                  <div class="legend-scale">
                    <span style="background:rgba(173,198,255,0.24);"></span>
                    <span style="background:rgba(79,143,246,0.38);"></span>
                    <span style="background:rgba(20,104,199,0.58);"></span>
                    <span style="background:rgba(20,104,199,0.78);"></span>
                    <span style="background:rgba(10,48,124,0.88);"></span>
                  </div>
                  <span>冲突高发</span>
                </div>
              </div>
              <div class="heatmap-grid" style="margin-bottom:12px;">
                <div v-for="d in weekDays" :key="d" class="calendar-head">{{ d }}</div>
              </div>
              <div class="heatmap-grid">
                <div v-for="(c, i) in heatmapBlocks" :key="i" class="heat-block" :style="{ background: c.bg, boxShadow: c.shadow }"></div>
              </div>
            </div>
            <div class="glass-panel panel-pad ai-gradient">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                <h2 class="section-title">AI 深度洞察</h2>
              </div>
              <div class="ai-list" style="margin-top:18px;">
                <div class="ai-list-item" v-for="insight in riskInsights" :key="insight.title">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.desc }}</p>
                </div>
              </div>
              <div class="ai-actions">
                <button class="btn-primary">生成完整风险报告</button>
                <button class="btn-secondary">点赞反馈</button>
              </div>
            </div>
          </section>
          <section class="glass-panel panel-pad">
            <div class="chart-header">
              <h2 class="section-title">核心风险任务列表</h2>
              <div class="page-actions">
                <button class="btn-secondary">导出清单</button>
                <button class="btn-primary">一键处理</button>
              </div>
            </div>
            <table class="data-table">
              <thead>
                <tr><th>任务名称</th><th>风险等级</th><th>风险因子</th><th>进度阻碍</th><th>负责人</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="r in riskTasks" :key="r.name">
                  <td><strong>{{ r.name }}</strong></td>
                  <td><span class="pill" :class="r.levelClass">{{ r.level }}</span></td>
                  <td>{{ r.factor }}</td>
                  <td><div class="progress-track"><div class="progress-fill" :style="{ width: r.block + '%', background: r.barColor }"></div></div></td>
                  <td>{{ r.owner }}</td>
                  <td><span class="material-symbols-outlined" style="color:var(--color-text-tertiary);">more_horiz</span></td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <!-- Reports -->
        <div v-show="currentTab === 'reports'" class="tab-panel">
          <section class="glass-panel filter-bar">
            <button class="btn-chip active">最近 30 天</button>
            <button class="btn-chip">本周</button>
            <button class="btn-chip">全部成员</button>
            <button class="btn-chip">进度报表</button>
            <button class="btn-chip">工时报表</button>
            <button class="btn-chip">质量报表</button>
          </section>
          <section class="summary-card glass-panel">
            <div class="summary-content">
              <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>AI 洞察卡片</span>
              <h2 class="section-title" style="font-size:32px;margin-top:18px;">本周团队效率提升 12%，但联调节点仍是唯一主风险源。</h2>
              <p class="page-subtitle" style="margin-top:14px;max-width:980px;">AI 综合燃尽图、成员负载与 Bug 趋势后判断：当前项目整体可控，主要问题集中在联调准备时间与测试环境冻结。建议下周优先协调平台组与 QA 的时间窗口，并提前生成周报草稿给相关成员确认。</p>
              <div class="ai-actions" style="margin-top:20px;">
                <button class="btn-primary">一键导出 Markdown</button>
                <button class="btn-secondary">点赞反馈</button>
                <button class="btn-secondary">点踩反馈</button>
              </div>
            </div>
          </section>
          <section class="grid-2">
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">燃尽图</h2><span class="section-caption">剩余工作量趋势</span></div>
              <div class="dual-line">
                <div v-for="(p, i) in burnPoints" :key="i" class="point-col">
                  <div class="track"></div><span class="dot-a" :style="{ bottom: p.a + '%' }"></span><span class="dot-b" :style="{ bottom: p.b + '%' }"></span>
                </div>
              </div>
              <div class="legend" style="margin-top:16px;">
                <span class="legend-dot" style="background:var(--color-primary-700);">实际剩余</span>
                <span class="legend-dot" style="background:var(--color-secondary-600);">目标燃尽</span>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">计划 vs 实际工时</h2><span class="section-caption">按成员对比</span></div>
              <div class="bar-chart">
                <div v-for="b in barChartData" :key="b.name" class="bar-item">
                  <div class="bar-track"><div class="bar-fill" :style="{ height: b.h + '%', background: b.gradient }"></div></div><span>{{ b.name }}</span>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">Bug 趋势</h2><span class="section-caption">新增 / 关闭</span></div>
              <div class="dual-line">
                <div v-for="(p, i) in bugPoints" :key="i" class="point-col">
                  <div class="track"></div><span class="dot-a" :style="{ bottom: p.a + '%', background: 'var(--color-danger-600)' }"></span><span class="dot-b" :style="{ bottom: p.b + '%', background: 'var(--color-secondary-600)' }"></span>
                </div>
              </div>
            </div>
            <div class="chart-card glass-panel">
              <div class="chart-header"><h2 class="section-title">阻塞时长与负载分布</h2><span class="section-caption">小时 / 人员</span></div>
              <div class="mini-bars">
                <div v-for="m in miniBars" :key="m.label" class="mini-bar-row">
                  <span>{{ m.label }}</span>
                  <div class="progress-track"><div class="progress-fill" :style="{ width: m.w + '%', background: m.gradient }"></div></div>
                  <strong>{{ m.val }}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Docs -->
        <div v-show="currentTab === 'docs'" class="tab-panel">
          <section class="doc-grid">
            <article class="doc-card glass-panel" v-for="doc in docList" :key="doc.title">
              <span class="pill" :class="doc.pillClass">{{ doc.pill }}</span>
              <h3 style="margin-top:14px;font-size:20px;">{{ doc.title }}</h3>
              <p>{{ doc.desc }}</p>
              <div class="summary-kpis"><div class="summary-kpi"><span>{{ doc.metaLabel }}</span><strong>{{ doc.metaValue }}</strong></div></div>
            </article>
          </section>
          <section class="empty-card glass-panel">
            <span class="material-symbols-outlined" style="font-size:56px;color:var(--color-primary-700);">folder_open</span>
            <h3 style="margin-top:18px;font-size:26px;">文档页首版以风格基线为主</h3>
            <p>当前已保留列表卡、版本、AI 摘要和空状态表达，后续可继续扩展为真实文档中心。</p>
          </section>
        </div>
      </div>
    </main>

    <!-- Edit Project Modal -->
    <div class="modal-shell" v-show="isEditModalOpen">
      <div class="modal-backdrop" @click="isEditModalOpen = false"></div>
      <section class="modal-panel glass-panel-strong project-edit-modal">
        <div class="modal-header">
          <div>
            <span class="pill pill-ai">项目编辑</span>
            <h2 class="section-title" style="font-size:28px;margin-top:14px;">编辑项目基础信息</h2>
            <p class="page-subtitle" style="font-size:15px;margin-top:10px;">延续当前项目详情页的玻璃拟态风格，左侧显示项目快照与编辑提示，右侧承载可编辑表单，作为后续真实化前的弹窗参考。</p>
          </div>
          <button class="icon-btn" @click="isEditModalOpen = false"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="project-edit-layout">
          <aside class="project-edit-side">
            <article class="glass-panel project-edit-card">
              <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                <span class="pill pill-success">进行中</span>
                <span class="pill pill-ai">需求迭代模板</span>
              </div>
              <h3 class="section-title" style="font-size:26px;margin-top:16px;">{{ project.name }}</h3>
              <p class="page-subtitle" style="font-size:14px;margin-top:12px;">聚焦晶体结构稳定性与模型预测精度提升，当前处于联调验证阶段，后续将继续围绕基线偏差与资源窗口做细化调整。</p>
              <div class="project-edit-progress">
                <div class="progress-track"><div class="progress-fill" style="width:72%;background:linear-gradient(90deg,var(--color-primary-400),var(--color-primary-700));"></div></div>
                <strong>72%</strong>
              </div>
              <div class="project-edit-kpis">
                <div class="project-edit-kpi"><span>项目负责人</span><strong>{{ project.owner }}</strong></div>
                <div class="project-edit-kpi"><span>成员数</span><strong>{{ project.members }} 人</strong></div>
                <div class="project-edit-kpi"><span>基线版本</span><strong>V2</strong></div>
                <div class="project-edit-kpi"><span>健康度</span><strong style="color:var(--color-secondary-600);">{{ project.health }}</strong></div>
              </div>
              <div class="project-edit-meta">
                <div class="project-edit-meta-row">
                  <div><span>时间范围</span><strong>2026-04-14 至 2026-05-16</strong></div>
                  <span class="status-tag warning">联调偏差 +2 天</span>
                </div>
                <div class="project-edit-meta-row">
                  <div><span>当前阶段</span><strong>联调验证</strong></div>
                  <span class="status-tag success">整体可控</span>
                </div>
              </div>
            </article>
            <article class="glass-panel project-edit-card ai-gradient">
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="material-symbols-outlined" style="color:var(--color-tertiary-600);">psychology</span>
                <h3 class="section-title" style="font-size:22px;">本次编辑建议</h3>
              </div>
              <div class="project-edit-note-list">
                <div class="project-edit-note" v-for="n in editNotes" :key="n.title">
                  <h4>{{ n.title }}</h4>
                  <p>{{ n.desc }}</p>
                </div>
              </div>
              <div class="project-edit-member-grid">
                <span class="project-edit-member" v-for="m in editMembers" :key="m"><img :src="m.avatar" :alt="m.name" />{{ m.name }}</span>
              </div>
            </article>
          </aside>
          <div class="project-edit-main">
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">基础信息</h3><p class="section-caption" style="margin-top:6px;">项目名称、编号、负责人和模板等基础字段</p></div>
                <span class="pill pill-neutral">基础字段</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">项目名称</label><div class="field-input"><span class="material-symbols-outlined">title</span><input type="text" v-model="editForm.name" /></div></div>
                <div class="field-stack"><label class="field-label">项目编号</label><div class="field-input"><span class="material-symbols-outlined">tag</span><input type="text" v-model="editForm.code" /></div></div>
              </div>
              <div class="project-edit-field-grid" style="margin-top:16px;">
                <div class="field-stack"><label class="field-label">项目模板</label><div class="field-input"><span class="material-symbols-outlined">dashboard_customize</span><select v-model="editForm.template"><option>需求迭代模板</option><option>平台交付模板</option><option>联合实验模板</option></select></div></div>
                <div class="field-stack"><label class="field-label">项目负责人</label><div class="field-input"><span class="material-symbols-outlined">person</span><select v-model="editForm.owner"><option>王志强</option><option>陈思远</option><option>王雅婷</option></select></div></div>
                <div class="field-stack"><label class="field-label">归属团队</label><div class="field-input"><span class="material-symbols-outlined">groups</span><select v-model="editForm.team"><option>材料科学部</option><option>平台组</option><option>联合项目组</option></select></div></div>
              </div>
            </article>
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">计划与状态</h3><p class="section-caption" style="margin-top:6px;">统一维护时间、阶段、健康度和可见标签</p></div>
                <span class="pill pill-warning">需要同步</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">开始日期</label><div class="field-input"><span class="material-symbols-outlined">calendar_today</span><input type="text" v-model="editForm.start" /></div></div>
                <div class="field-stack"><label class="field-label">结束日期</label><div class="field-input"><span class="material-symbols-outlined">event</span><input type="text" v-model="editForm.end" /></div></div>
              </div>
              <div class="project-edit-field-grid" style="margin-top:16px;">
                <div class="field-stack"><label class="field-label">当前阶段</label><div class="field-input"><span class="material-symbols-outlined">conversion_path</span><select v-model="editForm.stage"><option>联调验证</option><option>开发实现</option><option>上线验收</option></select></div></div>
                <div class="field-stack"><label class="field-label">健康度</label><div class="field-input"><span class="material-symbols-outlined">favorite</span><select v-model="editForm.health"><option>良好</option><option>需关注</option><option>高风险</option></select></div></div>
                <div class="field-stack"><label class="field-label">进度百分比</label><div class="field-input"><span class="material-symbols-outlined">progress_activity</span><input type="text" v-model="editForm.progress" /></div></div>
              </div>
              <div class="field-stack project-edit-textarea" style="margin-top:16px;">
                <label class="field-label">阶段说明</label>
                <div class="field-input"><span class="material-symbols-outlined" style="margin-top:16px;">notes</span><textarea v-model="editForm.note"></textarea></div>
              </div>
              <div class="project-edit-chip-row">
                <button v-for="chip in editChips1" :key="chip" class="permission-chip" :class="{ on: chip.on }" type="button">{{ chip.label }}</button>
              </div>
            </article>
            <article class="glass-panel project-edit-card">
              <div class="project-edit-card-head">
                <div><h3 class="section-title" style="font-size:22px;">成员与项目说明</h3><p class="section-caption" style="margin-top:6px;">补齐参与成员、协作角色和项目简介区块</p></div>
                <span class="pill pill-success">协作信息</span>
              </div>
              <div class="field-inline">
                <div class="field-stack"><label class="field-label">核心成员</label><div class="field-input"><span class="material-symbols-outlined">group</span><input type="text" v-model="editForm.members" /></div></div>
                <div class="field-stack"><label class="field-label">报告订阅人</label><div class="field-input"><span class="material-symbols-outlined">forward_to_inbox</span><input type="text" v-model="editForm.subscribers" /></div></div>
              </div>
              <div class="field-stack project-edit-textarea" style="margin-top:16px;">
                <label class="field-label">项目简介</label>
                <div class="field-input"><span class="material-symbols-outlined" style="margin-top:16px;">article</span><textarea v-model="editForm.bio"></textarea></div>
              </div>
              <div class="project-edit-chip-row">
                <button v-for="chip in editChips2" :key="chip" class="permission-chip" :class="{ on: chip.on }" type="button">{{ chip.label }}</button>
              </div>
            </article>
          </div>
        </div>
        <div class="modal-footer">
          <div class="modal-status"><span class="material-symbols-outlined">edit_note</span>当前为样式参考弹窗，字段与交互可在后续真实化时接入。</div>
          <div class="modal-footer-actions">
            <button class="btn-secondary" @click="isEditModalOpen = false"><span class="material-symbols-outlined">close</span>取消</button>
            <button class="btn-secondary" @click="showToast('项目草稿已保存', '编辑项目弹窗中的当前内容已保存为样式草稿，可继续调整布局与字段。', 'draft')"><span class="material-symbols-outlined">draft</span>保存草稿</button>
            <button class="btn-primary" @click="showToast('项目配置已更新', '项目基础信息、阶段说明和成员配置已同步为当前参考版本。', 'task_alt')"><span class="material-symbols-outlined">save</span>保存变更</button>
          </div>
        </div>
      </section>
    </div>

    <!-- AI Drawer -->
    <button class="floating-ai-btn" @click="isAiDrawerOpen = true"><span class="material-symbols-outlined">auto_awesome</span></button>
    <div class="ai-overlay" v-show="isAiDrawerOpen" @click="isAiDrawerOpen = false"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }">
      <div class="ai-header">
        <div><h3>AI 助手</h3><p class="section-caption">{{ aiContext }}</p></div>
        <button class="icon-btn" @click="isAiDrawerOpen = false"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="ai-card">
        <h4>{{ aiCard.title }}</h4>
        <p>{{ aiCard.desc }}</p>
        <div class="ai-actions">
          <button class="btn-primary">{{ aiCard.primary }}</button>
          <button class="btn-secondary">{{ aiCard.secondary }}</button>
        </div>
      </div>
      <div class="ai-list">
        <div class="ai-list-item" v-for="item in aiList" :key="item.title">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </aside>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast">
        <span class="material-symbols-outlined">{{ toast.icon }}</span>
        <div><strong>{{ toast.title }}</strong><p>{{ toast.message }}</p></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserProfileHoverCard from '../components/topbar/UserProfileHoverCard.vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'members', label: '成员' },
  { key: 'kanban', label: '项目看板' },
  { key: 'gantt', label: '项目甘特图' },
  { key: 'risk', label: '风险看板' },
  { key: 'reports', label: '报表' },
  { key: 'docs', label: '文档' }
]

const currentTab = computed(() => {
  const tab = route.params.tab
  const valid = tabs.map(t => t.key)
  return valid.includes(tab) ? tab : 'overview'
})

const tabLabel = computed(() => tabs.find(t => t.key === currentTab.value)?.label || '概览')

const projectId = computed(() => route.params.id || 1)
const tabRoute = (tab) => {
  const id = projectId.value
  if (tab === 'overview') return `/project/${id}`
  return `/project/${id}/${tab}`
}

const goBack = () => {
  router.push('/projects')
}

const currentUser = {
  name: '王志强',
  role: '项目负责人',
  avatar: 'https://i.pravatar.cc/80?img=47'
}

const project = ref({
  name: '纳米晶体结构优化',
  owner: '王志强',
  desc: '聚焦晶体结构稳定性与模型预测精度提升，当前处于“联调验证”阶段。项目已建立最新计划基线，AI 判断存在轻度进度偏差，但整体健康可控。',
  range: '04/14 - 05/16',
  progress: 72,
  health: '良好',
  members: 12
})

const milestones = ref([
  { id: 1, title: '需求评审', desc: '已完成。需求评审结论与实验约束已沉淀到项目文档，关联任务已自动拆解。', color: 'var(--color-secondary-600)', meta: '完成日期：04-18' },
  { id: 2, title: '开发实现', desc: '已完成 90%，剩余为性能对齐与异常样本校验，开发任务总体提前半天收敛。', color: 'var(--color-secondary-600)', meta: '最新更新时间：昨天 21:18' },
  { id: 3, title: '联调验证', desc: '相对基线延后 2 天。主要原因是数据回灌链路与测试环境准备时间重叠。', color: 'var(--color-warning-600)', meta: '偏差：+2 天' },
  { id: 4, title: '上线验收', desc: '待开始。当前仍可通过提前释放算力与压缩联调窗口追回 0.8 天。', color: 'rgba(114,119,133,0.7)', meta: '计划开始：05-12' }
])

const weekTasks = ref([
  { id: 1, title: '完成回归样本对齐与误差校验', note: '负责人：韩诚 · 预计今天完成', icon: 'lab_profile', iconClass: '', pillClass: 'pill-warning', status: '进行中' },
  { id: 2, title: '联调环境参数回灌', note: '阻塞原因：测试环境配置未完成', icon: 'block', iconClass: 'pending', pillClass: 'pill-danger', status: '已阻塞' },
  { id: 3, title: '完成晶格样本归一化策略更新', note: '已同步至基线对比视图', icon: 'check', iconClass: 'done', pillClass: 'pill-success', status: '已完成' }
])

const loads = ref([
  { name: '平台组', value: 86, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))' },
  { name: '材料组', value: 72, gradient: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700))' },
  { name: 'QA', value: 54, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))' }
])

const memberList = ref([
  { id: 1, name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47', dept: '材料科学部', role: '负责人', badge: 'pm', badgeLabel: 'PM', joinClass: 'pill-success', joinStatus: '已加入', tasks: 6, estimate: '5.5d', load: 82, loadClass: 'warning' },
  { id: 2, name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22', dept: '平台组', role: '联调负责人', badge: 'dev', badgeLabel: '研发', joinClass: 'pill-success', joinStatus: '已加入', tasks: 7, estimate: '6.0d', load: 91, loadClass: 'danger' },
  { id: 3, name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33', dept: 'QA', role: '回归验证', badge: 'qa', badgeLabel: 'QA', joinClass: 'pill-success', joinStatus: '已加入', tasks: 4, estimate: '3.5d', load: 58, loadClass: 'success' },
  { id: 4, name: '赵扬', avatar: 'https://i.pravatar.cc/80?img=12', dept: '平台组', role: '配置维护', badge: 'dev', badgeLabel: '研发', joinClass: 'pill-warning', joinStatus: '待接受', tasks: 2, estimate: '1.5d', load: 35, loadClass: 'neutral' }
])

const inviteSteps = ref([
  { title: '选择成员', desc: '通过组织架构树或搜索选择要加入项目的成员。', color: 'var(--color-primary-600)' },
  { title: '发送邀请', desc: '系统会同步站内消息与企微/钉钉通知。', color: 'var(--color-warning-600)' },
  { title: '接受并加入', desc: '成员接受邀请后自动加入项目权限组。', color: 'var(--color-secondary-600)' }
])

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const heatmap = ref([
  { name: '王志强', cells: [2, 4, 5, 4, 3, 1, 0] },
  { name: '陈思远', cells: [3, 5, 5, 4, 3, 1, 0] },
  { name: '王雅婷', cells: [1, 2, 3, 2, 2, 1, 0] },
  { name: '赵扬', cells: [0, 1, 2, 2, 1, 0, 0] }
])

const kanbanCols = ref([
  { name: '待开始', count: 5, pillClass: 'pill-neutral', cards: [
    { title: '整理联调验证清单', tags: [{ text: 'P2', class: 'p2' }, { text: '里程碑' }], note: '负责人：赵扬 · 预估工时 1.5d' },
    { title: '补充异常样本说明', tags: [{ text: 'P3', class: 'p3' }], note: '负责人：韩诚 · 截止：周四' }
  ]},
  { name: '进行中', count: 7, pillClass: 'pill-neutral', cards: [
    { title: '联调环境参数回灌', tags: [{ text: 'P0', class: 'p0' }, { text: '依赖平台组' }], note: '负责人：陈思远 · 进度 62%' },
    { title: '样本误差回归验证', tags: [{ text: 'P1', class: 'p1' }, { text: 'PBC' }], note: '负责人：王雅婷 · 进度 48%' }
  ]},
  { name: '待评审', count: 4, pillClass: 'pill-neutral', cards: [
    { title: '晶格归一化策略更新', tags: [{ text: 'P1', class: 'p1' }, { text: '需 QA 确认' }], note: '负责人：林初夏 · 截止 今天 18:00' },
    { title: '模型输出字段映射表', tags: [{ text: 'P2', class: 'p2' }], note: '负责人：韩诚 · 进度 90%' }
  ]},
  { name: '已完成', count: 8, pillClass: 'pill-neutral', cards: [
    { title: '需求评审结论归档', tags: [{ text: 'P2', class: 'p2' }, { text: '完成' }], note: '负责人：王志强 · 已自动同步日报' },
    { title: '开发任务拆解确认', tags: [{ text: 'P3', class: 'p3' }], note: '负责人：陈思远 · 已绑定基线' }
  ]},
  { name: '已阻塞', count: 3, pillClass: 'pill-danger', style: 'background:rgba(255,235,233,0.34);border-color:rgba(216,58,52,0.18);', cards: [
    { title: '测试环境参数冻结', tags: [{ text: 'P0', class: 'p0' }, { text: '阻塞', style: 'color:var(--color-danger-600);background:rgba(255,218,214,0.82);' }], note: '阻塞原因：环境配置窗口未确认' },
    { title: '联调回灌日志补录', tags: [{ text: 'P1', class: 'p1' }], note: '阻塞依赖：测试环境参数冻结' }
  ]}
])

const flowRules = ref([
  { rule: '待开始不可直接完成', desc: '必须先进入进行中或待评审', notify: '无' },
  { rule: '标记阻塞需填写原因', desc: '必须补充阻塞文本，并可关联阻塞依赖任务', notify: '通知创建者与 PM' },
  { rule: '任务完成通知', desc: '任务变更为已完成时自动触发', notify: '通知创建者' }
])

const ganttDates = ['04/14', '04/21', '04/28', '05/05', '05/12', '05/19', '05/26', '06/02', '06/09', '06/16', '06/23', '06/30']
const ganttData = ref([
  { name: '需求评审', owner: '王志强', baseLeft: '2%', baseWidth: '18%', barLeft: '2%', barWidth: '18%', barClass: 'blue' },
  { name: '开发实现', owner: '韩诚', baseLeft: '20%', baseWidth: '26%', barLeft: '20%', barWidth: '30%', barClass: 'purple' },
  { name: '联调验证', owner: '陈思远', baseLeft: '49%', baseWidth: '18%', barLeft: '53%', barWidth: '21%', barClass: 'red' },
  { name: '上线验收', owner: '周雅楠', baseLeft: '68%', baseWidth: '16%', barLeft: '73%', barWidth: '14%', barClass: 'green' }
])

const heatmapBlocks = ref([
  { bg: 'rgba(173,198,255,0.18)' }, { bg: 'rgba(173,198,255,0.34)' }, { bg: 'rgba(79,143,246,0.86)', shadow: '0 14px 28px rgba(79,143,246,0.28)' },
  { bg: 'rgba(173,198,255,0.30)' }, { bg: 'rgba(10,48,124,0.86)', shadow: '0 14px 28px rgba(10,48,124,0.24)' }, { bg: 'rgba(173,198,255,0.20)' }, { bg: 'rgba(173,198,255,0.18)' },
  { bg: 'rgba(79,143,246,0.36)' }, { bg: 'rgba(10,48,124,0.86)', shadow: '0 14px 28px rgba(10,48,124,0.24)' }, { bg: 'rgba(79,143,246,0.42)' },
  { bg: 'rgba(173,198,255,0.26)' }, { bg: 'rgba(79,143,246,0.34)' }, { bg: 'rgba(173,198,255,0.16)' }, { bg: 'rgba(173,198,255,0.18)' },
  { bg: 'rgba(173,198,255,0.30)' }, { bg: 'rgba(79,143,246,0.46)' }, { bg: 'rgba(35,82,207,0.92)', shadow: '0 14px 28px rgba(35,82,207,0.22)' },
  { bg: 'rgba(173,198,255,0.24)' }, { bg: 'rgba(79,143,246,0.36)' }, { bg: 'rgba(173,198,255,0.16)' }, { bg: 'rgba(173,198,255,0.18)' }
])

const riskInsights = ref([
  { title: '预测 · 概率 92%', desc: '由于“联调环境参数回灌”与“样本误差回归验证”共用同一测试窗口，周三将出现成员冲突，可能造成 0.6 天额外延迟。' },
  { title: '建议 · 可一键采纳', desc: '建议将“日志补录”任务临时调配给 QA 协作成员，并提前冻结周三的联调资源窗口。' }
])

const riskTasks = ref([
  { name: '联调环境参数回灌', level: '极高', levelClass: 'pill-danger', factor: '环境准备冲突', block: 68, barColor: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', owner: '陈思远' },
  { name: '样本误差回归验证', level: '中等', levelClass: 'pill-warning', factor: '算力窗口拥堵', block: 42, barColor: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', owner: '王雅婷' },
  { name: '测试环境参数冻结', level: '高危', levelClass: 'pill-danger', factor: '阻塞依赖未解除', block: 16, barColor: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', owner: '赵扬' }
])

const burnPoints = ref([
  { a: 74, b: 78 }, { a: 66, b: 70 }, { a: 58, b: 61 }, { a: 51, b: 54 },
  { a: 45, b: 42 }, { a: 36, b: 31 }, { a: 29, b: 22 }, { a: 21, b: 14 }
])

const barChartData = ref([
  { name: '王志强', h: 82, gradient: 'linear-gradient(180deg, var(--color-primary-400), var(--color-primary-700))' },
  { name: '陈思远', h: 92, gradient: 'linear-gradient(180deg, #f7c455, var(--color-warning-600))' },
  { name: '王雅婷', h: 58, gradient: 'linear-gradient(180deg, #38c59b, var(--color-secondary-600))' },
  { name: '赵扬', h: 36, gradient: 'linear-gradient(180deg, #a871ff, var(--color-tertiary-600))' }
])

const bugPoints = ref([
  { a: 48, b: 18 }, { a: 58, b: 25 }, { a: 44, b: 36 }, { a: 39, b: 42 },
  { a: 31, b: 46 }, { a: 22, b: 41 }, { a: 18, b: 33 }, { a: 13, b: 28 }
])

const miniBars = ref([
  { label: '联调环境', w: 78, gradient: 'linear-gradient(90deg, #f36b63, var(--color-danger-600))', val: '31h' },
  { label: '样本验证', w: 52, gradient: 'linear-gradient(90deg, #f7c455, var(--color-warning-600))', val: '19h' },
  { label: '平台组负载', w: 91, gradient: 'linear-gradient(90deg, #a871ff, var(--color-tertiary-600))', val: '91%' },
  { label: 'QA 负载', w: 58, gradient: 'linear-gradient(90deg, #38c59b, var(--color-secondary-600))', val: '58%' }
])

const docList = ref([
  { title: '需求评审纪要', desc: '记录需求边界、时间计划和依赖说明，供 PM、研发与 QA 对齐使用。', pill: '最新版本', pillClass: 'pill-success', metaLabel: '更新时间', metaValue: '今天 10:40' },
  { title: '联调验证说明', desc: '包含当前联调阶段的前置条件、关键风险和任务引用，可自动生成摘要。', pill: 'AI 摘要', pillClass: 'pill-ai', metaLabel: '标签', metaValue: '联调 / 风险' },
  { title: '回归样本池说明', desc: '当前文档仅存在占位，建议下一轮把样本来源、版本和映射关系整理进来。', pill: '待补充', pillClass: 'pill-warning', metaLabel: '责任人', metaValue: 'QA 组' }
])

const isEditModalOpen = ref(false)
const isAiDrawerOpen = ref(false)

const toast = ref({ show: false, title: '', message: '', icon: '' })
const showToast = (title, message, icon) => {
  toast.value = { show: true, title, message, icon }
  setTimeout(() => toast.value.show = false, 3000)
}

const editForm = ref({
  name: '纳米晶体结构优化', code: 'MAT-2026-0414', template: '需求迭代模板', owner: '王志强', team: '材料科学部',
  start: '2026-04-14', end: '2026-05-16', stage: '联调验证', health: '良好', progress: '72%',
  note: '当前阶段集中处理联调验证中的时间偏差与资源窗口冲突，目标是在保持健康度稳定的前提下追回 0.8 天进度。',
  members: '王志强、陈思远、王雅婷、赵扬', subscribers: 'PM、QA、平台主管',
  bio: '聚焦晶体结构稳定性与模型预测精度提升，当前项目以需求迭代模板推进，覆盖概览、成员、看板、甘特、风险与报表多个展示页。'
})

const editNotes = ref([
  { title: '优先同步基线与时间窗', desc: '建议将联调验证的偏差说明写入项目摘要，避免首页卡片、甘特页和风险页的信息口径不一致。' },
  { title: '成员信息建议一起维护', desc: '若项目负责人或核心成员发生变化，建议同时调整成员页和报告订阅人，减少后续样式与文案返工。' }
])

const editMembers = ref([
  { name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47' },
  { name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22' },
  { name: '王雅婷', avatar: 'https://i.pravatar.cc/80?img=33' }
])

const editChips1 = ref([
  { label: '概览页高亮', on: true },
  { label: '风险页提醒', on: true },
  { label: '报表订阅', on: true },
  { label: '归档状态', on: false }
])

const editChips2 = ref([
  { label: '同步项目看板', on: true },
  { label: '同步甘特页', on: true },
  { label: '同步风险页', on: true },
  { label: '生成变更摘要', on: false },
  { label: '通知协作成员', on: false }
])

const aiContexts = {
  overview: '当前上下文：项目概览',
  members: '当前上下文：成员',
  kanban: '当前上下文：项目看板',
  gantt: '当前上下文：项目甘特图',
  risk: '当前上下文：风险看板',
  reports: '当前上下文：项目报表',
  docs: '当前上下文：项目文档'
}

const aiCards = {
  overview: { title: '根因分析', desc: '联调验证延期的主要原因不是开发落后，而是测试环境准备与数据回灌窗口重叠。建议优先拆出“环境参数回灌”子任务并指定单独负责人。', primary: '生成子任务', secondary: '查看基线对比' },
  members: { title: '负载平衡建议', desc: '当前平台组与 PM 均超过 80% 负载，建议先把回灌日志与回归验证说明拆给 QA 处理，再安排赵扬接手环境冻结任务。', primary: '采纳分配', secondary: '只生成通知' },
  kanban: { title: '阻塞处理建议', desc: '当前 3 个阻塞任务中，有 2 个都依赖“测试环境参数冻结”。优先处理该任务将直接释放下游 2 条任务链。', primary: '设为最高优先级', secondary: '生成提醒' },
  gantt: { title: '基线偏差说明', desc: '“联调验证”条形已超过基线半透明条 2 天，建议优先处理环境参数回灌和 QA 资源安排，以免影响上线验收窗口。', primary: '创建补救计划', secondary: '导出风险摘要' },
  risk: { title: '根因分析浮窗', desc: '根因不在开发速度，而在资源调度。风险在于多个任务争抢同一测试窗口，建议先调度再追赶计划。', primary: '一键协调资源', secondary: '仅生成说明' },
  reports: { title: '周报撰写建议', desc: '当前报表最值得强调的结论是“整体效率提升 12%，但联调节点是唯一主风险”，适合作为周报首段摘要。', primary: '自动生成周报', secondary: '复制 Markdown' },
  docs: { title: '文档建议', desc: '建议优先补齐“回归样本池说明”，并将需求评审纪要自动链接到联调验证任务。', primary: '生成文档提纲', secondary: '生成摘要' }
}

const aiLists = {
  overview: [
    { title: '项目健康预测 · 88% 置信度', desc: '若本周三前恢复联调，项目整体健康度仍可维持“良好”。' },
    { title: '成员建议', desc: '平台组负载已超过阈值，建议将两项回归校验转交给 QA 协作成员处理。' }
  ],
  members: [],
  kanban: [],
  gantt: [
    { title: '关键路径提醒', desc: '开发实现、联调验证、上线验收构成当前最长依赖链，请勿在该链路上新增低优先级任务。' }
  ],
  risk: [],
  reports: [],
  docs: []
}

const aiContext = computed(() => aiContexts[currentTab.value] || aiContexts.overview)
const aiCard = computed(() => aiCards[currentTab.value] || aiCards.overview)
const aiList = computed(() => aiLists[currentTab.value] || [])

watch(() => route.params.tab, () => { isAiDrawerOpen.value = false })
</script>

<style scoped>
.panel-pad { padding: 24px; border-radius: 24px; }
.tab-panel { display: flex; flex-direction: column; gap: 24px; }
.tab-panel > section + section { margin-top: 0; }
.ai-gradient { background: linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42)); }
.col-stack { display: flex; flex-direction: column; gap: 24px; }
.panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
.summary-head { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.load-list { display: flex; flex-direction: column; gap: 16px; margin-top: 18px; }
.load-head { display: flex; justify-content: space-between; }
.risk-tags { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.chip-group { display: flex; gap: 10px; flex-wrap: wrap; }
.gantt-info-head { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; align-items: center; }
.legend-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.legend-dot { display: inline-flex; align-items: center; gap: 6px; }
.legend-dot::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: currentColor; display: inline-block; }
.project-edit-modal { width: min(1180px, calc(100vw - 48px)); }
.project-edit-layout { display: grid; grid-template-columns: minmax(300px, 0.92fr) minmax(0, 1.4fr); gap: 20px; }
.project-edit-side { display: flex; flex-direction: column; gap: 18px; }
.project-edit-card { padding: 20px; border-radius: 24px; }
.project-edit-card h3, .project-edit-card p { margin: 0; }
.project-edit-kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
.project-edit-kpi { padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.28); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-kpi span, .project-edit-kpi strong { display: block; }
.project-edit-kpi span { font-size: 12px; color: var(--color-text-tertiary); }
.project-edit-kpi strong { margin-top: 8px; font-size: 18px; }
.project-edit-meta { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.project-edit-meta-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.28); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-meta-row > div span, .project-edit-meta-row > div strong { display: block; }
.project-edit-meta-row > div span { font-size: 12px; color: var(--color-text-tertiary); }
.project-edit-meta-row > div strong { font-size: 14px; text-align: left; }
.project-edit-member-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.project-edit-member { display: inline-flex; align-items: center; gap: 10px; min-height: 42px; padding: 0 14px 0 8px; border-radius: 999px; background: rgba(255,255,255,0.5); border: 1px solid rgba(216,221,232,0.88); color: var(--color-text-secondary); font-size: 13px; font-weight: 600; }
.project-edit-member img { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.82); }
.project-edit-progress { display: flex; align-items: center; gap: 12px; margin-top: 18px; }
.project-edit-progress .progress-track { flex: 1; }
.project-edit-progress strong { min-width: 44px; text-align: right; }
.project-edit-note-list { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.project-edit-note { padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.58); }
.project-edit-note h4, .project-edit-note p { margin: 0; }
.project-edit-note p { margin-top: 8px; color: var(--color-text-secondary); font-size: 13px; line-height: 1.6; }
.project-edit-main { display: flex; flex-direction: column; gap: 18px; }
.project-edit-card-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
.project-edit-card-head h3, .project-edit-card-head p { margin: 0; }
.project-edit-field-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.project-edit-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.project-edit-textarea .field-input { align-items: flex-start; min-height: 136px; }
.project-edit-textarea textarea { min-height: 108px; }
.role-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 26px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.role-badge.pm { background: rgba(79,143,246,0.14); color: var(--color-primary-700); }
.role-badge.dev { background: rgba(168,113,255,0.14); color: var(--color-tertiary-600); }
.role-badge.qa { background: rgba(56,197,155,0.14); color: var(--color-secondary-600); }
.status-tag.neutral { color: var(--color-text-tertiary); background: rgba(233,236,241,0.8); }
.status-tag.warning { color: #a36b00; background: rgba(252,230,176,0.8); }
.status-tag.danger { color: var(--color-danger-600); background: rgba(255,218,214,0.8); }
.status-tag.success { color: var(--color-secondary-600); background: rgba(156,239,219,0.8); }
.heatmap-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.heat-block { aspect-ratio: 1; border-radius: 10px; }
.app-topbar { padding: 0 10px; }
.topbar-left { gap: 10px; }
.topbar-back-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 180ms ease, transform 180ms ease, color 180ms ease;
}
  .topbar-back-icon:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateX(-1px);
  }
  .topbar-back-icon:focus-visible {
    outline: 2px solid rgba(20, 104, 199, 0.45);
    outline-offset: 2px;
  }
  .topbar-back-icon .material-symbols-outlined {
    font-size: 18px;
  }
@media (max-width: 1279px) {
  .project-edit-layout, .project-edit-field-grid { grid-template-columns: 1fr; }
}
</style>
