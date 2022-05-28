// import Vue from 'vue'
import Vuex from 'vuex'
import { setUser, getUser, removeUser } from '@/utils/auth_user';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';

export default new Vuex.Store({
  state: {

    appid: '',
    agentid: '',//正式

    weburl: '',
    url: '',
    imgurl: '',

    formItemList: [],
    strlist: {},
    level: afterEncrypt(getUser('level')),
    check: afterEncrypt(getUser('check')),
    permission: afterEncrypt(getUser('permission')),
    // corpid: afterEncrypt(getUser('corpid')),
    // corpname: afterEncrypt(getUser('corpname')),
    userid: afterEncrypt(getUser('userid')),
    username: afterEncrypt(getUser('username')),
    user: afterEncrypt(getUser('user')),
  },

  mutations: {
    stringComponents (state, list) {
      state.formItemList = list
    },
    stringList (state, list) {
      state.strlist = list
    },
    SER_USERID: (state, userid) => {
      state.userid = userid;
      // window.sessionStorage.setItem('token', token)
    },
    SER_CORPID: (state, corpid) => {
      state.corpid = corpid;
      // window.sessionStorage.setItem('token', token)
    },
    SER_CORPNAME: (state, corpname) => {
      state.corpname = corpname;
      // window.sessionStorage.setItem('token', token)
    },
    SER_USER: (state, user) => {
      state.user = user;
      // window.sessionStorage.setItem('token', token)
    },
    SER_TOKEN: (state, token) => {
      state.token = token;
      // window.sessionStorage.setItem('token', token)
    },
    SER_USERNAME: (state, username) => {
      state.username = username;
      // window.sessionStorage.setItem('name', name)
    },
    SER_PERMISSION: (state, permission) => {
      state.permission = permission;
      // window.sessionStorage.setItem('name', name)
    },
    SER_CHECK: (state, check) => {
      state.check = check;
      // window.sessionStorage.setItem('name', name)
    },
    SER_LEVEL: (state, level) => {
      state.level = level;
      // window.sessionStorage.setItem('name', name)
    }
  },
  actions: {
    check ({ commit }, data) {
      // alert(JSON.stringify(data))
      return new Promise((resolve) => {
        commit('SER_CHECK', (data))
        setUser('check', beforeEncrypt((data)))
        resolve(data)

      })

    },
    login ({ commit }, data) {
      // alert(JSON.stringify(data))
      return new Promise((resolve) => {
        commit('SER_USERNAME', (data.Name))
        setUser('username', beforeEncrypt((data.Name)))
        commit('SER_USERID', data.UserId)
        setUser('userid', beforeEncrypt(data.UserId))

        commit('SER_USER', data)
        setUser('user', beforeEncrypt(JSON.stringify(data)))
        commit('SER_PERMISSION', JSON.stringify(data.IsAdmin))
        setUser('permission', beforeEncrypt(JSON.stringify(data.IsAdmin)))

        resolve(data)

      })

    },
    login_other ({ commit }, data) {

      return new Promise((resolve) => {
        // commit('SER_USERID', userId)
        // setUser('userid', userId)
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        // alert(JSON.stringify(data))
        // let keys = Object.keys(data)
        // let indexs = keys.indexOf('UserId')
        // alert(keys)
        // alert(indexs)
        // commit('SER_USER', JSON.stringify(data))
        // setUser('user', beforeEncrypt(JSON.stringify(data))
        console.log(data)
        // alert(JSON.stringify(data))
        commit('SER_USERNAME', (data.username))
        setUser('username', beforeEncrypt((data.username)))
        commit('SER_USERID', data.userid)
        setUser('userid', beforeEncrypt(data.userid))
        commit('SER_USER', data)
        setUser('user', beforeEncrypt(JSON.stringify(data)))
        // commit('SER_PERMISSION', data.permission)
        // setUser('permission', beforeEncrypt(data.permission))
        commit('SER_LEVEL', data.level)
        setUser('level', beforeEncrypt(data.level))
        // commit('SER_CORPNAME', data.corpname)
        // setUser('corpname', beforeEncrypt(data.corpname))
        console.log(data)
        // commit('SER_PERMISSION', data.permission.toString())
        // setUser('permission', beforeEncrypt(data.permission.toString()))
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        // return false
        resolve(data)

      })

    },
    name_other ({ commit }, data) {

      return new Promise((resolve) => {
        // commit('SER_USERID', userId)
        // setUser('userid', userId)
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        // alert(JSON.stringify(data))
        // let keys = Object.keys(data)
        // let indexs = keys.indexOf('UserId')
        // alert(keys)
        // alert(indexs)
        // commit('SER_USER', JSON.stringify(data))
        // setUser('user', beforeEncrypt(JSON.stringify(data))
        console.log(data)
        // alert(JSON.stringify(data))
        commit('SER_USERNAME', (data.username))
        setUser('username', beforeEncrypt((data.username)))

        console.log(data)
        // commit('SER_PERMISSION', data.permission.toString())
        // setUser('permission', beforeEncrypt(data.permission.toString()))
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        // return false
        resolve(data)

      })

    },

    login_mobile ({ commit }, data) {

      return new Promise((resolve) => {
        // commit('SER_USERID', userId)
        // setUser('userid', userId)
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        // alert(JSON.stringify(data))
        // let keys = Object.keys(data)
        // let indexs = keys.indexOf('UserId')
        // alert(keys)
        // alert(indexs)
        // commit('SER_USER', JSON.stringify(data))
        // setUser('user', beforeEncrypt(JSON.stringify(data))
        console.log(data)
        // alert(JSON.stringify(data))
        // alert(data.UserId)
        commit('SER_USERNAME', (data.UserId))
        setUser('username', beforeEncrypt((data.UserId)))
        commit('SER_USERID', data.UserId)
        setUser('userid', beforeEncrypt(data.UserId))
        commit('SER_CORPID', data.CorpId)
        setUser('corpid', beforeEncrypt(data.CorpId))
        // commit('SER_PERMISSION', data.permission.toString())
        // setUser('permission', beforeEncrypt(data.permission.toString()))
        // commit('SER_TOKEN', 'logined')
        // setUser('token', 'logined')
        resolve(data)

      })

    },
    logout ({ commit }) {

      return new Promise((resolve) => {
        removeUser('userid')
        commit('SER_USERID', '')
        removeUser('username')
        commit('SER_USERNAME', '')
        removeUser('corpid')
        commit('SER_CORPID', '')
        removeUser('user')
        commit('SER_USER', '')
        resolve()
      })

    }
  },
  modules: {
  }
})
