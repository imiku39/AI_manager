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
        <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')"><span class="material-symbols-outlined">dashboard</span><span>全局工作台</span></a>
        <a class="nav-item active" href="#" @click.prevent="handleNavigate('/projects')"><span class="material-symbols-outlined">account_tree</span><span>项目列表</span></a>
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
            <span>项目</span>
            <span>/</span>
            <span>项目矩阵</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <label class="search-shell">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="搜索项目、负责人、标签..." />
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
            <h1 class="page-title">项目矩阵</h1>
            <p class="page-subtitle">展示所有有权限查看的项目，支持搜索、筛选、排序和快速新建。</p>
          </div>
          <div class="page-actions">
            <div class="glass-soft" style="padding: 10px 14px; border-radius: 20px; display: flex; align-items: center; gap: 14px;">
              <div class="avatar-stack">
                <img src="https://i.pravatar.cc/80?img=15" alt="成员1" />
                <img src="https://i.pravatar.cc/80?img=32" alt="成员2" />
                <img src="https://i.pravatar.cc/80?img=45" alt="成员3" />
              </div>
              <span class="muted" style="font-size: 14px;">12 位活跃成员</span>
            </div>
            <button class="btn-primary" @click="openModal"><span class="material-symbols-outlined">add</span>新建项目</button>
          </div>
        </div>

        <section class="glass-panel filter-bar">
          <label class="search-shell" style="margin-right: auto;">
            <span class="material-symbols-outlined">search</span>
            <input type="text" placeholder="按项目名称或关键字筛选..." />
          </label>
          <button class="btn-chip active"><span class="material-symbols-outlined">tune</span>全部状态</button>
          <button class="btn-chip"><span class="material-symbols-outlined">person_search</span>负责人</button>
          <button class="btn-chip"><span class="material-symbols-outlined">sell</span>标签</button>
          <button class="btn-chip"><span class="material-symbols-outlined">calendar_today</span>截止日期</button>
          <button class="btn-chip"><span class="material-symbols-outlined">sort</span>权重排序</button>
        </section>

        <section style="display: flex; flex-direction: column; gap: 16px;">
          <a class="glass-panel project-row" href="#" @click.prevent="handleNavigate('/project/1')">
            <div class="project-meta">
              <div class="project-title-line">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-primary-600); display: inline-block;"></span>
                <h3>纳米晶体结构优化</h3>
              </div>
              <p>材料科学部 · 项目编号：RD-2026-089 · 标签：结构迭代 / AI 预测</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="section-caption">完成度</span>
                <strong style="color: var(--color-primary-700);">72%</strong>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 72%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div></div>
            </div>
            <div>
              <span class="status-tag success">健康度：良好</span>
              <p class="task-note" style="margin-top: 8px;">状态：进行中</p>
            </div>
            <div class="member-chip">
              <img src="https://i.pravatar.cc/80?img=47" alt="王志强" />
              <div>
                <strong>王志强</strong>
                <span class="section-caption">负责人</span>
              </div>
            </div>
            <div>
              <strong>2026-05-16</strong>
              <p class="task-note" style="margin-top: 6px;">成员数：12</p>
            </div>
            <span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span>
          </a>

          <a class="glass-panel project-row" href="#" @click.prevent="handleNavigate('/project/1')">
            <div class="project-meta">
              <div class="project-title-line">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-tertiary-600); display: inline-block;"></span>
                <h3>深度学习实验室自动化</h3>
              </div>
              <p>计算物理组 · 项目编号：RD-2026-112 · 标签：平台改造 / 自动化</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="section-caption">完成度</span>
                <strong style="color: var(--color-tertiary-600);">45%</strong>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 45%; background: linear-gradient(90deg, #a871ff, var(--color-tertiary-600));"></div></div>
            </div>
            <div>
              <span class="status-tag warning">健康度：风险</span>
              <p class="task-note" style="margin-top: 8px;">状态：进行中</p>
            </div>
            <div class="member-chip">
              <img src="https://i.pravatar.cc/80?img=22" alt="陈思远" />
              <div>
                <strong>陈思远</strong>
                <span class="section-caption">负责人</span>
              </div>
            </div>
            <div>
              <strong>2026-05-30</strong>
              <p class="task-note" style="margin-top: 6px;">成员数：9</p>
            </div>
            <span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span>
          </a>

          <a class="glass-panel project-row" href="#" @click.prevent="handleNavigate('/project/1')">
            <div class="project-meta">
              <div class="project-title-line">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-danger-600); display: inline-block;"></span>
                <h3>量子纠缠通信协议 V2</h3>
              </div>
              <p>前沿实验室 · 项目编号：RD-2025-456 · 标签：协议升级 / 高风险</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="section-caption">完成度</span>
                <strong style="color: var(--color-danger-600);">15%</strong>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 15%; background: linear-gradient(90deg, #f36b63, var(--color-danger-600));"></div></div>
            </div>
            <div>
              <span class="status-tag danger">健康度：严重</span>
              <p class="task-note" style="margin-top: 8px;">状态：已暂停</p>
            </div>
            <div class="member-chip">
              <img src="https://i.pravatar.cc/80?img=11" alt="林博士" />
              <div>
                <strong>林博士</strong>
                <span class="section-caption">负责人</span>
              </div>
            </div>
            <div>
              <strong>2026-06-08</strong>
              <p class="task-note" style="margin-top: 6px;">成员数：7</p>
            </div>
            <span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span>
          </a>

          <a class="glass-panel project-row" href="#" @click.prevent="handleNavigate('/project/1')">
            <div class="project-meta">
              <div class="project-title-line">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-secondary-600); display: inline-block;"></span>
                <h3>生物聚合材料耐久性测试</h3>
              </div>
              <p>生物工程组 · 项目编号：RD-2026-201 · 标签：性能验证 / 已交付</p>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span class="section-caption">完成度</span>
                <strong style="color: var(--color-secondary-600);">100%</strong>
              </div>
              <div class="progress-track"><div class="progress-fill" style="width: 100%; background: linear-gradient(90deg, #38c59b, var(--color-secondary-600));"></div></div>
            </div>
            <div>
              <span class="status-tag success">健康度：完成</span>
              <p class="task-note" style="margin-top: 8px;">状态：已归档</p>
            </div>
            <div class="member-chip">
              <img src="https://i.pravatar.cc/80?img=35" alt="周雅楠" />
              <div>
                <strong>周雅楠</strong>
                <span class="section-caption">负责人</span>
              </div>
            </div>
            <div>
              <strong>2026-04-18</strong>
              <p class="task-note" style="margin-top: 6px;">成员数：5</p>
            </div>
            <span class="icon-btn"><span class="material-symbols-outlined">more_vert</span></span>
          </a>
        </section>

        <section class="grid-3">
          <div class="glass-panel metric-card">
            <h3>研发预算分配</h3>
            <div class="value" style="font-size: 38px; color: var(--color-primary-700);">¥ 12.4M</div>
            <div class="trend" style="color: var(--color-secondary-600);">+4.2% 较上周</div>
            <div class="progress-track" style="margin-top: 18px;"><div class="progress-fill" style="width: 60%; background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-700));"></div></div>
          </div>
          <div class="glass-panel metric-card" style="text-align: center;">
            <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-tertiary-600);">rocket_launch</span>
            <div class="value" style="font-size: 46px;">24</div>
            <p class="page-subtitle" style="font-size: 14px;">本月新启动实验</p>
          </div>
          <div class="glass-panel metric-card" style="text-align: center;">
            <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-secondary-600);">verified</span>
            <div class="value" style="font-size: 46px;">182</div>
            <p class="page-subtitle" style="font-size: 14px;">累计专利申请量</p>
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
          <p class="page-subtitle" style="font-size: 15px; margin-top: 10px;">参考当前项目矩阵页的展示维度，先完成名称、编号、负责人、标签、状态与截止时间等核心信息配置，创建后可继续进入详情页补充内容。</p>
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
            <p class="page-subtitle" style="font-size: 14px; margin-top: 12px;">适合作为项目矩阵页的快捷创建入口，先生成结构化草稿，再在项目详情、甘特图、风险和报表中逐步补全。</p>

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
        <p class="section-caption">当前上下文：项目矩阵</p>
      </div>
      <button class="icon-btn" @click="closeAiDrawer"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="ai-card">
      <h4>智能分组建议</h4>
      <p>建议将“量子纠缠通信协议 V2”提升至重点风险视图，并将“深度学习实验室自动化”的联调节点提前 3 天，以降低周四并发评审压力。</p>
      <div class="ai-actions">
        <button class="btn-primary">一键采纳</button>
        <button class="btn-secondary">查看项目</button>
      </div>
    </div>
    <div class="ai-list">
      <div class="ai-list-item">
        <h4>新建项目推荐模板</h4>
        <p>如果新项目属于需求迭代，建议优先使用“需求评审 → 开发 → 测试 → 上线 → 验收”模板。</p>
      </div>
      <div class="ai-list-item">
        <h4>负载提醒 · 89% 置信度</h4>
        <p>材料组与平台组在下周二至周四存在资源交叉峰值，建议在项目创建阶段提前锁定负责人。</p>
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
