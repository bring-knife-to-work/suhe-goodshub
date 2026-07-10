<template>
  <view class="count-input">
    <view class="btn" @click="decrease" :class="{ disabled: value <= min }">-</view>
    <input
      class="input"
      type="number"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
    />
    <view class="btn" @click="increase" :class="{ disabled: value >= max }">+</view>
  </view>
</template>

<script>
export default {
  name: 'CountInput',
  props: {
    value: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 999 }
  },
  methods: {
    decrease() {
      if (this.value > this.min) {
        this.$emit('input', this.value - 1)
        this.$emit('change', this.value - 1)
      }
    },
    increase() {
      if (this.value < this.max) {
        this.$emit('input', this.value + 1)
        this.$emit('change', this.value + 1)
      }
    },
    handleInput(e) {
      let val = parseInt(e.detail.value) || 1
      val = Math.max(this.min, Math.min(this.max, val))
      this.$emit('input', val)
    },
    handleBlur() {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style scoped>
.count-input {
  display: flex;
  align-items: center;
  gap: 0;
}
.btn {
  width: 52rpx;
  height: 52rpx;
  border: 1rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333;
  background: #fafafa;
}
.btn:first-child {
  border-radius: 8rpx 0 0 8rpx;
}
.btn:last-child {
  border-radius: 0 8rpx 8rpx 0;
}
.btn.disabled {
  color: #ccc;
  background: #f5f5f5;
}
.btn:active:not(.disabled) {
  background: #eee;
}
.input {
  width: 80rpx;
  height: 52rpx;
  border-top: 1rpx solid #ddd;
  border-bottom: 1rpx solid #ddd;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  background: #fff;
}
</style>
