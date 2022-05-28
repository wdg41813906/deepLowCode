<template>
  <div class="alldatalist_a">
    <div class="top_form">
      <span class="name_span" @click="tabClick(1)">{{ title }}</span>

      <span class="right">
        <!-- <el-button
          size="small"
          icon="el-icon-download"
          class="margin_l_15"
          @click="exportExcel()"
          >导出</el-button
        > -->
        <!-- <router-link
          :to="{ name: 'ListTask', query: { k: Date.now() } }"
          class="margin_l_5"
        > -->
        <el-button
          size="small"
          icon="iconfont icon-cancel"
          class="margin_l_5"
          @click="goback()"
          >返回</el-button
        >
        <!-- </router-link> -->
      </span>
    </div>

    <div v-show="is_tab">
      <div>
        <div v-for="item in sortFun(formlist)" :key="item" class="type_div">
          <p class="title_form">
            <span @click="typeEditorClick(item, formlist[item][0].TypeContent)">
              {{ formlist[item][0].TypeContent }}
            </span>
          </p>
          <div class="clearfix"></div>
          <ul class="eform-list clearfix" v-if="isStr(formlist[item]) == 1">
            <li
              v-for="items in formlist[item]"
              :key="items"
              @mouseover="mouseOver($event)"
              @mouseleave="mouseLeave($event)"
            >
              <div class="list_box">
                <div class="content_list_item">
                  <p class="p_over left width_150" slot="reference">
                    {{ items.Title }}
                  </p>
                  <p class="right other_count" v-if="items.DenyCount > 0">
                    {{ items.DenyCount }}
                  </p>
                  <div class="clearfix"></div>
                </div>

                <div>
                  <!-- <div class="left other_left">
                    包含
                    <span class="other_span">{{ items.AllCount }}</span> 条数据
                  </div> -->
                  <ul class="operation flex right">
                    <!-- <li @click="authorizationFormClick(items)">授权导入</li> -->
                    <li @click="goClick(items)">
                      <span>进入</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import FillAlert from './components/fillAlert'
import FillEditorAlert from './components/fillEditorAlert'
import DetailAlert from './components/detailAlert'
import LogAlert from './components/logAlert'
import DepartAlertS from '../public/departAlertS'
export default {
  name: 'gatherlist',
  components: { FillAlert, FillEditorAlert, DetailAlert, LogAlert, DepartAlertS },
  data () {
    return {
      is_add: false,
      select_auditcode: '',
      select_depart: '',
      dialogTableVisible: false,
      is_detail: false,
      is_editor: false,
      main_code: '',
      detail: {},
      formdetail: {},
      is_add: false,
      table_data: [],
      task_code: '',
      main_data: {},
      formlist: [],
      is_tab: true,
      gather_list: [],
      rule_list: [],
      rule_list_key: [],
      title: '',
      code: '',
      dellist: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      filters: [
        {
          prop: ['CreateUserName', 'Department', 'CreateUserId', 'FormName'],
          value: ''
        }
      ],
      auditlist: [],
      auditkey: [],
      is_depart: false,
      form_code: '',
    }
  },
  methods: {


    batchdel () {
      if (this.dellist.length == 0) {
        this.$alert('请选择要删除的数据', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkModel = []
        for (let i in this.dellist) {
          checkModel.push(this.dellist[i].Code)
        }

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          main_codes: JSON.stringify(checkModel)
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['batchdel'] + '?signature=' + keyvalue;
        console.log(payload)
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.dellist = []
          this.getgather()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      })
    },

    delClick (code) {
      this.$confirm('删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          code: code,
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['delone_main'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then(() => {
          this.getgather()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {

      });

    },

    ediotrFillClick (item) {
      console.log(item)
      this.main_code = item.Code
      this.detail = item
      this.is_editor = !this.is_editor
    },
    fillEBack (val) {
      this.is_editor = val
    },
    subFillEBack () {
      this.getgather()
    },
    detailClick (item) {
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
    },
    otherDetailBack () {
      this.getgather()
    },
    isStr (val) {
      if (typeof val != 'string') {
        return 1
      } else {
        return 234
      }
    },
    sortFun (lists) {
      let list_h = []
      let list_s = []
      let objs = Object.keys(lists)
      for (let i in objs) {
        if (typeof lists[objs[i]] == 'string') {
          list_s.push(objs[i])
        } else {
          list_h.push(objs[i])
        }
      }
      return list_h.concat(list_s.reverse())
    },
    goback () {
      console.log(this.$route.params.other)
      this.$router.push({ name: 'authorizeListTask', query: { k: Date.now() } })

    },
    goClick (item) {
      this.$router.push({ name: 'formdataATask', params: { other: this.$route.params.other }, query: { id: beforeEncrypt(item.Code), taskname: this.$route.query.name, taskcode: this.$route.query.id, name: item.Title } })
    },
    tabClick (num) {
      if (num == 1)
        this.is_tab = true
      else
        this.is_tab = false
    },
    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },
    getalltemplateform () {
      let $this = this
      let code = this.$route.query.id
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allauthorizeformbytaskcode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    maincountinfo () {
      let $this = this
      let code = this.$route.query.id
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['maincountinfo'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.main_data = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    getgather () {
      let code = this.$route.query.id
      this.code = afterEncrypt(code)
      this.title = this.$route.query.name
      this.taskid = code
      this.task_code = afterEncrypt(code)
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        // userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allmaindatabyformcodeanduserid'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.table_data = data.data
        this.select_auditcode = ''
        this.select_depart = ''

      }).catch(err => {
        console.log(err)
      })

    },
    exportExcel () {


      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['export'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // return false
        window.open(this.$store.state.imgurl + '/' + (data.data.path))
        this.getgather()


      }).catch(err => {
        console.log(err)
      })

    },

  },
  mounted () {
    // this.getauditlist()
    this.getgather()
    this.getalltemplateform()
    // this.maincountinfo()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;

  cursor: pointer;
}
.line_span {
  display: inline-block;
  margin-left: 15px;
  margin-right: 15px;
}
.active_gatherlist {
  color: @color;
  font-weight: bold;
}

.alldatalist_a {
  .right_fill_top_content {
    width: 100%;
    // height: 200px;
    background: @white;
    margin: auto;
    padding: 30px 20px;
    .audit_name_p {
      font-size: @font_16;
      font-weight: bold;
      padding-left: 5px;
      border-left: 3px solid @color;
    }
    .audit_content {
      width: 100%;
      justify-content: center;
      align-items: center;
      background: #d9ecff;
      height: 80px;
      // margin-top: 20px;
      div {
        // flex: 1;
      }
      .flex_item {
        text-align: center;
        width: 33%;
        // background: @color;
        border-right: 2px solid @color;
        // box-shadow: -5px 0px 0 0 deeppink;
      }

      .flex_item:last-of-type {
        border-right: none;
      }
      .audit_num {
        color: @color;
        font-size: @font_16;
        font-weight: bold;
      }
      .audit_font {
        margin-top: 5px;
      }
    }
  }
  .list_top {
    margin-bottom: 10px;
  }
  .operation {
    width: 70px;
    border: @border;
    margin-bottom: 0;
    margin-top: 40px;
    border-radius: 5px;
    font-size: @font_12;
    // padding: 3px 5px;
    > li {
      text-align: center;
      cursor: pointer;
      // border-right: @border;
      padding: 5px 15px;
    }
    > li:hover {
      span {
        color: @color;
      }
      color: @color;
    }
  }
  .other_left {
    margin-top: 25px;
    line-height: 20px;
    font-size: @font_12;
    color: @other;
  }
}
</style>