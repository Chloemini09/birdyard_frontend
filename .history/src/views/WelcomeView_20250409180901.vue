<template>
  <div class="forest-background">
    <div class="welcome-container">
      <div class="welcome-form">
        <div class="logo-container">
          <img src="@/assets/images/logo.png" alt="Bird-Yard Logo" />
        </div>
        <h1>Welcome to BACKYARD</h1>
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
        <button @click="verifyPassword">进入森林</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeScreen',
  data() {
    return {
      password: '',
      errorMessage: '',
      correctPassword: 'TA18',
    }
  },
  methods: {
    verifyPassword() {
      if (this.password === this.correctPassword) {
        // 密码正确，跳转到Home页面
        this.$router.push('/home')
        // 如果不使用vue-router，也可以通过事件通知父组件切换
        this.$emit('auth-success')
      } else {
        this.errorMessage = '密码错误，请重新输入'
        this.password = ''
      }
    },
  },
}
</script>

<!-- 使用 Composition API 的写法 -->
<!--
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const password = ref('');
const errorMessage = ref('');
const correctPassword = 'TA18';
const router = useRouter();
const emit = defineEmits(['auth-success']);

const verifyPassword = () => {
  if (password.value === correctPassword) {
    // 密码正确，跳转到Home页面
    router.push('/home');
    // 如果不使用vue-router，也可以通过事件通知父组件切换
    emit('auth-success');
  } else {
    errorMessage.value = '密码错误，请重新输入';
    password.value = '';
  }
};
</script>
-->

<style scoped>
.forest-background {
  width: 100%;
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.forest-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.welcome-container {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.welcome-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: #34495e;
  font-size: 16px;
}

input {
  padding: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
}

button {
  padding: 14px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.2);
}

button:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
}

button:active {
  transform: translateY(0);
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
}
</style>
