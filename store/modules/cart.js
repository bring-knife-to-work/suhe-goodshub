// 购物车状态管理
const CART_KEY = 'uni_mall_cart'

function loadCart() {
  try {
    const data = uni.getStorageSync(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

function saveCart(items) {
  uni.setStorageSync(CART_KEY, JSON.stringify(items))
}

const state = {
  items: []
}

const getters = {
  cartTotal: (state) => {
    return state.items.reduce((total, item) => total + item.count, 0)
  },
  cartAmount: (state) => {
    return state.items.reduce((total, item) => total + item.price * item.count, 0)
  },
  cartItems: (state) => state.items,
  isInCart: (state) => (goodsId) => {
    return state.items.some(item => item.goodsId === goodsId)
  },
  cartItemCount: (state) => (goodsId) => {
    const item = state.items.find(item => item.goodsId === goodsId)
    return item ? item.count : 0
  }
}

const mutations = {
  INIT_CART(state) {
    state.items = loadCart()
  },
  ADD_TO_CART(state, goods) {
    const exist = state.items.find(item => item.goodsId === goods.goodsId)
    if (exist) {
      exist.count += goods.count || 1
    } else {
      state.items.push({
        goodsId: goods.goodsId,
        name: goods.name,
        image: goods.image,
        price: goods.price,
        specs: goods.specs || '',
        count: goods.count || 1,
        selected: true
      })
    }
    saveCart(state.items)
  },
  UPDATE_COUNT(state, { goodsId, count }) {
    const item = state.items.find(item => item.goodsId === goodsId)
    if (item) {
      item.count = Math.max(1, count)
    }
    saveCart(state.items)
  },
  TOGGLE_SELECT(state, goodsId) {
    const item = state.items.find(item => item.goodsId === goodsId)
    if (item) {
      item.selected = !item.selected
    }
    saveCart(state.items)
  },
  TOGGLE_SELECT_ALL(state, selected) {
    state.items.forEach(item => { item.selected = selected })
    saveCart(state.items)
  },
  REMOVE_FROM_CART(state, goodsId) {
    state.items = state.items.filter(item => item.goodsId !== goodsId)
    saveCart(state.items)
  },
  CLEAR_CART(state) {
    state.items = []
    saveCart(state.items)
  },
  REMOVE_SELECTED(state) {
    state.items = state.items.filter(item => !item.selected)
    saveCart(state.items)
  }
}

const actions = {
  addToCart({ commit }, goods) {
    commit('ADD_TO_CART', goods)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
