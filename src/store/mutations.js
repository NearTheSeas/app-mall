/*eslint-disable */
import {
  ADD_CART,
  REDUCE_CART,
  INIT_BUYCART,
  CLEAR_CART,
  CONFIRM_REMARK,
  CHOOSE_ADDRESS,
  SET_LOCATION,
  CLEAR_SELECTADD
} from './mutation-types.js'

import {
  setStore,
  getStore,
} from '../config/mUtils'

export default {
  // 加入购物车
  [ADD_CART](state, { id, name, salePrice, unit, img }) {
    let cart = state.cartList;
    if(!cart){
      cart = {}
    }
    if (cart[id]){
      cart[id]['num']++;
    } else {
      cart[id] = {
          "num" : 1,
          "id" : id,
          "name" : name,
          "salePrice" : salePrice,
          "unit" : unit,
          "img" : img
      };
    }
    state.cartList = {...cart};

    //存入localStorage
    setStore('buyCart', state.cartList);
  },
  // 移出购物车
  [REDUCE_CART](state, {
    id
  }) {
    let cart = state.cartList
    if ( cart[id]) {
      if (cart[id]['num'] > 0) {
        cart[id]['num']--
        state.cartList = {...cart }
        //存入localStorage
        setStore('buyCart', state.cartList)
      } else {
        //商品数量为0，则清空当前商品的信息
        cart[id] = null
      }
    }
  },
  //网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART](state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  //清空当前商品的购物车信息
  [CLEAR_CART](state) {
    state.cartList = {}
    setStore('buyCart', state.cartList)
  },
  
  //记录订单页面用户选择的备注, 传递给订单确认页面
  [CONFIRM_REMARK](state, {
    inputText
  }) {
    // state.remarkText = remarkText
    state.inputText = inputText
  },

  //选择的地址
  [CHOOSE_ADDRESS](state, {
    address,
    index
  }) {
    state.choosedAddress = address
    state.addressIndex = index
  },

  [SET_LOCATION](state,{province,city,district}){
    state.province = province
    state.city = city
    state.district = district
  },
  [CLEAR_SELECTADD](state){
    state.province = ''
    state.city = ''
    state.district = ''
  }
}
