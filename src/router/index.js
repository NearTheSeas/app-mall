/*eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { routerMode } from '../config/env'

import App from '../App'

Vue.use(VueRouter)

const login = r => require.ensure([], () => r(require('../pages/login/login')), 'login')
const home = r => require.ensure([], () => r(require('../pages/home/home')), 'home')
const category = r => require.ensure([], () => r(require('../pages/category/category')), 'category')
const prodDetail = r => require.ensure([], () => r(require('../pages/prodDetail/prodDetail')), 'prodDetail')
const confirmOrder = r => require.ensure([], () => r(require('../pages/confirmOrder/confirmOrder')), 'confirmOrder')
const chooseAddress = r => require.ensure([], () => r(require('../pages/address/chooseAddress')), 'chooseAddress')
const addAddress = r => require.ensure([], () => r(require('../pages/address/addAddress')), 'addAddress')
const remark = r => require.ensure([], () => r(require('../pages/confirmOrder/children/remark')), 'remark')
const search = r => require.ensure([], () => r(require('../pages/search/search')), 'search')
const cart = r => require.ensure([], () => r(require('../pages/cart/cart')), 'cart')
const payment = r => require.ensure([], () => r(require('../pages/confirmOrder/children/payment')), 'payment')
const profile = r => require.ensure([], () => r(require('../pages/profile/profile')), 'profile')
const info = r => require.ensure([], () => r(require('../pages/profile/children/info')), 'info')
const setusername = r => require.ensure([], () => r(require('../pages/profile/children/setusername')), 'setusername')
const address = r => require.ensure([], () => r(require('../pages/address/address')), 'address')
const add = r => require.ensure([], () => r(require('../pages/profile/children/children/children/add')), 'add')
const addDetail = r => require.ensure([], () => r(require('../pages/profile/children/children/children/children/addDetail')), 'addDetail')
const order = r => require.ensure([], () => r(require('../pages/order/order')), 'order')
const orderDetail = r => require.ensure([], () => r(require('../pages/order/children/orderDetail')), 'orderDetail')
const searchAddress = r => require.ensure([], () => r(require('../pages/confirmOrder/children/searchAddress')), 'searchAddress')
const selectLocation = r => require.ensure([], () => r(require('../pages/address/selectLocation')), 'selectLocation')

export default new VueRouter({
  base: '/m',
  routes: [{
    path: '/',
    component: App,
    children: [{
        path: '',
        redirect: '/home'
      },
      //登录注册页
      {
        path: '/login',
        component: login
      }, {
        path: '/home',
        component: home
      }, {
        path: '/search',
        component: search
      }, {
        path: '/cart',
        component: cart
      }, {
        path: '/order',
        component: order,
        children:[{
          path: 'orderDetail',
          component: orderDetail
        }]
      },{
          path: 'prodDetail',
          component: prodDetail
      },{
        path: '/category',
        component: category
      },{
        path: '/chooseAddress', //选择地址
        component: chooseAddress,
      },{
          path: '/addAddress', //添加地址
          component: addAddress,
          children: [{
            path:'selectLocation',
            component:selectLocation
          }]
        },{
        path: '/address',
        component: address, //编辑地址
        children: [{
          path: 'add',
          component: add,
          children: [{
            path: 'addDetail',
            component: addDetail
          },{
            path:'selectLocation',
            component:selectLocation
          }]
        }]
      },
      //确认订单页
      {
        path: '/confirmOrder',
        component: confirmOrder,
        children: [{
          path: 'remark', //订单备注
          component: remark,
        }, {
          path: 'payment', //付款页面
          component: payment,
        }]
      }, {
        path: '/profile',
        component: profile,
        children: [{
            path: 'info', //个人信息详情页
            component: info,
            children: []
          }
        ]
      },
    ]
  }],
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production'
})
