<template>
  <view class="list-page">
    <!-- 搜索栏 -->
    <view class="search-bar" v-if="isSearch">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="keyword" placeholder="输入搜索关键词" @confirm="doSearch" confirm-type="search" />
        <text class="search-cancel" @click="goBack">取消</text>
      </view>
    </view>

    <!-- 排序/筛选 -->
    <view class="sort-bar">
      <view class="sort-item" :class="{ active: sortBy === 'default' }" @click="switchSort('default')">综合</view>
      <view class="sort-item" :class="{ active: sortBy === 'sales' }" @click="switchSort('sales')">销量</view>
      <view class="sort-item" :class="{ active: sortBy === 'price' }" @click="switchSort('price')">
        价格
        <text class="sort-arrow">{{ priceAsc ? '↑' : '↓' }}</text>
      </view>
      <view class="sort-item" :class="{ active: sortBy === 'new' }" @click="switchSort('new')">最新</view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list" v-if="goodsList.length">
      <view class="goods-item" v-for="(item, idx) in filteredList" :key="idx" @click="goDetail(item.goodsId)">
        <image class="goods-img" :src="item.image" mode="aspectFill" lazy-load />
        <view class="goods-info">
          <view class="goods-name ellipsis-2">{{ item.name }}</view>
          <view class="goods-price-row">
            <text class="price">{{ formatPrice(item.price) }}</text>
            <text class="original-price" v-if="item.originalPrice">{{ formatPrice(item.originalPrice) }}</text>
          </view>
          <view class="goods-footer">
            <text class="sales">已售 {{ formatCount(item.sales) }}</text>
            <view class="cart-btn" @click.stop="addCart(item)">
              <text class="cart-icon">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无商品</text>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="loading">加载中...</view>
  </view>
</template>

<script>
import { formatPrice, formatCount, showToast, showLoading, hideLoading } from '@/common/utils'

export default {
  data() {
    return {
      isSearch: false,
      keyword: '',
      goodsList: [],
      sortBy: 'default',
      priceAsc: false,
      page: 0,
      loading: false
    }
  },
  computed: {
    filteredList() {
      let list = [...this.goodsList]
      if (this.sortBy === 'price') {
        list.sort((a, b) => this.priceAsc ? a.price - b.price : b.price - a.price)
      } else if (this.sortBy === 'sales') {
        list.sort((a, b) => b.sales - a.sales)
      } else if (this.sortBy === 'new') {
        list.sort((a, b) => b.goodsId - a.goodsId)
      }
      return list
    }
  },
  onLoad(options) {
    if (options.search === '1') {
      this.isSearch = true
      uni.setNavigationBarTitle({ title: '搜索商品' })
    }
    if (options.type === 'flash') {
      uni.setNavigationBarTitle({ title: '限时秒杀' })
    }
    this.loadGoods()
  },
  onReachBottom() {
    this.loadGoods()
  },
  methods: {
    formatPrice, formatCount,
    async loadGoods() {
      if (this.loading) return
      this.loading = true
      const res = await this.$http.get('/api/goods/list', {
        page: this.page,
        pageSize: 10,
        keyword: this.keyword
      })
      this.goodsList = [...this.goodsList, ...res.data]
      this.page++
      this.loading = false
    },
    switchSort(type) {
      if (this.sortBy === type && type === 'price') {
        this.priceAsc = !this.priceAsc
      } else {
        this.sortBy = type
        if (type !== 'price') this.priceAsc = false
      }
    },
    doSearch() {
      this.goodsList = []
      this.page = 0
      this.loadGoods()
    },
    goDetail(goodsId) {
      uni.navigateTo({ url: `/pages/goods/detail/index?goodsId=${item.goodsId}` })
    },
    goBack() {
      uni.navigateBack()
    },
    addCart(item) {
      this.$store.commit('cart/ADD_TO_CART', {
        goodsId: item.goodsId,
        name: item.name,
        image: item.image,
        price: item.price
      })
      showToast('已加入购物车', 'success')
    }
  }
}
</script>

<style scoped>
.list-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.search-bar {
  padding: 16rpx 20rpx;
  background: #fff;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.search-icon { font-size: 28rpx; }
.search-input {
  flex: 1;
  height: 64rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}
.search-cancel {
  color: #666;
  font-size: 28rpx;
}

/* 排序栏 */
.sort-bar {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #eee;
  padding: 0 20rpx;
}
.sort-item {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
.sort-item.active {
  color: #ff4d4f;
  font-weight: bold;
}
.sort-arrow {
  font-size: 24rpx;
}

/* 商品列表 */
.goods-list {
  padding: 16rpx;
}
.goods-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.goods-img {
  width: 220rpx;
  height: 220rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}
.goods-info {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-name {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
}
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods-price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
.price {
  color: #ff4d4f;
  font-size: 32rpx;
  font-weight: bold;
}
.original-price {
  color: #999;
  font-size: 22rpx;
  text-decoration: line-through;
}
.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sales {
  color: #999;
  font-size: 22rpx;
}
.cart-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-icon {
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.empty-icon { font-size: 120rpx; opacity: 0.3; }
.empty-text { color: #999; font-size: 28rpx; margin-top: 20rpx; }
.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}
</style>
