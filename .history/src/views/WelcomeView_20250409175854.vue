<template>
  <div class="container">
    <!-- 密码验证表单 -->
    <div v-if="!authenticated" class="login-form">
      <h1>密码验证</h1>
      <div class="form-group">
        <label for="password">请输入密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          @keyup.enter="verifyPassword"
          placeholder="请输入密码"
        >
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
      <button @click="verifyPassword">验证</button>
    </div>
    
    <!-- 验证成功后的欢迎页面 -->
    <div v-else class="welcome-page">
      <h2>欢迎访问</h2>
      <p>您已成功通过密码验证！</p>
      <p>这是您的个人页面，感谢您的访问。</p>
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordVerification',
  data() {
    return {
      password: '',
      errorMessage: '',
      authenticated: false,
      correctPassword: 'TA18'
    }
  },
  methods: {
    verifyPassword() {
      if (this.password === this.correctPassword) {
        this.authenticated = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = '密码错误，请重新输入';
        this.password = '';
      }
    },
    logout() {
      this.authenticated = false;
      this.password = '';
    }
  }
}
</script>

<!--