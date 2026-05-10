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
      <button class="sidebar-primary-cta" @click="openModal">
        <span class="material-symbols-outlined">add_circle</span>
        新建项目
      </button>
      <nav class="sidebar-nav">
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')"><span class="material-symbols-outlined">space_dashboard</span><span>个人工作台</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/reports')"><span class="material-symbols-outlined">query_stats</span><span>全局报表</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/settings')"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')"><span class="material-symbols-outlined">admin_panel_settings</span><span>后台管理</span></a>
      </nav>
    </aside>

    <header class="app-topbar">
      <div class="topbar-left">
        <div>
          <h2 class="topbar-title">研发创新管理平台</h2>
          <div class="topbar-breadcrumb">
            <span>全局</span>
            <span>/</span>
            <span>工作台</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、任务、成员或报表..." />
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
            <h1 class="page-title">全局工作台</h1>
            <p class="page-subtitle">待办、AI 日报入口、团队动态与项目健康度的统一入口。</p>
          </div>
          <div class="page-actions">
            <button class="btn-secondary"><span class="material-symbols-outlined">download</span>导出晨报</button>
            <button class="btn-primary"><span class="material-symbols-outlined">bolt</span>生成 AI 日报</button>
          </div>
        </div>

        <section class="grid-2-1">
          <div class="summary-card glass-panel">
            <div class="summary-content">
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <span class="pill pill-ai"><span class="material-symbols-outlined">auto_awesome</span>AI 智能简报</span>
                <span class="section-caption">更新时间：今天 09:30</span>
              </div>
              <h2 class="section-title" style="font-size: 38px; margin-top: 22px; line-height: 1.24;">早上好，张工。今天有 4 个关键事项需要优先关注。</h2>
              <p class="page-subtitle" style="max-width: 880px; margin-top: 18px;">纳米材料项目 A 的合成实验成功率本周提升 12%，但“联调验证”里程碑相对基线已延后 2 天；实验二组算力申请集中在周三与周五，成员负载峰值达到 86%；本周共有 3 个 P0 任务待评审，建议今天优先安排联调和代码复核。</p>
              <div class="summary-kpis">
                <div class="summary-kpi">
                  <span>个人待办完成率</span>
                  <strong>73%</strong>
                </div>
                <div class="summary-kpi">
                  <span>阻塞任务</span>
                  <strong>2 项</strong>
                </div>
                <div class="summary-kpi">
                  <span>PBC 达成率</span>
                  <strong>64%</strong>
                </div>
                <div class="summary-kpi">
                  <span>活跃项目</span>
                  <strong>16 个</strong>
                </div>
              </div>
              <div class="summary-actions">
                <button class="btn-primary"><span class="material-symbols-outlined">arrow_forward</span>查看 AI 日报</button>
                <button class="btn-secondary"><span class="material-symbols-outlined">task_alt</span>进入个人工作台</button>
                <button class="btn-secondary"><span class="material-symbols-outlined">add_task</span>快速创建任务</button>
              </div>
            </div>
          </div>

          <div class="glass-panel metric-card">
            <div style="display: flex; justify-content: space-between; gap: 14px; align-items: start;">
              <div>
                <h3>团队效率趋势</h3>
                <div class="value" style="font-size: 52px; color: var(--color-primary-700);">142%</div>
              </div>
              <span class="material-symbols-outlined watermark" style="position: static; opacity: 0.22; font-size: 60px; color: var(--color-primary-600);">trending_up</span>
            </div>
            <div class="progress-track" style="margin-top: 18px;">
              <div class="progress-fill" style="width: 72%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div>
            </div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 14px;">高于近 30 天平均水平 15.4%，AI 判断主要受“自动化测试改造”和“日报生成效率提升”影响。</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
              <span class="micro-tag p2">高增长</span>
              <span class="micro-tag" style="color: var(--color-tertiary-600); background: rgba(236,220,255,0.72);">低风险</span>
              <span class="micro-tag" style="color: var(--color-secondary-600); background: rgba(156,239,219,0.72);">AI 推荐保持</span>
            </div>
          </div>
        </section>

        <section class="grid-2-1-1">
          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px;">
              <h2 class="section-title" style="font-size: 24px;">我的待办</h2>
              <button class="btn-chip active">查看全部</button>
            </div>
            <div class="task-list">
              <div class="task-row" role="button" tabindex="0" style="cursor: pointer;" @click="handleNavigate('/task/1')">
                <div class="task-icon"><span class="material-symbols-outlined">play_arrow</span></div>
                <div style="flex: 1;">
                  <p class="task-title">完成 Q3 实验室能效评估报告</p>
                  <p class="task-note">截止日期：今天 18:00 · 关联项目：实验基座升级</p>
                </div>
                <span class="pill pill-danger">紧急</span>
              </div>
              <div class="task-row">
                <div class="task-icon pending"><span class="material-symbols-outlined">radio_button_unchecked</span></div>
                <div style="flex: 1;">
                  <p class="task-title">审批 5 号实验室设备维护申请</p>
                  <p class="task-note">来自：李技术员 · 预估工时：0.5d</p>
                </div>
                <span class="pill pill-warning">待审</span>
              </div>
              <div class="task-row" style="opacity: 0.68;">
                <div class="task-icon done"><span class="material-symbols-outlined">check</span></div>
                <div style="flex: 1;">
                  <p class="task-title" style="text-decoration: line-through;">更新周报内容至系统</p>
                  <p class="task-note">已完成 · 日志已同步到 AI 日报草稿</p>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <h2 class="section-title" style="font-size: 24px; margin-bottom: 18px;">最近动态</h2>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot" style="background: var(--color-primary-600);"></span>
                <div class="timeline-body">
                  <h4>新文档上传</h4>
                  <p>“碳纳米管合成工艺”已存入项目文档库，关联至项目 A 的第三阶段验证。</p>
                  <span>10 分钟前</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" style="background: var(--color-tertiary-600);"></span>
                <div class="timeline-body">
                  <h4>实验预警</h4>
                  <p>2 号恒温箱温度波动异常，AI 预测 4 小时内将影响第 3 批次实验结果。</p>
                  <span>45 分钟前</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" style="background: #0eb4d6;"></span>
                <div class="timeline-body">
                  <h4>人员变动</h4>
                  <p>新实习生王强已加入“模型评估组”，待 PM 完成项目内身份分配。</p>
                  <span>2 小时前</span>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel" style="padding: 24px; border-radius: 24px;">
            <h2 class="section-title" style="font-size: 24px; margin-bottom: 18px;">项目健康度</h2>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: end;">
                  <strong>核心实验室</strong>
                  <span style="font-weight: 700; color: var(--color-primary-700);">85%</span>
                </div>
                <div class="progress-track" style="margin-top: 10px;"><div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div></div>
                <p class="task-note" style="margin-top: 8px;">进度稳步推进</p>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: end;">
                  <strong>材料迭代</strong>
                  <span style="font-weight: 700; color: var(--color-warning-600);">42%</span>
                </div>
                <div class="progress-track" style="margin-top: 10px;"><div class="progress-fill" style="width: 42%; background: linear-gradient(90deg, #f7c455, var(--color-warning-600));"></div></div>
                <p class="task-note" style="margin-top: 8px;">存在资源瓶颈</p>
              </div>
              <div class="glass-soft" style="padding: 16px; border-radius: 18px;">
                <div style="display: flex; justify-content: space-between;">
                  <span class="section-caption">整体交付信心</span>
                  <strong style="color: var(--color-secondary-600);">极高</strong>
                </div>
                <div style="display: flex; gap: 6px; margin-top: 12px;">
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: #2fc68a;"></div>
                  <div class="progress-fill" style="flex: 1; background: rgba(216,221,232,0.9);"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="grid-3">
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">thermostat</span>
            <h3>实验室平均温湿度</h3>
            <div class="value" style="font-size: 30px;">22.4°C / 45%</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">关键环境稳定，暂无异常波动。</p>
          </div>
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">memory</span>
            <h3>算力节点在线率</h3>
            <div class="value" style="font-size: 30px;">99.98%</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">GPU 集群状态良好，周三夜间有高峰负载。</p>
          </div>
          <div class="glass-panel metric-card">
            <span class="material-symbols-outlined watermark">security</span>
            <h3>安全运行天数</h3>
            <div class="value" style="font-size: 30px;">1,284 天</div>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 10px;">本季度无 P1 级安全事件，AI 监测维持稳定。</p>
          </div>
        </section>
      </div>
    </main>
  </div>

  <div class="modal-shell" :class="{ open: isModalOpen }">
    <div class="modal-backdrop" @click="closeModal"></div>
    <section class="modal-panel glass-panel-strong project-create-modal">
      <div class="modal-header">
        <div>
          <span class="pill pill-ai">新建项目</span>
          <h2 class="section-title" style="font-size: 28px; margin-top: 14px;">创建项目草稿</h2>
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">参考项目矩阵页的展示维度，先完成名称、编号、负责人、标签、状态与截止时间等核心信息配置，创建后可继续进入详情页补充内容。</p>
        </div>
        <button class="icon-btn" @click="closeModal"><span class="material-symbols-outlined">close</span></button>
      </div>

      <div class="project-create-layout">
        <aside class="project-create-side">
          <article class="glass-panel project-create-card">
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <span class="pill pill-neutral">待启动</span>
              <span class="pill pill-ai">快速创建</span>
            </div>
            <h3 class="section-title" style="font-size: 26px; margin-top: 16px;">新建项目草稿</h3>
            <p class="page-subtitle" style="font-size: 14px; margin-top: 12px;">适合作为全局工作台的快捷创建入口，先生成结构化草稿，再在项目详情、甘特图、风险和报表中逐步补全。</p>

            <div class="project-create-kpis">
              <div class="project-create-kpi">
                <span>默认状态</span>
                <strong>进行中</strong>
              </div>
              <div class="project-create-kpi">
                <span>初始健康度</span>
                <strong style="color: var(--color-secondary-600);">良好</strong>
              </div>
              <div class="project-create-kpi">
                <span>推荐成员数</span>
                <strong>6 - 12 人</strong>
              </div>
              <div class="project-create-kpi">
                <span>建议周期</span>
                <strong>4 - 8 周</strong>
              </div>
            </div>

            <div class="project-create-step-list">
              <div class="project-create-step">
                <div class="project-create-step-index">1</div>
                <div>
                  <h4>填写基础信息</h4>
                  <p>项目名称、编号、归属团队和负责人会直接决定项目矩阵页的首屏展示结构。</p>
                </div>
              </div>
              <div class="project-create-step">
                <div class="project-create-step-index">2</div>
                <div>
                  <h4>设定计划与标签</h4>
                  <p>开始时间、截止日期、健康度与标签会同步影响筛选栏、排序维度和状态表达。</p>
                </div>
              </div>
              <div class="project-create-step">
                <div class="project-create-step-index">3</div>
                <div>
                  <h4>配置成员与同步页</h4>
                  <p>创建后可默认开启概览、看板、甘特、风险与报表页，便于后续继续细化模板内容。</p>
                </div>
              </div>
            </div>
          </article>

          <article class="glass-panel project-create-card" style="background: linear-gradient(180deg, rgba(236,220,255,0.32), rgba(255,255,255,0.42));">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="material-symbols-outlined" style="color: var(--color-tertiary-600);">psychology</span>
              <h3 class="section-title" style="font-size: 22px;">AI 创建建议</h3>
            </div>
            <div class="project-create-step-list">
              <div class="project-create-step">
                <div class="project-create-step-index">A</div>
                <div>
                  <h4>优先选择模板</h4>
                  <p>如果是需求迭代类项目，建议优先使用“需求评审 → 开发 → 测试 → 上线 → 验收”的模板，后续更容易对齐看板和甘特页。</p>
                </div>
              </div>
              <div class="project-create-step">
                <div class="project-create-step-index">B</div>
                <div>
                  <h4>提前锁定负责人</h4>
                  <p>材料组与平台组在下周二至周四存在资源交叉峰值，新建阶段就锁定负责人可以减少项目矩阵里的风险外溢。</p>
                </div>
              </div>
            </div>
            <div class="project-create-owner-grid">
              <span class="project-create-owner"><img src="https://i.pravatar.cc/80?img=47" alt="王志强" />王志强</span>
              <span class="project-create-owner"><img src="https://i.pravatar.cc/80?img=22" alt="陈思远" />陈思远</span>
              <span class="project-create-owner"><img src="https://i.pravatar.cc/80?img=35" alt="周雅楠" />周雅楠</span>
            </div>
          </article>
        </aside>

        <div class="project-create-main">
          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">基础信息</h3>
                <p class="section-caption" style="margin-top: 6px;">对齐项目矩阵页的核心字段展示</p>
              </div>
              <span class="pill pill-neutral">列表主字段</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">项目名称</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">title</span>
                  <input type="text" value="新型复合材料热稳定性验证" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">项目编号</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">tag</span>
                  <input type="text" value="RD-2026-318" />
                </div>
              </div>
            </div>

            <div class="project-create-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">归属团队</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">groups</span>
                  <select>
                    <option>材料科学部</option>
                    <option>平台组</option>
                    <option>计算物理组</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">项目负责人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">person</span>
                  <select>
                    <option>王志强</option>
                    <option>陈思远</option>
                    <option>周雅楠</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">预计成员数</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">group_add</span>
                  <input type="text" value="8 人" />
                </div>
              </div>
            </div>

            <div class="project-create-template-grid">
              <div class="project-create-template active">
                <h4>需求迭代模板</h4>
                <p>适合需要概览、项目看板、甘特、风险和报表全链路协同的研发项目。</p>
              </div>
              <div class="project-create-template">
                <h4>平台交付模板</h4>
                <p>强调联调窗口、里程碑节点和负责人资源约束，适合平台改造类任务。</p>
              </div>
              <div class="project-create-template">
                <h4>验证实验模板</h4>
                <p>更适合实验验证、样本归档和阶段性结果汇总场景。</p>
              </div>
            </div>
          </article>

          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">计划与状态</h3>
                <p class="section-caption" style="margin-top: 6px;">用于项目矩阵页的筛选、排序和状态展示</p>
              </div>
              <span class="pill pill-success">计划信息</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">开始日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">calendar_today</span>
                  <input type="text" value="2026-05-06" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">截止日期</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">event</span>
                  <input type="text" value="2026-06-20" />
                </div>
              </div>
            </div>

            <div class="project-create-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">项目状态</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">pending_actions</span>
                  <select>
                    <option>进行中</option>
                    <option>待启动</option>
                    <option>已暂停</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">健康度</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">favorite</span>
                  <select>
                    <option>良好</option>
                    <option>风险</option>
                    <option>严重</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">初始完成度</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">progress_activity</span>
                  <input type="text" value="0%" />
                </div>
              </div>
            </div>

            <div class="project-create-status-grid">
              <div class="project-create-status-card">
                <span>项目优先级</span>
                <strong>P1</strong>
              </div>
              <div class="project-create-status-card">
                <span>风险同步</span>
                <strong>已开启</strong>
              </div>
              <div class="project-create-status-card">
                <span>报告订阅</span>
                <strong>每周一</strong>
              </div>
              <div class="project-create-status-card">
                <span>默认视图</span>
                <strong>概览页</strong>
              </div>
            </div>

            <div class="field-stack project-create-textarea" style="margin-top: 16px;">
              <label class="field-label">项目摘要</label>
              <div class="field-input">
                <span class="material-symbols-outlined" style="margin-top: 16px;">article</span>
                <textarea>围绕新型复合材料热稳定性验证展开，预期在 6 周内完成需求评审、实验方案对齐、验证实施与结果复盘，并同步沉淀到项目矩阵与风险页。</textarea>
              </div>
            </div>

            <div class="project-create-chip-row">
              <button class="permission-chip on" type="button">结构迭代</button>
              <button class="permission-chip on" type="button">性能验证</button>
              <button class="permission-chip on" type="button">AI 预测</button>
              <button class="permission-chip" type="button">高风险</button>
              <button class="permission-chip" type="button">平台改造</button>
            </div>
          </article>

          <article class="glass-panel project-create-card">
            <div class="project-create-card-head">
              <div>
                <h3 class="section-title" style="font-size: 22px;">成员与同步配置</h3>
                <p class="section-caption" style="margin-top: 6px;">创建后默认影响成员字段、矩阵页筛选项和各详情页入口</p>
              </div>
              <span class="pill pill-warning">协作配置</span>
            </div>

            <div class="field-inline">
              <div class="field-stack">
                <label class="field-label">核心成员</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">group</span>
                  <input type="text" value="王志强、陈思远、王雅婷、赵扬" />
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">报告订阅人</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">forward_to_inbox</span>
                  <input type="text" value="PM、QA、平台主管" />
                </div>
              </div>
            </div>

            <div class="project-create-field-grid" style="margin-top: 16px;">
              <div class="field-stack">
                <label class="field-label">默认详情入口</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">open_in_new</span>
                  <select>
                    <option>项目概览</option>
                    <option>项目看板</option>
                    <option>项目甘特图</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">风险提醒频率</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">warning</span>
                  <select>
                    <option>每日同步</option>
                    <option>每周同步</option>
                    <option>仅异常提醒</option>
                  </select>
                </div>
              </div>
              <div class="field-stack">
                <label class="field-label">模板初始化</label>
                <div class="field-input">
                  <span class="material-symbols-outlined">auto_fix_high</span>
                  <select>
                    <option>自动生成默认结构</option>
                    <option>仅创建空白项目</option>
                    <option>复制最近项目配置</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="project-create-chip-row">
              <button class="permission-chip on" type="button">启用概览页</button>
              <button class="permission-chip on" type="button">启用项目看板</button>
              <button class="permission-chip on" type="button">启用甘特图</button>
              <button class="permission-chip on" type="button">启用风险页</button>
              <button class="permission-chip on" type="button">启用报表页</button>
              <button class="permission-chip" type="button">通知全员</button>
            </div>
          </article>
        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-status">
          <span class="material-symbols-outlined">add_task</span>
          当前为样式参考弹窗，字段结构已按项目矩阵页的展示与筛选需求组织。
        </div>
        <div class="modal-footer-actions">
          <button class="btn-secondary" @click="closeModal"><span class="material-symbols-outlined">close</span>取消</button>
          <button class="btn-secondary" @click="showToast('项目草稿已保存', '新建项目弹窗中的当前内容已保存为创建草稿，可继续调整字段与布局。', 'draft')"><span class="material-symbols-outlined">draft</span>保存草稿</button>
          <button class="btn-primary" @click="showToast('项目已创建', '项目草稿已按当前模板创建，并预留概览、看板、甘特、风险和报表页入口。', 'task_alt')"><span class="material-symbols-outlined">rocket_launch</span>创建项目</button>
        </div>
      </div>
    </section>
  </div>

  <button class="floating-ai-btn" @click="toggleAiDrawer"><span class="material-symbols-outlined">auto_awesome</span></button>
  <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" @click="closeAiDrawer"></div>
  <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }">
    <div class="ai-header">
      <div>
        <h3>AI 助手</h3>
        <p class="section-caption">当前上下文：全局工作台</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>今日建议</h4>
      <p>建议先处理“联调验证延期 2 天”的里程碑，再安排实验二组负载均衡。若今天 15:00 前完成评审，整体基线偏差可收敛至 0.6 天。</p>
      <div class="ai-actions">
        <button class="btn-primary">一键采纳</button>
        <button class="btn-secondary">手动调整</button>
      </div>
    </div>
    <div class="ai-list">
      <div class="ai-list-item">
        <h4>风险提示 · 92% 置信度</h4>
        <p>项目 A 的联调节点和材料组算力申请集中在周三，建议提前协调资源窗口。</p>
      </div>
      <div class="ai-list-item">
        <h4>日报摘要</h4>
        <p>可直接生成晨报：包含 3 个重点风险、2 个关键进展和 1 个负载建议。</p>
      </div>
      <div class="ai-list-item">
        <h4>PBC 对齐提醒</h4>
        <p>张工本周已有 4 个任务可绑定到“提升团队协作效率”目标，预计达成率可提升 9%。</p>
      </div>
    </div>
  </aside>

  <Transition name="toast">
    <div v-if="toast.show" class="toast-shell">
      <div class="toast">
        <span class="material-symbols-outlined">{{ toast.icon }}</span>
        <div>
          <h4>{{ toast.title }}</h4>
          <p>{{ toast.message }}</p>
        </div>
      </div>
    </div>
  </Transition>
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

const isModalOpen = ref(false)
const isAiDrawerOpen = ref(false)
const toast = ref({ show: false, title: '', message: '', icon: '' })

const handleNavigate = (path) => {
  pushAppPath(router, path)
}

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
}

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false
}

const showToast = (title, message, icon) => {
  toast.value = { show: true, title, message, icon }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.project-create-modal {
  width: min(1200px, calc(100vw - 48px));
}

.project-create-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.45fr);
  gap: 20px;
}

.project-create-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.project-create-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.project-create-card {
  padding: 20px;
  border-radius: 24px;
}

.project-create-card h3,
.project-create-card p {
  margin: 0;
}

.project-create-kpis {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.project-create-kpi {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-kpi span,
.project-create-kpi strong {
  display: block;
}

.project-create-kpi span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.project-create-kpi strong {
  margin-top: 8px;
  font-size: 18px;
}

.project-create-step-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.project-create-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-step-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--color-primary-700);
  background: rgba(20, 104, 199, 0.12);
  border: 1px solid rgba(20, 104, 199, 0.16);
  font-size: 13px;
  font-weight: 700;
}

.project-create-step h4,
.project-create-step p {
  margin: 0;
}

.project-create-step p {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.project-create-owner-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.project-create-owner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(216, 221, 232, 0.88);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.project-create-owner img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.82);
}

.project-create-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.project-create-card-head h3,
.project-create-card-head p {
  margin: 0;
}

.project-create-field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.project-create-template-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.project-create-template {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.58);
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.project-create-template.active {
  background: rgba(20, 104, 199, 0.1);
  border-color: rgba(20, 104, 199, 0.18);
}

.project-create-template:hover {
  transform: translateY(-1px);
}

.project-create-template h4,
.project-create-template p {
  margin: 0;
}

.project-create-template p {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.project-create-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.project-create-textarea .field-input {
  align-items: flex-start;
  min-height: 136px;
}

.project-create-textarea textarea {
  min-height: 108px;
}

.project-create-status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.project-create-status-card {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.project-create-status-card span,
.project-create-status-card strong {
  display: block;
}

.project-create-status-card span {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.project-create-status-card strong {
  margin-top: 8px;
  font-size: 16px;
}

@media (max-width: 1279px) {
  .project-create-layout,
  .project-create-field-grid,
  .project-create-template-grid,
  .project-create-status-grid {
    grid-template-columns: 1fr;
  }
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
