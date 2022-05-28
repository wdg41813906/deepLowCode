<template>
  <div class="editormember" v-show="my_add_show">
    <div class="member_colRight_head">
      <span class="member_right_title">成员信息详情</span>
    </div>
    <div class="js_has_member">
      <!-- <div class="ww_operationBar">
        <a href="javascript:;" class="qui_btn ww_btn" @click="back">返回</a>
      </div>
      <div class="operation_member">
        <el-row>
          <el-col :span="18">
            <router-link
              :to="{ name: 'IndexAddress', query: { k: Date.now() } }"
              ><el-button class="margin_l_5" size="small"
                >返回</el-button
              ></router-link
            >
          </el-col>
        </el-row>
      </div> -->
      <div class="member_colRight_table" v-load="loading">
        <div class="register_item" v-if="Object(userdetail).length == 0">
          <p>暂无成员信息详情</p>
        </div>
        <!-- <div class="register_item" v-for="item in member" :key="item">
          <span class="nameval">{{ item.n }}：</span>
          <span v-if="item.selectval != 'img'">{{ item.fillval }}</span>
          <div v-else style="margin-left: 80px;">
            <div class="weui-uploader__bd imglist">
              <ul
                class="weui-uploader__files"
                id="uploaderImg"
                v-if="item.fillval != ''"
              >
                <li
                  class="weui-uploader__file"
                  :style="{
                    backgroundImage: 'url(' + imgurl + item.fillval + ')',
                  }"
                ></li>
              </ul>
            </div>
          </div>
        </div> -->
        <div class="register_item">
          <span class="nameval">工号：</span>
          <span>{{ userdetail.UserId }}</span>
        </div>
        <div class="register_item">
          <span class="nameval">用户名：</span>
          <span>{{ userdetail.Name }}</span>
        </div>
        <div class="register_item">
          <span class="nameval">手机号：</span>
          <span>{{ userdetail.Mobile }}</span>
        </div>
        <div class="register_item">
          <span class="nameval">部门：</span>
          <span>{{ userdetail.Department }}</span>
          <!-- <span v-for="item in member.des" :key="item">{{ item }};</span> -->
        </div>
      </div>
    </div>
    <depart-alert
      :is_add="is_add"
      :selectlist="selectdepart"
      @selectDepart="selectDepart"
      @addPEvent="addPEvent"
    ></depart-alert>
  </div>
</template>

<script>
import DepartAlert from './departAlert'
export default {
  name: 'editormember',
  props: {

    selectFile: Object,
    editor_show: Boolean,
    userdetail: Object,
    random: Number
  },
  components: { DepartAlert },
  data () {
    return {
      loading: false,
      imgurl: this.$store.state.imgurl,
      is_add: false,
      userid: this.userdetail.Userid,
      username: this.userdetail.Name,
      pwd: this.userdetail.Passwd,
      my_add_show: false,
      selectdepart: [],
      member: [],

    }
  },
  methods: {

    usergetdata () {
      this.loading = true
      console.log('------------------------------------')
      let payload = {
        userid: this.userid,
        corpid: this.$store.state.corpid,
        // openid: this.$store.state.openid,
        // userid: JSON.parse(this.$store.state.userinfo_bind).Userid
        // alldepart: '123'
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['oneuserdetail'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        // alert('dddd')
        this.member = data.data
        // if (data.data.PersonalData != '') {
        //   this.member = JSON.parse(data.data.PersonalData)
        // } else {
        //   this.member = []
        // }
        this.loading = false



      })
    },



    addmember () {
      if (this.selectdepart.length == 0) {
        this.$alert('请选择部门！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      if (this.userid.trim() == '') {
        this.$alert('请填写工号！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      if (this.username.trim() == '') {
        this.$alert('请填写用户名！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      console.log(this.pwd)
      if (this.pwd.trim() == '') {
        this.$alert('请填写密码！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
      console.log(this.userid)
      if (!reg.test(this.pwd.trim()) || this.pwd.trim().length < 6 || this.pwd.trim().length > 12) {
        this.$alert('密码必须为6-12位的数字和字母的组合！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let departlist = []
      for (let i in this.selectdepart) {
        departlist.push(this.selectdepart[i].DepartId)
      }
      let payload = {
        corpid: this.$store.state.corpid,
        departids: departlist.join('|'),
        userid: this.userid.trim(),
        username: this.username.trim(),
        passwd: this.pwd.trim()
      }
      console.log(payload)
      // return false;
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['edituser'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        _this.back()
      }).catch(err => {
        console.log(err)
      })
    },
    deldepart (item) {
      let index = this.selectdepart.indexOf(item)
      if (index > -1) {
        this.$delete(this.selectdepart, index)
      }
    },
    selectDepart (val) {
      console.log(val)
      this.selectdepart = val
    },
    addPEvent (val) {
      this.is_add = val
    },
    addDepartClick () {
      this.is_add = !this.is_add
    },
    back () {
      this.my_add_show = !this.my_add_show
    }
  },
  watch: {

    userdetail (val) {
      console.log(val)
      console.log('sdfsdfsdfsdfsdf')
      // this.userid = this.userdetail.u
      // this.usergetdata()

    },
    editor_show (val) {

      console.log('123123123')
      this.my_add_show = val
      console.log(this.userdetail)
      this.userid = this.userdetail.U
      this.username = this.userdetail.N
      this.pwd = this.userdetail.P
      let departlist = []
      for (let i in this.userdetail.D) {
        departlist.push({ id: this.userdetail.D[i], DepartId: this.userdetail.D[i], Department: this.userdetail.Ds[this.userdetail.D[i]] })
      }
      this.selectdepart = departlist

    },
    my_add_show (val) {
      console.log('dsdfsdfsdfsdf')
      this.$emit('backadd', val)
    }
  }
}
</script>

<style scoped>
.register_item {
  font-size: 14px;
  /* width: 362px; */
  margin: 20px 20px;
}
.register_item .nameval {
  width: 80px;
  display: inline-block;
  text-align: right;
}
.item_div {
  display: table-cell;
  padding-top: 5px;
  vertical-align: top;
  width: 80px;
  text-align: right;
}
.editormember .el-input {
  width: 250px;
}
.editor_righth {
  position: relative;
  display: table-cell;
  vertical-align: bottom;
  padding-left: 8px;
}
.ww_groupSelBtn {
  display: inline-block;
  vertical-align: top;
  min-height: 22px;
  font-size: 13px;
}
.ww_groupSelBtn_item {
  float: left;
  max-width: 231px;
  line-height: 1.5;
  margin: 3px 10px 3px 0;
  padding: 3px 11px 3px 7px;
  background-color: #fff;
  border: 1px solid #e4e6e9;
  border-radius: 2px;
}
.ww_img {
  display: inline-block;
  background: url(../../../assets/img/icon_folder_blue.png);
  width: 14px;
  height: 12px;
  margin: 2px 5px 0 0;
}
.ww_groupSelBtn_item_text {
  /* float: left; */
  max-width: 174px;
  padding-right: 11px;
  overflow: hidden;
  line-height: 18px;
  cursor: default;
}
.img_icon {
  cursor: pointer;
}
.ww_groupSelBtn_add {
  cursor: pointer;
  margin-top: 7px;
  color: #0c4c7f;
}
</style>
