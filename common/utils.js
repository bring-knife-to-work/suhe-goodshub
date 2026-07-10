// 工具函数

// 格式化价格
export function formatPrice(price) {
  return '¥' + parseFloat(price).toFixed(2)
}

// 格式化数量
export function formatCount(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

// 格式化时间
export function formatTime(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}`
}

// 节流
export function throttle(fn, delay = 500) {
  let timer = null
  return function(...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 防抖
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 数字转字符串补零
export function padZero(num, len = 2) {
  return String(num).padStart(len, '0')
}

// Toast提示
export function showToast(title, icon = 'none') {
  uni.showToast({ title, icon, duration: 2000 })
}

// 显示加载
export function showLoading(title = '加载中...') {
  uni.showLoading({ title, mask: true })
}

// 隐藏加载
export function hideLoading() {
  uni.hideLoading()
}

// 验证手机号
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}
