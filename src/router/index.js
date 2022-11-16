import Vue from 'vue'
import Router from 'vue-router'
// home 模块
import Home from './modules/home'
// bill 模块
import Bill from './modules/bill'
// mine 模块
import Mine from './modules/mine'
// merchant 模块
import Merchant from './modules/merchant'
// 公共 模块
import Public from './modules/public'
// Proxy 模块
import Proxys from './modules/proxy'
// Visitor 模块
import Visitor from './modules/visitor'
// Sale 模块
import Sale from './modules/sale'

Vue.use(Router)
 // mode: 'history',
 
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    ...Home,
    ...Bill,
    ...Mine,
    ...Merchant,
    ...Public,
    ...Proxys,
    ...Visitor,
    ...Sale
  ]
})
