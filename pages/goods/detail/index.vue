<template>
  <view class="detail-page">
    <!-- 商品图片轮播 -->
    <swiper class="detail-swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff" autoplay circular>
      <swiper-item v-for="(img, idx) in goods.images" :key="idx">
        <image class="swiper-img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 价格信息 -->
    <view class="price-section">
      <view class="price-row">
        <text class="price">{{ formatPrice(goods.price) }}</text>
        <text class="original-price" v-if="goods.originalPrice">{{ formatPrice(goods.originalPrice) }}</text>
        <text class="sales">已售 {{ formatCount(goods.sales) }}</text>
      </view>
      <view class="desc-row">
        <text class="goods-name">{{ goods.name }}</text>
      </view>
      <view class="specs-row" v-if="goods.specs && goods.specs.length">
        <text class="specs-tag" v-for="(spec, idx) in goods.specs" :key="idx">{{ spec }}</text>
      </view>
    </view>

    <!-- 商品描述 -->
    <view class="desc-section card">
      <view class="desc-title">商品详情</view>
      <view class="desc-content">{{ goods.desc }}</view>
    </view>

    <!-- 底部操作栏 -->
    <view class="detail-footer">
      <view class="footer-icon" @click="goHome">
        <text class="fi">🏠</text>
        <text class="fl">首页</text>
      </view>
      <view class="footer-icon" @click="goCart">
        <text class="fi">🛒</text>
        <text class="fl">购物车</text>
        <text class="badge" v-if="cartTotal > 0">{{ cartTotal }}</text>
      </view>
      <view class="footer-cart btn" @click="addCart">加入购物车</view>
      <view class="footer-buy btn primary" @click="buyNow">立即购买</view>
    </view>
  </view>
</template>

<script>
import { formatPrice, formatCount, showToast, showLoading, hideLoading } from '@/common/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      goods: {
        goodsId: 0,
        name: '',
        desc: '',
        images: [],
        price: 0,
        originalPrice: 0,
        sales: 0,
        stock: 0,
        specs: [],
        rating: 0
      }
    }
  },
  computed: {
    ...mapGetters('cart', ['cartTotal'])
  },
  onLoad(options) {
    if (options.goodsId) {
      this.loadGoods(options.goodsId)
    }
  },
  methods: {
    formatPrice, formatCount,
    async loadGoods(goodsId) {
      showLoading('加载中...')
      const res = await this.$http.get('/api/goods/detail', { goodsId })
      if (res.data) {
        this.goods = res.data
      }
      hideLoading()
    },
    addCart() {
      this.$store.commit('cart/ADD_TO_CART', {
        goodsId: this.goods.goodsId,
        name: this.goods.name,
        image: this.goods.images[0] || this.goods.image,
        price: this.goods.price
      })
      showToast('已加入购物车', 'success')
    },
    buyNow() {
      const goods = [{ ...this.goods, count: 1 }]
      const encoded = encodeURIComponent(JSON.stringify(goods))
      uni.navigateTo({ url: `/pages/order/confirm/index?goods=${encoded}` })
    },
    goHome() {
      uni.switchTab({ url: '/pages/tabbar/home/index' })
    },
    goCart() {
      uni.switchTab({ url: '/pages/tabbar/cart/index' })
    }
  }
}
</script>

<style scoped>
.detail-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  padding: 24rpx;
}

/* 轮播 */
.detail-swiper {
  height: 750rpx;
}
.swiper-img {
  width: 100%;
  height: 750rpx;
  background: #f5f5f5;
}

/* 价格区 */
.price-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}
.price {
  color: #ff4d4f;
  font-size: 48rpx;
  font-weight: bold;
}
.original-price {
  color: #999;
  font-size: 26rpx;
  text-decoration: line-through;
}
.sales {
  margin-left: auto;
  color: #999;
  font-size: 24rpx;
}
.desc-row {
  margin-top: 12rpx;
}
.goods-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  line-height: 1.4;
}
.specs-row {
  margin-top: 16rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.specs-tag {
  padding: 6rpx 20rpx;
  background: #fff5f5;
  color: #ff4d4f;
  border-radius: 20rpx;
  font-size: 24rpx;
}

/* 描述 */
.desc-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}
.desc-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 底部栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border-top: 1rpx solid #eee;
  z-index: 100;
}
.footer-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  position: relative;
}
.fi {
  font-size: 40rpx;
}
.fl {
  font-size: 20rpx;
  color: #666;
}
.badge {
  position: absolute;
  top: 0;
  right: 8rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  min-width: 30rpx;
  height: 30rpx;
  border-radius: 15rpx;
  text-align: center;
  line-height: 30rpx;
  padding: 0 6rpx;
}
.footer-cart {
  flex: 1;
  margin-left: 16rpx;
}
.footer-buy {
  flex: 1;
  margin-left: 16rpx;
}
.btn {
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  border-radius: 36rpx;
  font-size: 28rpx;
}
.footer-cart {
  background: #fff;
  color: #ff4d4f;
  border: 1rpx solid #ff4d4f;
}
.footer-cart:active {
  background: #fff5f5;
}
.btn.primary {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
}
.btn.primary:active {
  opacity: 0.85;
}
</style>
