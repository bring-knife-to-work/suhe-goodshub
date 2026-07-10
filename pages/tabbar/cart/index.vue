<template>
  <view class="cart-page">
    <view class="empty-state" v-if="cartItems.length === 0">
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车还是空的</text>
      <view class="go-btn" @click="goHome">去逻逻</view>
    </view>
    <view class="cart-list" v-else>
      <view class="cart-item" v-for="(item, idx) in cartItems" :key="item.goodsId">
        <view class="select-box" @click="toggleSelect(item.goodsId)">
          <view class="radio" :class="{ checked: item.selected }">
            <text class="check-mark" v-if="item.selected">✓</text>
          </view>
        </view>
        <image class="item-img" :src="item.image" mode="aspectFill" @click="goDetail(item.goodsId)" />
        <view class="item-info">
          <view class="item-name ellipsis-2" @click="goDetail(item.goodsId)">{{ item.name }}</view>
          <text class="item-specs" v-if="item.specs">{{ item.specs }}</text>
          <view class="item-bottom">
            <text class="item-price">{{ formatPrice(item.price) }}</text>
            <CountInput :value="item.count" :min="1" :max="999" @change="(v) => updateCount(item.goodsId, v)" />
          </view>
        </view>
      </view>
    </view>
    <view class="cart-footer" v-if="cartItems.length > 0">
      <view class="select-all" @click="toggleSelectAll">
        <view class="radio" :class="{ checked: allSelected }">
          <text class="check-mark" v-if="allSelected">✓</text>
        </view>
        <text class="all-text">全选</text>
      </view>
      <view class="footer-center">
        <text class="total-label">合计：</text>
        <text class="total-price">{{ formatPrice(cartAmount) }}</text>
      </view>
      <view class="footer-actions">
        <view class="delete-btn" @click="deleteSelected">删除</view>
        <view class="settle-btn" @click="goSettle">结算({{ selectedCount }})</view>
      </view>
    </view>
  </view>
</template>

<script>
import CountInput from '@/components/CountInput.vue'
import { formatPrice, showToast } from '@/common/utils'
import { mapGetters } from 'vuex'

export default {
  components: { CountInput },
  computed: {
    ...mapGetters('cart', ['cartTotal', 'cartAmount', 'cartItems']),
    allSelected() {
      return this.cartItems.every(item => item.selected)
    },
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    }
  },
  methods: {
    formatPrice,
    goHome() {
      uni.switchTab({ url: '/pages/tabbar/home/index' })
    },
    goDetail(goodsId) {
      uni.navigateTo({ url: `/pages/goods/detail/index?goodsId=${goodsId}` })
    },
    toggleSelect(goodsId) {
      this.$store.commit('cart/TOGGLE_SELECT', goodsId)
    },
    toggleSelectAll() {
      this.$store.commit('cart/TOGGLE_SELECT_ALL', !this.allSelected)
    },
    updateCount(goodsId, count) {
      this.$store.commit('cart/UPDATE_COUNT', { goodsId, count })
    },
    goSettle() {
      const selected = this.cartItems.filter(item => item.selected)
      if (selected.length === 0) {
        showToast('请选择要结算的商品')
        return
      }
      const goods = encodeURIComponent(JSON.stringify(selected))
      uni.navigateTo({ url: `/pages/order/confirm/index?goods=${goods}` })
    },
    deleteSelected() {
      const selected = this.cartItems.filter(item => item.selected)
      if (selected.length === 0) {
        showToast('请选择要删除的商品')
        return
      }
      uni.showModal({
        title: '提示',
        content: `确定删除选中的 ${selected.length} 件商品吗？`,
        success: (res) => {
          if (res.confirm) {
            this.$store.commit('cart/REMOVE_SELECTED')
            showToast('删除成功')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.cart-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.empty-icon {
  font-size: 160rpx;
  margin-bottom: 20rpx;
  opacity: 0.3;
}
.empty-text {
  color: #999;
  font-size: 28rpx;
  margin-bottom: 40rpx;
}
.go-btn {
  padding: 16rpx 60rpx;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  margin-bottom: 2rpx;
}
.select-box {
  padding: 10rpx;
  margin-right: 10rpx;
}
.radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio.checked {
  background: #ff4d4f;
  border-color: #ff4d4f;
}
.check-mark {
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
}
.item-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}
.item-info {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180rpx;
}
.item-name {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
}
.item-specs {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.item-price {
  color: #ff4d4f;
  font-size: 32rpx;
  font-weight: bold;
}
.cart-footer {
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
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.04);
  z-index: 100;
}
.select-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.all-text {
  font-size: 26rpx;
  color: #333;
}
.footer-center {
  flex: 1;
  text-align: right;
  margin-right: 20rpx;
}
.total-label {
  font-size: 26rpx;
  color: #666;
}
.total-price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}
.footer-actions {
  display: flex;
  gap: 16rpx;
}
.delete-btn {
  padding: 14rpx 24rpx;
  border: 1rpx solid #ddd;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #666;
}
.settle-btn {
  padding: 14rpx 40rpx;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  border-radius: 32rpx;
  font-size: 26rpx;
  white-space: nowrap;
}
</style>
