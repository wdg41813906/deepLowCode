<template>
  <div class="login_index">
    <!-- <cube-loading :size="40" class="load"></cube-loading> -->
    <div id="wx_qrcode"></div>
    <div class="contianer">
      <div class="footer">
        <div class="inside">
          <a href="#">Copyright</a>
          <i class="fa fa-copyright"></i>
          <a href="#">2018-2021</a>
          <a href="#">教务处 All Rights Reserved</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
export default {
  name: 'login_index',
  data () {
    return {
      loading: '',
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
        // alert('5')
        let redirect_uri = this.$store.state.url + 'server/login'
        let auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
        // alert(code)
        window.location.replace(auth_url);
        return false;
      } else {
        // alert('sdsdsfdsd')
        // alert('3')
        let payload = {

          auth_code: code,
          app_name: 'dlnu_jwc_workload'
        }
        let createvalue = this.$createObj(payload);
        let posturl = this.$apilist['getloginuser'];
        // alert('1231231')
        return false;
        this.$server.post(posturl, createvalue['fd']).then(data => {
          // alert(JSON.stringify(data.data))
          // _this.data = data
          // console.log(data)
          // _this.showToastTime0(1)
          // alert(JSON.stringify(data))
          // alert('ssssssssssss')
          _this.$store.dispatch('login_other', data).then(() => {
            // alert('000s')
            _this.checkisauditor()


          }).catch(err => {
            console.log(err)
          })

          // let keys = Object.keys(data)
          // let indexs = keys.indexOf('UserId')
          // // alert(keys)
          // // alert(indexs)
          // if (indexs != -1) {
          //   setUser('is_guard', '1')
          //   //缓存传来的userid与corpid以及departs列表
          //   _this.$store.dispatch('loginqi', data).then(() => {
          //     let url = "/guard/index"
          //     window.location.replace(url);
          //   }).catch(err => {
          //     console.log(err)
          //   })
          // } else {
          //   setUser('is_guard', '2')
          //   //缓存传来的userid与corpid以及departs列表
          //   _this.$store.dispatch('login', data.data).then(() => {
          //     let url = "/guard/index"
          //     window.location.replace(url);
          //   }).catch(err => {
          //     console.log(err)
          //   })
          // }



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
    // this.getCode()
    let _this = this
    console.log(_this.$store.state.agentid)
    window.WwLogin({
      "id": "wx_qrcode",
      "appid": _this.$store.state.appid,
      "agentid": _this.$store.state.agentid,
      "redirect_uri": _this.$store.state.url + 'login_transit',
      "state": "",
      "href": "",
    });

  }
}
</script>

<style lang='less'>
.login_index {
  min-height: 200px;
  margin: auto;
  text-align: center;
  // padding-top: 200px;
}
.wx_qrcode {
  margin: auto;
  text-align: center;
}
#wx_qrcode {
  margin: auto;
  margin-top: 140px;
  padding-top: 28px;
  width: 432px;
  text-align: center;
  background: #fff;
  min-height: 366px;
}
.footer {
  // position: fixed;
  bottom: 5px;
  text-align: center;
  width: 100%;
}
.footer,
.footer a {
  color: #666;
}
.inside {
  margin-top: 20px;
  text-align: center;
}
</style>
