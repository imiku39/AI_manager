<template>
  <div class="login-page">
    <main class="auth-shell">
      <section class="auth-card glass-panel-strong">
        <div class="auth-header">
          <div class="auth-brand-mark">
            <span class="material-symbols-outlined" style="font-size: 34px;">science</span>
          </div>
          <h1 class="page-title" style="font-size: 28px; margin: 0;">Ethereal Lab</h1>
          <p class="page-subtitle" style="margin: 0;">
            欢迎回来，请登录你的 AI 驱动型研发协作账户。
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="field-stack">
            <label class="field-label">用户名</label>
            <div class="field-input">
              <span class="material-symbols-outlined">person</span>
              <input v-model="loginForm.username" type="text" placeholder="请输入研发工号" />
            </div>
          </div>

          <div class="field-stack">
            <label class="field-label">密码</label>
            <div class="field-input">
              <span class="material-symbols-outlined">lock</span>
              <input v-model="loginForm.password" type="password" placeholder="请输入安全密码" />
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; color: var(--color-text-secondary); font-size: 13px;">
            <label style="display:flex; gap:8px; align-items:center;">
              <input v-model="loginForm.rememberMe" type="checkbox" />
              记住我
            </label>
            <a href="#" style="color: var(--color-primary-700); font-weight: 600;" @click.prevent="router.push('/register')">
              还没有账户？去注册
            </a>
          </div>

          <button class="btn-primary" type="submit" style="min-height: 54px; font-size: 18px;">
            立即登录
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        <div style="display:flex; align-items:center; gap:16px; color: var(--color-text-tertiary); font-size: 12px;">
          <div style="height:1px; flex:1; background: rgba(216,221,232,0.9);"></div>
          <span>第三方接入</span>
          <div style="height:1px; flex:1; background: rgba(216,221,232,0.9);"></div>
        </div>

        <div style="display:flex; justify-content:center; gap:16px;">
          <button class="icon-btn glass-soft" type="button" @click="handleSocialLogin('fingerprint')">
            <span class="material-symbols-outlined">fingerprint</span>
          </button>
          <button class="icon-btn glass-soft" type="button" @click="handleSocialLogin('qr_code_scanner')">
            <span class="material-symbols-outlined">qr_code_scanner</span>
          </button>
        </div>

        <p class="section-caption" style="text-align:center; margin: 0;"> 2026 Ethereal Lab 研发管理系统</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineOptions({
  name: "LoginPage",
});

const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

const handleSubmit = () => {
  localStorage.setItem('token', 'mock-token')
  localStorage.setItem('userRole', 'super_admin')
  router.push('/dashboard')
};

const handleSocialLogin = (provider) => {
  console.log('social login:', provider)
};
</script>

<style>
.login-page {
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

.login-page .auth-shell {
  min-height: 100vh;
}
</style>
