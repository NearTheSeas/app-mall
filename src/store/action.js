import { getUser, getAddressList } from '../service/getData'
import * as types from './mutation-types.js'

export default {

  async getUserInfo ({ commit, state }) {
    let res = await getUser()
    commit(types.GET_USERINFO, res)
  },
  async saveAddress ({ commit, state }) {
    if (state.removeAddress.length > 0) return
    let addres = await getAddressList(state.userInfo.user_id)
    commit(types.SAVE_ADDRESS, addres)
  },
  addToCart ({ commit }, product) {
    if (product.inventory > 0) {
      commit(types.ADD_TO_CART, {
        id: product.id
      })
    }
  }
}
