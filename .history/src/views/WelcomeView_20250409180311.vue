<template>
  <div class="welcome-container">
    <div class="welcome-form">
      <h1>Welcome</h1>
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
      <button @click="verifyPassword">进入</button>
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
.welcome-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.welcome-form {
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
</style>
