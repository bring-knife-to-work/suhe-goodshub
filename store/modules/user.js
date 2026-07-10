const USER_KEY = 'uni_mall_user'

function loadUser() {
  try {
    const data = uni.getStorageSync(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

function saveUser(user) {
  uni.setStorageSync(USER_KEY, JSON.stringify(user))
}

const state = {
  userInfo: null,
  token: ''
}

const getters = {
  isLoggedIn: (state) => !!state.token && !!state.userInfo,
  userInfo: (state) => state.userInfo,
  token: (state) => state.token
}

const mutations = {
  INIT_USER(state) {
    const user = loadUser()
    if (user) {
      state.userInfo = user.userInfo
      state.token = user.token
    }
  },
  SET_USER(state, { userInfo, token }) {
    state.userInfo = userInfo
    state.token = token
    saveUser({ userInfo, token })
  },
  LOGOUT(state) {
    state.userInfo = null
    state.token = ''
    uni.removeStorageSync(USER_KEY)
  }
}

const actions = {
  login({ commit }, { username, password }) {
    // 模拟登录
    return new Promise((resolve) => {
      setTimeout(() => {
        const userInfo = {
          id: 1001,
          nickname: username || '微信用户',
          avatar: '/static/logo/avatar.png',
          phone: '138****8888'
        }
        const token = 'mock_token_' + Date.now()
        commit('SET_USER', { userInfo, token })
        resolve({ userInfo, token })
      }, 500)
    })
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
