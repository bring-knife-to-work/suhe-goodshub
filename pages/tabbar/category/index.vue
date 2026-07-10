<template>
  <view class="category-page">
    <view class="category-search">
      <view class="search-box" @click="goSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>
    <view class="category-content">
      <!-- 左侧一级分类 -->
      <scroll-view class="left-menu" scroll-y :scroll-into-view="'menu-' + activeCategory" show-scrollbar="false">
        <view
          class="menu-item"
          :class="{ active: activeCategory === item.id }"
          v-for="item in categories"
          :key="item.id"
          :id="'menu-' + item.id"
          @click="switchCategory(item.id)"
        >
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-name">{{ item.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧子分类 + 商品 -->
      <scroll-view class="right-content" scroll-y @scrolltolower="loadMore">
        <!-- 子分类 -->
        <view class="sub-list" v-if="subCategories.length">
          <view
            class="sub-item"
            :class="{ active: activeSub === sub.id }"
            v-for="sub in subCategories"
            :key="sub.id"
            @click="switchSubCategory(sub.id)"
          >
            {{ sub.name }}
          </view>
        </view>

        <!-- 推荐标题 -->
        <view class="recommend-title">— 精选推荐 —</view>

        <!-- 商品列表 -->
        <view class="goods-list">
          <view class="goods-item" v-for="(item, idx) in goodsList" :key="idx" @click="goDetail(item.goodsId)">
            <image class="goods-img" :src="item.image" mode="aspectFill" lazy-load />
            <view class="goods-info">
              <view class="goods-name ellipsis-2">{{ item.name }}</view>
              <view class="goods-price">{{ formatPrice(item.price) }}</view>
            </view>
          </view>
        </view>

        <view class="load-more" v-if="loading">加载中...</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { formatPrice, formatCount, showToast } from '@/common/utils'

export default {
  data() {
    return {
      categories: [],
      activeCategory: 2,
      subCategories: [],
      activeSub: null,
      goodsList: [],
      page: 0,
      loading: false,
      hasMore: true
    }
  },
  onLoad() {
    this.loadCategories()
  },
  onShow() {
    // 每次显示刷新数据
  },
  methods: {
    formatPrice,
    async loadCategories() {
      const res = await this.$http.get('/api/categories')
      this.categories = res.data
      if (this.categories.length) {
        this.activeCategory = this.categories[1]?.id || this.categories[0].id
        this.switchCategory(this.activeCategory)
      }
    },
    async switchCategory(id) {
      this.activeCategory = id
      this.activeSub = null
      this.goodsList = []
      this.page = 0
      this.hasMore = true

      // 加载子分类
      const subRes = await this.$http.get('/api/categories/sub', { categoryId: id })
      this.subCategories = subRes.data

      // 加载商品
      this.loadGoods()
    },
    switchSubCategory(subId) {
      this.activeSub = subId
      this.goodsList = []
      this.page = 0
      this.hasMore = true
      this.loadGoods()
    },
    async loadGoods() {
      if (this.loading || !this.hasMore) return
      this.loading = true
      const res = await this.$http.get('/api/goods/list', {
        categoryId: this.activeCategory,
        page: this.page,
        pageSize: 10
      })
      this.goodsList = [...this.goodsList, ...res.data]
      this.page++
      this.hasMore = res.data.length >= 10
      this.loading = false
    },
    loadMore() {
      this.loadGoods()
    },
    goDetail(goodsId) {
      uni.navigateTo({ url: `/pages/goods/detail/index?goodsId=${goodsId}` })
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/goods/list/index?search=1' })
    }
  }
}
</script>

<style scoped>
.category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}
.category-search {
  padding: 16rpx 20rpx;
  background: #fff;
}
.search-box {
  height: 64rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.search-icon { font-size: 28rpx; }
.search-placeholder { color: #999; font-size: 26rpx; }

.category-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.left-menu {
  width: 180rpx;
  background: #fafafa;
  height: 100%;
}
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
  font-size: 24rpx;
  color: #666;
  border-left: 4rpx solid transparent;
  transition: all 0.2s;
}
.menu-item.active {
  background: #fff;
  color: #ff4d4f;
  font-weight: bold;
  border-left-color: #ff4d4f;
}
.menu-icon {
  font-size: 40rpx;
  margin-bottom: 6rpx;
}
.right-content {
  flex: 1;
  padding: 20rpx;
  background: #fff;
}
.sub-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.sub-item {
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  background: #f5f5f5;
  font-size: 24rpx;
  color: #666;
}
.sub-item.active {
  background: #fff0f0;
  color: #ff4d4f;
  font-weight: bold;
}
.recommend-title {
  text-align: center;
  color: #ccc;
  font-size: 24rpx;
  margin: 20rpx 0;
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.goods-item {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.goods-img {
  width: 100%;
  height: 300rpx;
  background: #f5f5f5;
}
.goods-info {
  padding: 12rpx;
}
.goods-name {
  font-size: 24rpx;
  color: #333;
  height: 64rpx;
}
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods-price {
  color: #ff4d4f;
  font-size: 28rpx;
  font-weight: bold;
  margin-top: 8rpx;
}
.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 24rpx;
}
</style>
