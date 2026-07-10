import {
  banners,
  categories,
  subCategories,
  generateGoods,
  recommendGoods,
  flashSales,
  generateOrders,
  addresses
} from './mock'

// 模拟网络延迟
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// HTTP 请求封装
export const http = {
  async get(url, data = {}) {
    await delay()
    const handler = routeMap[url]
    if (handler) {
      return { code: 200, data: handler(data), message: 'success' }
    }
    return { code: 404, data: null, message: '接口不存在' }
  },
  async post(url, data = {}) {
    await delay()
    const handler = routeMap[url]
    if (handler) {
      return { code: 200, data: handler(data), message: 'success' }
    }
    return { code: 404, data: null, message: '接口不存在' }
  }
}

// 路由映射
const routeMap = {
  // 首页
  '/api/home/banners': () => banners,
  '/api/home/recommend': () => recommendGoods,
  '/api/home/flash-sales': () => flashSales,

  // 分类
  '/api/categories': () => categories,
  '/api/categories/sub': (params) => subCategories[params.categoryId] || [],

  // 商品
  '/api/goods/list': (params) => generateGoods(params.categoryId || 1, params.page || 0, params.pageSize || 10),
  '/api/goods/detail': (params) => {
    const goods = generateGoods(1, params.goodsId || 1, 1)
    return goods[0]
  },
  '/api/goods/search': (params) => {
    const results = generateGoods(1, 0, 20)
    return results.filter(g => g.name.includes(params.keyword || ''))
  },

  // 订单
  '/api/orders/list': () => generateOrders(5),
  '/api/orders/create': (params) => ({
    orderId: Math.floor(Math.random() * 100000),
    orderNo: 'ORD' + Date.now(),
    status: 0,
    statusText: '待付款',
    ...params
  }),
  '/api/orders/cancel': () => ({ success: true }),

  // 地址
  '/api/address/list': () => addresses,

  // 登录
  '/api/user/login': (params) => ({
    userInfo: {
      id: 1001,
      nickname: params.username || '微信用户',
      avatar: '/static/logo/avatar.png',
      phone: '138****8888'
    },
    token: 'mock_token_' + Date.now()
  })
}
