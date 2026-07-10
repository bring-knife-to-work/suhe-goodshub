<template>
  <view class="goods-card" @click="goDetail">
    <image class="goods-image" :src="goods.image" mode="aspectFill" lazy-load></image>
    <view class="goods-info">
      <view class="goods-name ellipsis-2">{{ goods.name }}</view>
      <view class="goods-meta">
        <text class="price">{{ formatPrice(goods.price) }}</text>
        <text class="original-price" v-if="goods.originalPrice">{{ formatPrice(goods.originalPrice) }}</text>
      </view>
      <view class="goods-footer">
        <text class="sales">?? {{ formatCount(goods.sales) }}</text>
        <view class="cart-btn" @click.stop="addCart">
          <text class="cart-icon">+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { formatPrice, formatCount, showToast } from '@/common/utils'

export default {
  name: 'GoodsCard',
  props: {
    goods: { type: Object, required: true }
  },
  methods: {
    formatPrice, formatCount,
    goDetail() {
      uni.navigateTo({
        url: `/pages/goods/detail/index?goodsId=${this.goods.goodsId}`
      })
    },
    addCart() {
      this.$store.commit('cart/ADD_TO_CART', {
        goodsId: this.goods.goodsId,
        name: this.goods.name,
        image: this.goods.image,
        price: this.goods.price
      })
      showToast('??????', 'success')
    }
  }
}
</script>

<style scoped>
.goods-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
  transition: transform 0.2s;
}
.goods-card:active { transform: scale(0.98); }
.goods-image {
  width: 100%;
  height: 340rpx;
  background: #f5f5f5;
}
.goods-info {
  padding: 16rpx;
}
.goods-name {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  height: 72rpx;
}
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods-meta {
  display: flex;
  align-items: baseline;
  margin-top: 8rpx;
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
  margin-left: 10rpx;
}
.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
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
  line-height: 1;
  font-weight: bold;
}
</style>
