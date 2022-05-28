<template>
  <div class="login_index">
    <!-- <cube-loading :size="40" class="load"></cube-loading> -->
    <!-- {{ data }} -->
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
export default {
  name: 'login_index',
  data () {
    return {
      loading: true,
      data: '',

    }
  },
  methods: {
    checkisauditor () {
      let _this = this
      let payload1 = {

        corpid: _this.$store.state.corpid,
        userid: _this.$store.state.userid
      }
      let createvalue = _this.$createObj(payload1);
      let posturl = _this.$apilist['checkisauditor'];
      // alert('1231231')
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.$store.dispatch('check', data.data.toString()).then(() => {
          // alert('000s')
          let url = "/fill/list"
          window.location.replace(url);


        }).catch(err => {
          console.log(err)
        })
      })
    },
    getCode () {

      let code = this.$route.query['code']
      // let corpid = this.$route.query['corpid']

      let _this = this
      // alert(code)
      let userid = this.$store.getters.userid ? this.$store.getters.userid : getUser('userid')
      // let corpid1 = this.$store.getters.corpid ? this.$store.getters.userid : getUser('corpid')

      let appid = this.$store.state.appid
      // if (corpid == undefined) {
      //   appid = this.$store.state.appid
      // } else {
      //   appid = corpid

      //   if (corpid1 != corpid) {
      //     removeUser('userid')
      //     userid = getUser('userid')
      //   }
      // }
      // if (!userid) {
      // alert('nouserid')
      if (code == undefined) {
        console.log('sdfsdf')
        window.location.replace('/login');
        return false;
      } else {
        // alert('sdsdsfdsd')
        // alert('3')
        let payload = {

          auth_code: code,
          app_name: 'dlnu_kjc_workload'
        }
        let createvalue = this.$createObj(payload);
        let posturl = this.$apilist['getloginuser'];
        // alert('1231231')
        // alert(posturl)

        this.$server.post(posturl, createvalue['fd']).then(data => {
          // alert(JSON.stringify(data.data))
          // _this.data = data
          // console.log(data)
          // _this.showToastTime0(1)
          // alert(JSON.stringify(data))
          // alert('ssssssssssss')
          this.$store.dispatch('login_other', { level: data.data.u_info.Level, username: data.data.u_info.Name, userid: data.data.u_info.UserId, department: data.data.u_info.Department }).then(() => {
            //  this.is_mes = true
            // this.mescrollInit()
            // _this.getAgentId1(1)
            console.log('-----------------------------------')
            this.checkisauditor()



          }).catch(err => {
            console.log(err)
          })
        })
      }
      // } else {
      //   // alert('sdf')
      //   let url = "/server/fill/listfill"
      //   window.location.replace(url);
      // }
      return false;
    },
  },
  mounted () {
    // this.showToastTime0(0)
    this.getCode()
    const loading = this.$loading({
      lock: true,
      text: '登录中，请等待',
      // spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0)'
    });
  }
}
</script>

<style>
.login_index {
  min-height: 200px;
}
</style>
