<template>
  <view class="home">
    <!-- 搜索栏 -->
    <view class="header-bar">
      <view class="location" @click="goLocation">
        <text class="location-icon">📍</text>
        <text class="location-text">北京</text>
        <text class="arrow">▼</text>
      </view>
      <SearchBar :fixed="false" />
      <view class="header-actions">
        <text class="msg-icon" @click="goMessage">🔔</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500" circular indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff">
      <swiper-item v-for="(item, idx) in banners" :key="idx" @click="goLink(item.link)">
        <image class="banner-img" :src="item.image" mode="scaleToFill" lazy-load />
      </swiper-item>
    </swiper>

    <!-- 分类快捷入口 -->
    <view class="quick-nav">
      <view class="nav-item" v-for="(item, idx) in quickNavs" :key="idx" @click="goCategory(item.id)">
        <view class="nav-icon">{{ item.icon }}</view>
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 限时秒杀 -->
    <view class="section flash-section" v-if="flashSales.length">
      <view class="section-header">
        <view class="section-title">
          <text class="flash-icon">⚡</text>
          <text class="title-text">限时秒杀</text>
          <text class="countdown" v-if="flashEndTime > 0">
            <text class="time-block">{{ padZero(remainHours) }}</text>
            <text class="time-sep">:</text>
            <text class="time-block">{{ padZero(remainMinutes) }}</text>
            <text class="time-sep">:</text>
            <text class="time-block">{{ padZero(remainSeconds) }}</text>
          </text>
        </view>
        <view class="section-more" @click="goFlashList">更多 ›</view>
      </view>
      <scroll-view class="flash-scroll" scroll-x>
        <view class="flash-item" v-for="(item, idx) in flashSales" :key="idx" @click="goGoodsDetail(item.goodsId)">
          <image class="flash-img" :src="item.image" mode="aspectFill" />
          <text class="flash-price">{{ formatPrice(item.price) }}</text>
          <text class="flash-original">{{ formatPrice(item.originalPrice) }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 推荐商品 -->
    <view class="section recommend-section">
      <view class="section-header">
        <view class="section-title">
          <text class="title-text hot">🔥 热门推荐</text>
        </view>
        <view class="section-more" @click="goGoodsList">查看更多 ›</view>
      </view>
      <view class="goods-grid">
        <GoodsCard v-for="(item, idx) in recommendGoods" :key="idx" :goods="item" class="goods-item" />
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'
import GoodsCard from '@/components/GoodsCard.vue'
import { formatPrice, formatCount, padZero, showToast } from '@/common/utils'

export default {
  components: { SearchBar, GoodsCard },
  data() {
    return {
      banners: [],
      quickNavs: [
        { id: 2, name: '女装', icon: '👗' },
        { id: 3, name: '男装', icon: '👔' },
        { id: 4, name: '鞋靴', icon: '👟' },
        { id: 5, name: '箱包', icon: '👜' },
        { id: 7, name: '美妆', icon: '💄' },
        { id: 8, name: '数码', icon: '📱' },
        { id: 9, name: '家居', icon: '🏠' },
        { id: 12, name: '运动', icon: '⚽' },
        { id: 10, name: '食品', icon: '🍜' },
        { id: 11, name: '母婴', icon: '🍼' }
      ],
      flashSales: [],
      recommendGoods: [],
      flashEndTime: 0,
      remainHours: 0,
      remainMinutes: 0,
      remainSeconds: 0,
      timer: null
    }
  },
  onLoad() {
    this.loadData()
  },
  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },
  onPullDownRefresh() {
    this.loadData()
    setTimeout(() => uni.stopPullDownRefresh(), 800)
  },
  methods: {
    formatPrice, padZero,
    async loadData() {
      const [bannerRes, flashRes, recommendRes] = await Promise.all([
        this.$http.get('/api/home/banners'),
        this.$http.get('/api/home/flash-sales'),
        this.$http.get('/api/home/recommend')
      ])
      this.banners = bannerRes.data
      this.flashSales = flashRes.data
      this.recommendGoods = recommendRes.data
      if (this.flashSales.length) {
        this.flashEndTime = this.flashSales[0].flashEndTime
        this.startCountdown()
      }
    },
    startCountdown() {
      const update = () => {
        const diff = Math.max(0, this.flashEndTime - Date.now())
        if (diff <= 0) { clearInterval(this.timer); return }
        this.remainHours = Math.floor(diff / 3600000)
        this.remainMinutes = Math.floor((diff % 3600000) / 60000)
        this.remainSeconds = Math.floor((diff % 60000) / 1000)
      }
      update()
      this.timer = setInterval(update, 1000)
    },
    goGoodsDetail(id) {
      uni.navigateTo({ url: `/pages/goods/detail/index?goodsId=${id}` })
    },
    goGoodsList() {
      uni.navigateTo({ url: '/pages/goods/list/index' })
    },
    goFlashList() {
      uni.navigateTo({ url: '/pages/goods/list/index?type=flash' })
    },
    goCategory(id) {
      uni.switchTab({ url: '/pages/tabbar/category/index' })
    },
    goLocation() { showToast('定位功能开发中') },
    goMessage() { showToast('消息功能开发中') },
    goLink(url) {
      if (url) uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.home {
  background: #f5f5f5;
  min-height: 100vh;
}
.header-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #ff4d4f, #ff6b6b);
  padding: 20rpx 0 10rpx;
}
.location {
  display: flex;
  align-items: center;
  padding: 0 10rpx 0 20rpx;
  color: #fff;
  font-size: 26rpx;
}
.location-icon { margin-right: 4rpx; }
.arrow { font-size: 20rpx; margin-left: 4rpx; }
.search-bar { flex: 1; }
.header-actions { padding: 0 20rpx; }
.msg-icon { font-size: 44rpx; }

/* 轮播 */
.banner {
  height: 300rpx;
}
.banner-img {
  width: 100%;
  height: 300rpx;
}

/* 快捷导航 */
.quick-nav {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 20rpx 0 10rpx;
  margin-bottom: 16rpx;
}
.nav-item {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16rpx;
}
.nav-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #fff5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
.nav-name {
  font-size: 24rpx;
  color: #666;
}

/* 公共区块 */
.section {
  background: #fff;
  margin-bottom: 16rpx;
  padding: 20rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.title-text { font-size: 32rpx; font-weight: bold; color: #333; }
.title-text.hot { color: #ff4d4f; }
.flash-icon { font-size: 36rpx; }
.countdown { display: flex; align-items: center; margin-left: 12rpx; }
.time-block {
  background: #333;
  color: #fff;
  font-size: 22rpx;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
  font-weight: bold;
}
.time-sep { color: #333; margin: 0 4rpx; font-weight: bold; }
.section-more {
  color: #999;
  font-size: 26rpx;
}

/* 秒杀 */
.flash-scroll { white-space: nowrap; }
.flash-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  width: 180rpx;
}
.flash-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}
.flash-price { color: #ff4d4f; font-size: 28rpx; font-weight: bold; margin-top: 8rpx; }
.flash-original { color: #999; font-size: 22rpx; text-decoration: line-through; }

/* 推荐商品 */
.goods-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.goods-item {
  width: calc(50% - 8rpx);
}
</style>
