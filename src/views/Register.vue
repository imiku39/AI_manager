<template>
  <div class="register-page">
    <main class="auth-shell">
      <section class="auth-card glass-panel-strong" style="width:min(720px,100%);">
        <div class="auth-header">
          <div class="auth-brand-mark">
            <span class="material-symbols-outlined" style="font-size: 34px;">person_add</span>
          </div>
          <h1 class="page-title" style="font-size: 28px; margin: 0;">创建协作账户</h1>
          <p class="page-subtitle" style="margin: 0;">
            延续登录页风格，注册后可进入项目、任务、报表与 AI 协作流程。
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="field-inline">
            <div class="field-stack">
              <label class="field-label">账号</label>
              <div class="field-input">
                <span class="material-symbols-outlined">badge</span>
                <input v-model="registerForm.account" type="text" placeholder="研发工号" />
              </div>
            </div>
            <div class="field-stack">
              <label class="field-label">姓名</label>
              <div class="field-input">
                <span class="material-symbols-outlined">person</span>
                <input v-model="registerForm.name" type="text" placeholder="请输入姓名" />
              </div>
            </div>
          </div>

          <div class="field-inline">
            <div class="field-stack">
              <label class="field-label">邮箱</label>
              <div class="field-input">
                <span class="material-symbols-outlined">mail</span>
                <input v-model="registerForm.email" type="email" placeholder="请输入邮箱" />
              </div>
            </div>
            <div class="field-stack">
              <label class="field-label">部门</label>
              <div class="field-input">
                <span class="material-symbols-outlined">apartment</span>
                <input v-model="registerForm.department" type="text" placeholder="请输入部门" />
              </div>
            </div>
          </div>

          <div class="field-inline">
            <div class="field-stack">
              <label class="field-label">密码</label>
              <div class="field-input">
                <span class="material-symbols-outlined">lock</span>
                <input v-model="registerForm.password" type="password" placeholder="设置密码" />
              </div>
            </div>
            <div class="field-stack">
              <label class="field-label">确认密码</label>
              <div class="field-input">
                <span class="material-symbols-outlined">verified_user</span>
                <input v-model="registerForm.confirmPassword" type="password" placeholder="再次输入密码" />
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; gap:14px; align-items:center;">
            <span class="section-caption">提交后由系统管理员审核并分配平台角色。</span>
            <a href="#" style="color: var(--color-primary-700); font-weight: 600;" @click.prevent="router.push('/login')">
              返回登录
            </a>
          </div>

          <button class="btn-primary" type="submit" style="min-height:54px; font-size:18px;">
            提交注册
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineOptions({
  name: "RegisterPage",
});

const registerForm = reactive({
  account: "",
  name: "",
  email: "",
  department: "",
  password: "",
  confirmPassword: "",
});

const handleSubmit = () => {
  router.push('/login')
};
</script>

<style>
.register-page {
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

.register-page .auth-shell {
  min-height: 100vh;
}
</style>
