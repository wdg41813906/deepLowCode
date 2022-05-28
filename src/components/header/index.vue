<template>
  <div class="header">
    <div class="top" style="z-index: 1501">
      <div class="top_header">
        <div>
          <ul class="ul_header_logo left">
            <li>
              <div class="icon_logo"></div>
              <span class="font_18">本科教学工作量系统 </span>
            </li>
            <!-- <li>
                <span class="font_18">科研工作量系统 </span>
              </li> -->
          </ul>
          <ul class="ul_header left">
            <li
              :class="{
                active_a:
                  this.$route.name == 'ListFill' ||
                  this.$route.name == 'formlistFill' ||
                  this.$route.name == 'approvedAudit' ||
                  this.$route.name == 'formFill' ||
                  this.$route.name == 'endformFill' ||
                  this.$route.name == 'filllistFill' ||
                  this.$route.name == 'endfilllistFill' ||
                  this.$route.name == 'endFill' ||
                  this.$route.name == 'sumFill' ||
                  this.$route.name == 'endsumFill' ||
                  this.$route.name == 'taskAudit' ||
                  this.$route.name == 'gatherAudit' ||
                  this.$route.name == 'filllistAudit',
              }"
            >
              <router-link :to="{ name: 'ListFill', query: { k: Date.now() } }"
                >工作量申报</router-link
              >
            </li>
            <li
              :class="{
                active_a:
                  this.$route.name == 'publicFormFill' ||
                  this.$route.name == 'publicListFill' ||
                  this.$route.name == 'publicTaskFill',
              }"
            >
              <router-link
                :to="{ name: 'publicTaskFill', query: { k: Date.now() } }"
                >公示区</router-link
              >
            </li>
          </ul>
        </div>
        <div class="name_top right">
          <span class="name_span_header">{{ department }}</span>
          |
          <span class="name_span_header cursor" @click="goP()">{{
            username
          }}</span>
          |
          <span @click="logout()" class="name_span_header cursor">退出</span>
          <GetTreeNameM :openid="userid" :is_depart="false"></GetTreeNameM>

          <!-- <span class="logout" @click="logout">退出</span> -->
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="flex middle_div">
      <div
        class="left_menu"
        v-if="
          this.$route.name != 'ImportListAddress' &&
          this.$route.name != 'FormTask' &&
          this.$route.name != 'importTask' &&
          this.$route.name != 'importATask' &&
          (is_admin == true || is_depart == true || is_audit == true)
        "
      >
        <!-- background-color="#3998F7"
            text-color="#fff"
            active-text-color="#ffd04b" -->
        <div ref="left_menu">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
              :default-active="$route.path"
              router
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :collapse="isCollapse"
              :default-openeds="['1', '2', '3', '4']"
            >
              <el-menu-item index="/task/index" v-if="is_admin">
                <i class="iconfont icon-renwu nav-icon"></i>
                <span slot="title">任务管理</span>
              </el-menu-item>

              <el-submenu
                index="2"
                v-if="
                  is_admin ||
                  is_depart ||
                  this.check == 'true' ||
                  this.check == true
                "
              >
                <template slot="title">
                  <i class="iconfont icon-examine nav-icon"></i>
                  <span slot="title">数据审核</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/audit/auditlist"
                    >待审核数据</el-menu-item
                  >
                  <el-menu-item index="/audit/approvedlist"
                    >已审核数据</el-menu-item
                  >
                  <el-menu-item index="/audit/sumlist">汇总数据</el-menu-item>
                  <!-- <el-menu-item index="/audit/tasklist"
                    >审核任务列表</el-menu-item
                  > -->
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3" v-if="is_admin">
                <template slot="title">
                  <i class="iconfont icon-form nav-icon"></i>
                  <span slot="title">基础数据</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/forms/list">
                    <span slot="title">表单列表</span>
                  </el-menu-item>
                  <el-menu-item index="/auditT/index">
                    <span slot="title">审核流程模板</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4" v-if="is_admin">
                <template slot="title">
                  <i class="iconfont icon-zonglan01 nav-icon"></i>
                  <span slot="title">教务处</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/dept/sumlist">
                    <span slot="title">汇总数据</span>
                  </el-menu-item>
                  <el-menu-item index="/dept/detaillist">
                    <span slot="title">详情数据</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="1" v-if="is_admin">
                <template slot="title">
                  <i class="iconfont icon-permissions nav-icon"></i>
                  <span slot="title">组织管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/address/index">人员管理</el-menu-item>
                  <el-menu-item index="/address/permission"
                    >权限管理</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>

              <!-- </div> -->
            </el-menu>
          </el-scrollbar>
        </div>

        <div class="other cursor" @click="collapseClick()">
          <i class="el-icon-arrow-right" v-if="isCollapse"></i>
          <i class="el-icon-arrow-left" v-else></i>
        </div>
      </div>
      <div class="right_content">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group> -->
        <!-- <router-view /> -->
        <router-view class="router-view" :key="key"></router-view>
        <!-- <div class="text_center footer_right">版权所有</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'header',
  data () {
    return {

      department: JSON.parse(this.$store.state.user).department,
      user: JSON.parse(this.$store.state.user),
      username: this.$store.state.username,
      corpname: this.$store.state.corpname,
      permission: this.$store.getters.userid,
      isCollapse: false,
      key: '',
      otherformlist: [],
      taskid: '',
      is_depart: false,
      is_admin: false,
      is_audit: false,
      check: this.$store.state.check,
    }
  },
  computed: {
    key () {
      // this.one.query = { k: 123 }
      console.log('--------------')
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()

    },
    transform () {
      return this.$route.path
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {

        this.$router.push('/login')

      }).catch(err => {
        console.log('error')
        console.log(err)
      })
    },
    collapseClick () {

      this.isCollapse = !this.isCollapse
      let left_menu = this.$refs['left_menu']
      console.log(this.$refs)
      setTimeout(function () {
        // console.log(left_menu.offsetHeight)
      }, 100)

    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    profession () {
      console.log(this.check)
      let pro = JSON.parse(this.$store.state.user).level
      console.log(pro)
      if (pro == 1) {
        this.is_admin = true
        this.is_audit = true
        this.is_depart = true
      } else if (pro == 2) {
        this.is_depart = true
        this.is_admin = false
        this.is_audit = true
      } else if (this.check == 'true' || this.check == true) {
        console.log('--------------------------')
        console.log(typeof this.check)
        this.is_audit = true
        this.is_depart = false
        this.is_admin = false
      } else {
        this.is_audit = false
        this.is_depart = false
        this.is_admin = false
      }
    }
  },
  mounted () {
    this.profession()
  }
}
</script>
<style lang="less">
.top {
  z-index: 1500;
  background: @color;
  position: fixed;
  top: 0;
  width: 100%;
  height: 45px;
  line-height: 42px;
  color: @white;
  box-shadow: rgba(39, 54, 78, 0.12) 1px 0px 6px 0px;
  min-width: 1000px;
  .top_header {
    min-width: 1060px;
    margin: auto;
    margin-left: 20px;
  }
  .ul_header {
    // width: 70%;
    display: flex;
    font-size: 14px;
    margin-left: 70px;
    li {
      // padding: 0 15px;
      a {
        color: @white;
        opacity: 0.8;
        padding: 0 15px;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    li:hover {
      color: @color;
      cursor: pointer;
      border-bottom: 2px solid @white;
      a {
        // color: @color;
        opacity: 1;
      }
    }
  }
  .active_a {
    border-bottom: 2px solid @white;
    a {
      // color: @color;
      opacity: 1 !important;
    }
  }
  .name_top {
    margin-right: 50px;
  }
}
.flex {
  display: flex;
  align-items: flex-start;
  // height: 100%;
  .left_menu {
    position: relative;
    margin-top: 20px;
    margin-left: 20px;
  }
  .el-menu-vertical-demo.el-menu--collapse.el-menu {
    min-height: 400px;
  }
  .other {
    background: @content_title_color;
    display: inline;
    position: absolute;
    top: 150px;
    right: -20px;
    width: 20px;
    height: 30px;
    line-height: 30px;
    // left: 0;
  }
}
.middle_div {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 45px;
  min-width: 1140px;
}
.left_menu {
  z-index: 1500;
}

.nav-icon {
  font-size: @font_18 !important;
}

.el-menu {
  border-right: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.right_content {
  // position: relative;
  margin-left: 30px;
  margin-top: 20px;
  margin-right: 20px;
  width: 100%;
  min-width: 980px;
  min-height: 600px;
  // overflow: auto;
  // border: 1px solid @color;
  // background: @white;
  // padding: 10px;
}
.active_a {
  // color: @color;
  font-weight: bold;
}
.footer_right {
  height: 2%;
  background: red;
}
</style>

