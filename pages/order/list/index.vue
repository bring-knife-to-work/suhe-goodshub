<template>
  <view class="order-list-page">
    <!-- 状态标签 -->
    <scroll-view class="status-tabs" scroll-x show-scrollbar="false">
      <view
        class="status-tab"
        :class="{ active: activeStatus === s.value }"
        v-for="s in statusTabs"
        :key="s.value"
        @click="switchStatus(s.value)"
      >
        {{ s.label }}
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="orders.length">
      <view class="order-card" v-for="(order, idx) in filteredOrders" :key="order.orderId">
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :class="'status-' + order.status">{{ order.statusText }}</text>
        </view>
        <view class="order-items">
          <view class="order-item" v-for="(item, i) in order.items" :key="i" @click="goDetail(item.goodsId)">
            <image class="item-img" :src="item.image" mode="aspectFill" />
            <view class="item-info">
              <view class="item-name ellipsis-2">{{ item.name }}</view>
              <view class="item-bottom">
                <text class="item-price">{{ formatPrice(item.price) }}</text>
                <text class="item-count">x{{ item.count }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-total">
            共{{ order.items.reduce((s, i) => s + i.count, 0) }}件
            合计：<text class="total-price">{{ formatPrice(order.totalAmount) }}</text>
          </text>
        </view>
        <view class="order-actions" v-if="order.status === 0">
          <view class="action-btn cancel" @click="cancelOrder(order.orderId)">取消订单</view>
          <view class="action-btn pay" @click="payOrder(order)">立即支付</view>
        </view>
        <view class="order-actions" v-if="order.status === 2">
          <view class="action-btn confirm" @click="confirmReceipt(order.orderId)">确认收货</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无订单</text>
    </view>
  </view>
</template>

<script>
import { formatPrice, showToast, showLoading, hideLoading } from '@/common/utils'

export default {
  data() {
    return {
      activeStatus: -1,
      orders: [],
      statusTabs: [
        { label: '全部', value: -1 },
        { label: '待付款', value: 0 },
        { label: '待发货', value: 1 },
        { label: '待收货', value: 2 },
        { label: '待评价', value: 3 },
        { label: '已完成', value: 4 }
      ]
    }
  },
  computed: {
    filteredOrders() {
      if (this.activeStatus === -1) return this.orders
      return this.orders.filter(o => o.status === this.activeStatus)
    }
  },
  onLoad(options) {
    if (options.status !== undefined) {
      this.activeStatus = parseInt(options.status)
    }
    this.loadOrders()
  },
  methods: {
    formatPrice,
    async loadOrders() {
      showLoading('加载中...')
      const res = await this.$http.get('/api/orders/list')
      this.orders = res.data
      hideLoading()
    },
    switchStatus(status) {
      this.activeStatus = status
    },
    goDetail(goodsId) {
      uni.navigateTo({ url: `/pages/goods/detail/index?goodsId=${goodsId}` })
    },
    async cancelOrder(orderId) {
      uni.showModal({
        title: '提示',
        content: '确定取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.$http.post('/api/orders/cancel', { orderId })
            showToast('订单已取消', 'success')
            this.loadOrders()
          }
        }
      })
    },
    payOrder(order) {
      showToast('模拟支付成功', 'success')
    },
    confirmReceipt(orderId) {
      showToast('已确认收货', 'success')
      this.loadOrders()
    }
  }
}
</script>

<style scoped>
.order-list-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.status-tabs {
  display: flex;
  background: #fff;
  white-space: nowrap;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}
.status-tab {
  display: inline-block;
  padding: 8rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  margin-right: 16rpx;
  border-radius: 24rpx;
}
.status-tab.active {
  background: #fff0f0;
  color: #ff4d4f;
  font-weight: bold;
}

/* 订单卡片 */
.order-card {
  background: #fff;
  margin: 16rpx 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.order-no {
  font-size: 24rpx;
  color: #999;
}
.order-status {
  font-size: 26rpx;
  font-weight: bold;
}
.order-status.status-0 { color: #ff4d4f; }
.order-status.status-1 { color: #faad14; }
.order-status.status-2 { color: #1890ff; }
.order-status.status-3 { color: #52c41a; }
.order-status.status-4 { color: #999; }

/* 订单商品 */
.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.order-item:last-child { margin-bottom: 0; }
.item-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}
.item-info {
  flex: 1;
  margin-left: 12rpx;
}
.item-name {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
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
}
.item-price {
  color: #ff4d4f;
  font-size: 28rpx;
  font-weight: bold;
}
.item-count {
  color: #999;
  font-size: 24rpx;
}

/* 订单底部 */
.order-footer {
  border-top: 1rpx solid #f5f5f5;
  padding-top: 16rpx;
  text-align: right;
}
.order-total {
  font-size: 24rpx;
  color: #666;
}
.total-price {
  color: #ff4d4f;
  font-size: 30rpx;
  font-weight: bold;
}
.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}
.action-btn {
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  font-size: 24rpx;
}
.action-btn.cancel {
  border: 1rpx solid #ddd;
  color: #666;
}
.action-btn.pay {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
}
.action-btn.confirm {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.empty-icon { font-size: 120rpx; opacity: 0.3; }
.empty-text { color: #999; font-size: 28rpx; margin-top: 20rpx; }
</style>
