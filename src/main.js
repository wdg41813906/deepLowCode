import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/less/style.less'
import '@/assets/less/index.less'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { server } from '@/api/index.js'
import { apilist } from '@/utils/apilist.js'
import { createObj } from '@/utils/encryption.js'
import VueDataTables from 'vue-data-tables'
import '@/assets/icons'
Vue.config.productionTip = false
Vue.use(VueDataTables)
Vue.use(ElementUI);
Vue.prototype.$server = server
Vue.prototype.$apilist = apilist
Vue.prototype.$createObj = createObj

import nodeWrapM from '@/components/audit/approval/nodeWrapM'
Vue.use(nodeWrapM)
Vue.component('nodeWrapM', nodeWrapM); //初始化组件
import addNodeM from '@/components/audit/approval/addNodeM'
Vue.use(addNodeM)
Vue.component('addNodeM', addNodeM); //初始化组件
import addNodeN from '@/components/audit/approval/addNodeN'
Vue.use(addNodeN)
Vue.component('addNodeN', addNodeN); //初始化组件
let whiteList = ['/login', '/register', '/test', '/attention', '/index', '/login_index_two', '/transit', '/word', '/login_transit']


import { getUser } from '@/utils/auth_user';
import { afterEncrypt } from '@/utils/encryption';
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  console.log(to.name)
  console.log(to)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // next()
  // console.log()
  // console.log(to.matched)
  const token = store.getters.userid ? store.getters.userid : afterEncrypt(getUser('userid'))
  // const token = store.state.userid ? store.state.userid : afterEncrypt(getUser('userid'))
  // console.log(store.state.userid)
  // console.log(store.getters.userid ? store.getters.userid : afterEncrypt(getUser('userid')))
  // console.log(store.getters.user ? store.getters.user : afterEncrypt(getUser('user')))
  // console.log(store.state.user)
  // console.log(store.state.corpid)
  // alert(token)
  let string = getnavigator()
  console.log(string)
  if (to.name == 'attention') {
    console.log('sdfsdfsdf')

    next()
  } else if ((string == 'Chrome' || string == 'FF') && to.name != 'attention') {

    if (token) {
      // alert(to.path)
      // alert(next.path)
      next()
    } else {
      console.log('sdfsd')

      if (whiteList.indexOf(to.path) !== -1) {

        next()
      } else {
        next({ name: 'login' })

      }
    }
  } else {
    next({ name: 'attention' })
  }

  // next()
})
function getnavigator () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  console.log(userAgent)
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return "Opera"
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  } //判断是否IE浏览器

}

new Vue({
  router,
  store,
  nodeWrapM,
  addNodeM,
  render: h => h(App)
}).$mount('#app')
