<template>
  <view class="login-page">
    <view class="login-header">
      <text class="logo">🛍️</text>
      <text class="title">优选商城</text>
      <text class="subtitle">发现好物，享受生活</text>
    </view>

    <view class="login-form">
      <view class="input-group">
        <view class="input-item">
          <text class="input-icon">👤</text>
          <input class="input-field" v-model="username" placeholder="请输入用户名" placeholder-class="placeholder" />
        </view>
        <view class="input-item">
          <text class="input-icon">🔒</text>
          <input class="input-field" v-model="password" type="password" placeholder="请输入密码" placeholder-class="placeholder" />
        </view>
      </view>

      <button class="login-btn" @click="handleLogin" :loading="loading">登录</button>

      <view class="login-hint">
        测试账号：任意用户名密码即可登录
      </view>
    </view>

    <view class="login-footer">
      <text class="footer-text">其他登录方式</text>
      <view class="social-login">
        <view class="social-item" @click="wechatLogin">
          <text class="social-icon">💬</text>
          <text class="social-name">微信</text>
        </view>
        <view class="social-item" @click="phoneLogin">
          <text class="social-icon">📱</text>
          <text class="social-name">手机号</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import { showToast, showLoading, hideLoading } from '@/common/utils'

export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    async handleLogin() {
      if (!this.username.trim()) {
        showToast('请输入用户名')
        return
      }
      this.loading = true
      showLoading('登录中...')
      try {
        await this.login({ username: this.username, password: this.password })
        hideLoading()
        showToast('登录成功', 'success')
        setTimeout(() => {
          uni.switchTab({ url: '/pages/tabbar/profile/index' })
        }, 800)
      } catch (e) {
        hideLoading()
        showToast('登录失败，请重试')
      }
      this.loading = false
    },
    wechatLogin() {
      showToast('微信登录开发中')
    },
    phoneLogin() {
      showToast('手机号登录开发中')
    }
  }
}
</script>

<style scoped>
.login-page {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  padding-bottom: 60rpx;
}
.logo {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}
.subtitle {
  font-size: 28rpx;
  color: #999;
}

.login-form {
  padding: 0 60rpx;
}
.input-group {
  margin-bottom: 40rpx;
}
.input-item {
  display: flex;
  align-items: center;
  height: 88rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 20rpx;
}
.input-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}
.input-field {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
}
.placeholder {
  color: #bbb;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}
.login-btn:active {
  opacity: 0.85;
}

.login-hint {
  text-align: center;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #ccc;
}

.login-footer {
  margin-top: 80rpx;
  text-align: center;
}
.footer-text {
  font-size: 24rpx;
  color: #ccc;
  position: relative;
  display: inline-block;
}
.footer-text::before,
.footer-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60rpx;
  height: 1rpx;
  background: #eee;
}
.footer-text::before {
  right: 100%;
  margin-right: 20rpx;
}
.footer-text::after {
  left: 100%;
  margin-left: 20rpx;
}
.social-login {
  display: flex;
  justify-content: center;
  gap: 60rpx;
  margin-top: 30rpx;
}
.social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.social-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}
.social-name {
  font-size: 24rpx;
  color: #999;
}
</style>
