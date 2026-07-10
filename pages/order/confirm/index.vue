<template>
  <view class="confirm-page">
    <!-- 收货地址 -->
    <view class="address-section card" @click="selectAddress">
      <view class="address-info" v-if="selectedAddress">
        <view class="address-top">
          <text class="address-name">{{ selectedAddress.name }}</text>
          <text class="address-phone">{{ selectedAddress.phone }}</text>
          <text class="default-tag" v-if="selectedAddress.isDefault">默认</text>
        </view>
        <text class="address-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
      </view>
      <view class="address-empty" v-else>
        <text class="address-icon">📍</text>
        <text class="address-text">请选择收货地址</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <!-- 商品列表 -->
    <view class="goods-section card">
      <view class="goods-item" v-for="(item, idx) in goodsList" :key="idx">
        <image class="item-img" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <view class="item-name">{{ item.name }}</view>
          <view class="item-bottom">
            <text class="item-price">{{ formatPrice(item.price) }}</text>
            <text class="item-count">x{{ item.count || 1 }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单备注 -->
    <view class="remark-section card">
      <text class="remark-label">订单备注</text>
      <input class="remark-input" v-model="remark" placeholder="选填，请注明特殊要求" />
    </view>

    <!-- 费用明细 -->
    <view class="fee-section card">
      <view class="fee-row">
        <text class="fee-label">商品金额</text>
        <text class="fee-value">{{ formatPrice(totalPrice) }}</text>
      </view>
      <view class="fee-row">
        <text class="fee-label">运费</text>
        <text class="fee-value" :class="{ free: freight === 0 }">{{ freight === 0 ? '免运费' : formatPrice(freight) }}</text>
      </view>
      <view class="fee-row total">
        <text class="fee-label">应付总额</text>
        <text class="fee-value total-price">{{ formatPrice(totalPrice + freight) }}</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <view class="submit-left">
        <text class="total-label">合计：</text>
        <text class="total-amount">{{ formatPrice(totalPrice + freight) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script>
import { formatPrice, showToast, showLoading, hideLoading } from '@/common/utils'
import { appConfig } from '@/common/config'

export default {
  data() {
    return {
      goodsList: [],
      remark: '',
      selectedAddress: null,
      addresses: []
    }
  },
  computed: {
    totalPrice() {
      return this.goodsList.reduce((sum, g) => sum + g.price * (g.count || 1), 0)
    },
    freight() {
      return this.totalPrice >= appConfig.freeFreightAmount ? 0 : appConfig.freightAmount
    }
  },
  onLoad(options) {
    if (options.goods) {
      try {
        this.goodsList = JSON.parse(decodeURIComponent(options.goods))
      } catch (e) {
        showToast('数据错误')
      }
    }
    this.loadAddresses()
  },
  methods: {
    formatPrice,
    async loadAddresses() {
      const res = await this.$http.get('/api/address/list')
      this.addresses = res.data
      this.selectedAddress = this.addresses.find(a => a.isDefault) || this.addresses[0]
    },
    selectAddress() {
      uni.showActionSheet({
        itemList: this.addresses.map(a => `${a.name} ${a.phone} ${a.detail}`),
        success: (res) => {
          this.selectedAddress = this.addresses[res.tapIndex]
        }
      })
    },
    async submitOrder() {
      if (!this.selectedAddress) {
        showToast('请选择收货地址')
        return
      }
      showLoading('提交中...')
      const res = await this.$http.post('/api/orders/create', {
        addressId: this.selectedAddress.id,
        goods: this.goodsList,
        remark: this.remark,
        freight: this.freight,
        totalAmount: this.totalPrice + this.freight
      })
      hideLoading()
      showToast('下单成功', 'success')
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/order/list/index?status=0' })
      }, 1500)
    }
  }
}
</script>

<style scoped>
.confirm-page {
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

/* 地址 */
.address-section {
  display: flex;
  align-items: center;
}
.address-info {
  flex: 1;
}
.address-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}
.address-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.address-phone {
  font-size: 28rpx;
  color: #666;
}
.default-tag {
  padding: 2rpx 12rpx;
  background: #fff0f0;
  color: #ff4d4f;
  border-radius: 8rpx;
  font-size: 20rpx;
}
.address-detail {
  font-size: 26rpx;
  color: #999;
}
.address-empty {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.address-icon { font-size: 36rpx; }
.address-text { color: #999; font-size: 28rpx; }
.arrow { color: #ccc; font-size: 36rpx; }

/* 商品 */
.goods-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.goods-item:last-child { margin-bottom: 0; }
.item-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}
.item-info {
  flex: 1;
  margin-left: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.item-name {
  font-size: 26rpx;
  color: #333;
}
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-price {
  color: #ff4d4f;
  font-size: 30rpx;
  font-weight: bold;
}
.item-count {
  color: #999;
  font-size: 24rpx;
}

/* 备注 */
.remark-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}
.remark-input {
  height: 72rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #333;
}

/* 费用 */
.fee-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.fee-row:last-child { margin-bottom: 0; }
.fee-label {
  font-size: 26rpx;
  color: #666;
}
.fee-value {
  font-size: 26rpx;
  color: #333;
}
.fee-value.free {
  color: #52c41a;
}
.fee-row.total {
  border-top: 1rpx solid #eee;
  padding-top: 16rpx;
  margin-top: 8rpx;
}
.fee-row.total .fee-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}
.total-price {
  color: #ff4d4f;
  font-size: 36rpx;
  font-weight: bold;
}

/* 提交 */
.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  border-top: 1rpx solid #eee;
  z-index: 100;
}
.submit-left {
  flex: 1;
  display: flex;
  align-items: baseline;
}
.total-label {
  font-size: 28rpx;
  color: #333;
}
.total-amount {
  color: #ff4d4f;
  font-size: 40rpx;
  font-weight: bold;
}
.submit-btn {
  padding: 20rpx 60rpx;
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
  border-radius: 40rpx;
  font-size: 30rpx;
  text-align: center;
}
.submit-btn:active {
  opacity: 0.85;
}
</style>
