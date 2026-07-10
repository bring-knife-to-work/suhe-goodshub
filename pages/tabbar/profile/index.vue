<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="user-section" @click="goLogin">
      <image class="avatar" :src="userInfo ? userInfo.avatar : '/static/logo/avatar.png'" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ userInfo ? userInfo.nickname : '点击登录' }}</text>
        <text class="phone">{{ userInfo ? userInfo.phone : '登录享受更多优惠' }}</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <!-- 订单状态 -->
    <view class="order-section card">
      <view class="order-header" @click="goOrderList(-1)">
        <text class="order-title">我的订单</text>
        <text class="order-more">查看全部 ›</text>
      </view>
      <view class="order-status-list">
        <view class="status-item" v-for="(s, idx) in orderStatuses" :key="idx" @click="goOrderList(s.value)">
          <text class="status-icon">{{ s.icon }}</text>
          <text class="status-name">{{ s.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section card">
      <view class="menu-item" v-for="(item, idx) in menuList" :key="idx" @click="handleMenu(item)">
        <view class="menu-left">
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-name">{{ item.name }}</text>
        </view>
        <view class="menu-right">
          <text class="menu-desc" v-if="item.desc">{{ item.desc }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" v-if="isLoggedIn" @click="handleLogout">
      退出登录
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showToast } from '@/common/utils'

export default {
  data() {
    return {
      orderStatuses: [
        { label: '待付款', icon: '💳', value: 0 },
        { label: '待发货', icon: '📦', value: 1 },
        { label: '待收货', icon: '🚚', value: 2 },
        { label: '待评价', icon: '✍️', value: 3 },
        { label: '已完成', icon: '✅', value: 4 }
      ],
      menuList: [
        { name: '收货地址', icon: '📍', path: '' },
        { name: '优惠券', icon: '🎫', desc: '0张', path: '' },
        { name: '我的收藏', icon: '❤️', path: '' },
        { name: '浏览记录', icon: '👁️', path: '' },
        { name: '联系客服', icon: '💬', path: '' },
        { name: '设置', icon: '⚙️', path: '' }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'userInfo'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    goLogin() {
      if (!this.isLoggedIn) {
        uni.navigateTo({ url: '/pages/login/index' })
      }
    },
    goOrderList(status) {
      if (!this.isLoggedIn) {
        showToast('请先登录')
        uni.navigateTo({ url: '/pages/login/index' })
        return
      }
      uni.navigateTo({ url: `/pages/order/list/index?status=${status}` })
    },
    handleMenu(item) {
      showToast(item.name + '功能开发中')
    },
    async handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.logout()
            showToast('已退出')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.profile-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  padding: 24rpx;
}

/* 用户信息 */
.user-section {
  background: linear-gradient(135deg, #ff4d4f, #ff6b6b);
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 20rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.4);
  background: #fff;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.nickname {
  font-size: 36rpx;
  font-weight: bold;
}
.phone {
  font-size: 26rpx;
  opacity: 0.85;
}
.arrow {
  font-size: 48rpx;
  opacity: 0.7;
}

/* 订单 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.order-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.order-more {
  color: #999;
  font-size: 26rpx;
}
.order-status-list {
  display: flex;
  justify-content: space-around;
}
.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.status-icon {
  font-size: 48rpx;
}
.status-name {
  font-size: 24rpx;
  color: #666;
}

/* 菜单 */
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.menu-icon {
  font-size: 36rpx;
}
.menu-name {
  font-size: 28rpx;
  color: #333;
}
.menu-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.menu-desc {
  font-size: 24rpx;
  color: #999;
}
.menu-arrow {
  font-size: 36rpx;
  color: #ccc;
}

/* 退出 */
.logout-btn {
  margin: 40rpx 20rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #fff;
  border-radius: 16rpx;
  color: #ff4d4f;
  font-size: 30rpx;
}
.logout-btn:active {
  background: #f5f5f5;
}
</style>
