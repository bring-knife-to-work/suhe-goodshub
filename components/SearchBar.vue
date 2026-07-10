<template>
  <view class="search-bar" :class="{ 'search-bar-fixed': fixed }">
    <view class="search-input" @click="handleClick">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">{{ placeholder }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: { type: String, default: '搜索商品' },
    fixed: { type: Boolean, default: false }
  },
  methods: {
    handleClick() {
      uni.navigateTo({
        url: '/pages/goods/list/index?search=1'
      })
    }
  }
}
</script>

<style scoped>
.search-bar {
  padding: 16rpx 20rpx;
}
.search-bar-fixed {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ff4d4f;
}
.search-input {
  height: 64rpx;
  background: rgba(255,255,255,0.9);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.search-icon {
  font-size: 28rpx;
}
.search-placeholder {
  color: #999;
  font-size: 26rpx;
}
</style>
