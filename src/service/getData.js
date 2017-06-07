/*eslint-disable */
import axios from 'axios'
import fetch from '../config/fetch'
import * as location from './china-area-data/data'

/**
 * 创建临时数据
 */

const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}

let loginData = {
  "shopSign": 'f29d425931f9a2b6',
  "token": "aac6dc07ec63c7d64013739a9a437b11",
  "shopName":"神州冷链",
  "customerName":"",
  "isMC":false
}

window.setShopSign = function(shopSign,token, shopName, customerName, isMC){
  loginData["shopSign"] = shopSign;
  loginData["token"] = token;
  loginData["shopName"] = shopName;
  loginData["customerName"] = customerName;
  loginData["isMC"] = isMC ? true : false;
  console.log(isMC);
  console.log(loginData);
}

const getUrl = str => {
  return str + '?shopSign=' + loginData.shopSign + '&token=' + loginData.token
}

var getBanner = () => {
    console.log(loginData)
    return axios.get(host + '/api/flash', {
    params: {...loginData}
  })
}

// let host = 'http://localhost:8080'
let host = ''
// 获取主推品
var hotSales = () => {
  return axios.get(host + '/api/products/hotSale', {
    params: {...loginData}
  })
};

var searchProduct = (str) => {
  return axios.post(host + '/api/products/search',{
      ...loginData,
      term:str
  })
}

// 获取分类树
var prodCategory = () => {
    return axios.get(host + '/api/category/tree', {
    params: {...loginData}
  })
}
// 根据分类查询产品
var getProdByCategory = (categoryId) =>{
  // console.log(categoryId)
    return axios.get(host + '/api/products/getByCategoryId ', {
    params: {...loginData, categoryId}
  })
}
// 获取用户地址
var getAddress = () =>{
    return axios.get(host + '/api/customer/getAddress ', {
    params: {...loginData}
  })
}

// 提交订单
var submitOrder = (params) =>  {
  return axios.post(getUrl('/api/order/submit'), {
        ...loginData,...params
      })
}

// 用户登录
var userLogin = (username, password) => {
  return axios.post(getUrl('/api/login'), {
        username,password
      })
};

// 获取订单
var getOrderList = (pageNo = 1, pageSize = 10) => {
  // var pageRequest = {pageNo:1,pageSize:10}
    return axios.get(host + '/api/order/getOrders', {
    params: {...loginData, pageNo, pageSize}
  })
}

// 保存用户地址
var addNewAddress = (linkId, name,  address_detail, longitude, latitude, phone, province, city, district, linkState) => {
    return axios.post(getUrl('/api/customer/editAddress'), {
      ...loginData, linkId,  linkname: name, address: address_detail,  longitude, latitude, phone, province, city, district, linkState, isDefault: 0
    })
};

// 获取订单详情
var getOrderDetail = (id) => {
    return axios.get(host + '/api/order/detail', {
    params: {id: id}
  })
};

var getLocationData = () => {
  return new Promise((resolve, reject)=>{
    resolve(location)
  })
}

var getStreet = (key) => {
  return axios.get('/static/towm/'+ key+ '.json')
}

// 验证是否可以下单  /api/order/validate
var validateOrder = (params) => {
  return axios.post(getUrl('/api/order/validate'), {
        ...loginData,...params
      })
}
 
export { loginData, getBanner, hotSales, prodCategory, getProdByCategory, validateOrder, submitOrder, userLogin, getOrderList, getAddress, addNewAddress, getLocationData, getStreet, getOrderDetail, searchProduct }
