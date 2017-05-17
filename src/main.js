// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
// import axios from 'axios'
import 'element-ui/lib/theme-default/index.css'
import {Cascader} from 'element-ui'

// import lodash from 'lodash'
// window._ = require('lodash')

// Vue.prototype.$http = axios

Vue.component(Cascader.name, Cascader)


Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false)
}

(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth
            if (!clientWidth) return
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
        }
    if (!doc.addEventListener) return

    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store
})
