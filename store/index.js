import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'

const store = createStore({
  modules: {
    cart,
    user
  }
})

export default store
