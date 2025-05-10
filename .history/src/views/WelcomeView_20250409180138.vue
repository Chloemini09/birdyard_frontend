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
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
      <button @click="verifyPassword">验证</button>
    </div>

    <!-- 验证成功后的Home界面 -->
    <div v-else class="home-page">
      <h2>Home</h2>
      <p>欢迎来到主页面！</p>
      <p>这里是系统主界面内容</p>
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
      correctPassword: 'TA18',
    }
  },
  methods: {
    verifyPassword() {
      if (this.password === this.correctPassword) {
        this.authenticated = true
        this.errorMessage = ''
      } else {
        this.errorMessage = '密码错误，请重新输入'
        this.password = ''
      }
    },
    logout() {
      this.authenticated = false
      this.password = ''
    },
  },
}
</script>

<!-- 使用 Composition API 的写法 -->
<!--
<script setup>
import { ref } from 'vue';

const password = ref('');
const errorMessage = ref('');
const authenticated = ref(false);
const correctPassword = 'TA18';

const verifyPassword = () => {
  if (password.value === correctPassword) {
    authenticated.value = true;
    errorMessage.value = '';
  } else {
    errorMessage.value = '密码错误，请重新输入';
    password.value = '';
  }
};

const logout = () => {
  authenticated.value = false;
  password.value = '';
};
</script>
-->

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  color: #555;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.home-page {
  text-align: center;
}

.home-page h2 {
  color: #4caf50;
  margin-bottom: 20px;
}

.home-page p {
  color: #666;
  line-height: 1.6;
}
</style>
