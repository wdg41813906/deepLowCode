<template>
  <div class="formlist_fill">
    <div class="top_form">
      <span span class="name_span" @click="tabClick(2)">数据</span>
      <span class="right">
        <el-button icon="iconfont icon-cancel" size="small" @click="back()"
          >返回</el-button
        >
        <!-- <router-link
          class="margin_l_10"
          :to="{ name: 'ListFill', query: { k: Date.now() } }"
        >
          <el-button icon="iconfont icon-cancel" size="small">返回</el-button>
        </router-link> -->
        <!-- </router-link> -->
      </span>
    </div>
    <div v-if="is_tab">
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
                <div class="left other_left">
                  <p>已填报数：{{ items.AllCount }}</p>
                  <!-- <p>审批中数：{{ items.AuditCount }}</p> -->
                  <p>待审批数：{{ items.CommitCount }}</p>
                </div>
                <ul class="operation flex right">
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
    <div v-show="!is_tab">
      <data-tables
        v-loading="loading"
        :data="tableData"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        ref="table"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <el-table-column label="工号" prop="CreateUserId"></el-table-column>
        <el-table-column label="姓名" prop="CreateUserName"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="props">
            <div v-for="(item, index) in props.row.FormFieldInfos" :key="item">
              <p class="flow-subtitle" v-if="index < 3">
                <span
                  v-if="
                    item.opt_label != '' &&
                    item.opt_label != 'image' &&
                    item.opt_label != 'file'
                  "
                >
                  {{ item.field_label }}:{{ item.opt_label.split("__")[1] }}
                </span>
                <span
                  v-else-if="
                    item.opt_label == 'image' || item.opt_label == 'file'
                  "
                >
                  <!-- {{ item.vaule }} -->
                  {{ item.field_label }}:
                  <span v-if="item.value.length > 1"
                    >{{ item.value[0].name }}...</span
                  >
                  <span v-else-if="item.value.length == 1">{{
                    item.value[0].name
                  }}</span>
                  <span v-else>-</span>
                </span>
                <span v-else> {{ item.field_label }}:{{ item.value }} </span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="表单名" prop="FormName"> </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="props">
            <div class="flow-permisson-row">
              <span>
                <span class="flow_per" v-if="props.row.State == 0">未提交</span>
                <span class="flow_per warning" v-else-if="props.row.State == 1"
                  >已提交

                  <!-- {{ auditFirst(props.row.AuditStates) }} -->
                </span>
                <span class="flow_per danger" v-else-if="props.row.State == 2"
                  >驳回</span
                >
                <span class="flow_per success" v-else-if="props.row.State == 3"
                  >已通过</span
                >
                <span class="flow_per warning" v-else-if="props.row.State == 4">
                  <span
                    v-for="(item, index) in props.row.AuditStates"
                    :key="item"
                  >
                    <span>{{ item.user_info[0].name }}</span>
                    <span v-if="index < props.row.AuditStates.length - 1"
                      >/</span
                    >
                  </span>
                  审核中</span
                >
                <span class="flow_per success" v-else-if="props.row.State == 5"
                  >已通过</span
                ><span class="flow_per" v-else-if="props.row.State == 6"
                  >导入数据</span
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="prop">
            <el-link type="primary" @click="detailClick(prop.row)"
              >详情</el-link
            >
          </template>
        </el-table-column>
      </data-tables>
      <div class="clearfix"></div>
    </div>

    <DetailAlert
      :is_add="is_detail"
      :detail="detail"
      :form_data="formdetail"
      is_flag="2"
      @back="detailBack"
      @otherback="otherDetailBack"
    ></DetailAlert>
    <LogAlert :is_add="is_log" :code="logcode" @back="logBack"> </LogAlert>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';

import DetailAlert from './components/detailAlert2'
import LogAlert from './components/logAlert'
export default {
  name: 'formlist_fill',
  components: { DetailAlert, LogAlert },
  data () {
    return {
      loading: false,
      task_code: '',
      formlist: [],
      is_tab: false,
      tableData: [],
      loading: false,
      filed_infos: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      is_detail: false,
      detail: {},
      is_add: false,
      formdetail: {},
      is_editor: false,
      main_code: '',
      dellist: '',
      auditlist: '',
      auditkey: '',
      codeval: '',
      dialogTableVisible: false,
      select_depart: '',
      select_auditcode: '',
    }
  },
  methods: {
    back () {
      let num = afterEncrypt(this.$route.query.num)
      if (num == 1) {
        this.$router.push({ name: 'sumlistAudit' })
      } else if (num == 2) {
        this.$router.push({ name: 'sumDept' })
      }
    },
    gourl () {
      this.$router.push({ name: 'sumFill', query: { id: this.$route.query.id, name: this.$route.query.name } })
    },
    otherDetailBack () {
      this.allmaindatabyformcodeanduserid()
    },
    auditSelectClick () {
      console.log(this.select_depart)
      this.select_auditcode = ''
      this.audit_key_list = this.auditlist[this.select_depart].conditions
    },
    auditSubmitClick () {
      if (this.select_auditcode == '') {
        this.$alert('请选择审批流程！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      if (this.num == 1) {
        //单条审批
        this.commitmaindatawithnodecode(this.codeval)
      } else {
        //批量审批
        this.batchcommitmaindatawithnodecode(this.codeval)
      }
    },
    //部门审批
    commitmaindatawithnodecode (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
        depart_code: this.select_depart,
        node_code: this.select_auditcode
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithnodecode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        this.dialogTableVisible = false
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()

      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithnodecode (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
        depart_code: this.select_depart,
        node_code: this.select_auditcode
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithnodecode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.dialogTableVisible = false
        if (data.data == 70002) {
          this.$alert(data.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.allmaindatabyformcodeanduserid()
            }
          });
        } else {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.allmaindatabyformcodeanduserid()
        }

      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange (val) {
      console.log(val)
      this.dellist = val
    },
    addListClick () {
      if (this.dellist.length == 0) {
        this.$alert('请选择提交内容！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let codelist = []
      for (let i in this.dellist) {
        codelist.push(this.dellist[i].Code)
      }
      this.submitClick(codelist, 2)
    },
    submitClick (codeval, num) {
      console.log('ssss')
      console.log(this.TypeId)

      this.dialogTableVisible = !this.dialogTableVisible
      this.num = num
      this.codeval = codeval
      //选择部门审批
      if (num == 1) {
        //单条审批
      } else {
        //批量审批
      }


    },
    getauditlist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getauditlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.auditlist = data.data
        this.auditkey = Object.keys(data.data)

      }).catch(err => {
        console.log(err)
      })
    },
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
          this.allmaindatabyformcodeanduserid()

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
          this.allmaindatabyformcodeanduserid()
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
      this.getformdetail(item.FormCode)
    },
    getformdetail (code) {
      let $this = this
      // let code = this.$route.query.id
      this.name = this.$route.query.name
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: (code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['formdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formdetail = data.data
        this.formdetail.form_code = (code)
        this.is_editor = !this.is_editor
      }).catch(err => {
        console.log(err)
      })
    },
    fillEBack (val) {
      this.is_editor = val
    },
    subFillEBack () {
      this.allmaindatabyformcodeanduserid()
    },
    subFillBack () {
      this.allmaindatabyformcodeanduserid()
    },
    fillClick () {
      this.is_add = !this.is_add
    },
    fillBack (val) {
      this.is_add = val
    },
    detailClick (item) {
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
    },
    goClick (item) {
      console.log(item)
      this.$router.push({ name: 'filllistFill', query: { name: item.Title, taskname: this.$route.query.name, id: beforeEncrypt(item.Code), taskcode: this.$route.query.id } })
    },
    tabClick (num) {
      if (num == 1) {
        this.is_tab = true
      } else {
        this.is_tab = false
      }
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
    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },
    getselfformlist () {
      let $this = this
      this.task_code = afterEncrypt(this.$route.query.id)
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getselfformlist'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // this.task_detail = data.data
        this.formlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    allmaindatabyformcodeanduserid () {
      let $this = this
      this.task_code = afterEncrypt(this.$route.query.id)
      let payload = {
        corpid: this.$store.state.corpid,
        userid: afterEncrypt(this.$route.query.userid),
        task_code: this.task_code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allmaindatabyformcodeanduserid'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tableData = data.data
        this.select_depart = ''
        this.select_auditcode = ''
        this.loading = false
        if (data.data.length == 0) {
          // this.filed_infos = data.filed_infos
          this.filed_infos = []
          for (let i in data.filed_infos) {
            this.filed_infos.push({ label: data.filed_infos[i].label })
          }
          this.filed_infos.push({ label: '状态' })
          this.filed_infos.push({ label: '操作' })
        }

      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    let other = this.$route.query.other
    console.log(other)
    if (other == 1) {
      this.is_tab = false
    }
    this.getselfformlist()
    this.allmaindatabyformcodeanduserid()
    this.getauditlist()
  }
}
</script>
<style lang="less">
.formlist_fill {
  .name_span {
    font-size: @font_14 !important;
    display: inline-block;
    height: 16px;
    line-height: 36px;
    cursor: pointer;
  }
  .line_span {
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
  .active_gatherlist {
    color: @color;
    font-weight: bold;
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
      border-right: @border;
      padding: 5px 15px;
    }
    > li:hover {
      span {
        color: @color;
      }
    }
  }
  .operation:hover {
    border: 1px solid @color;
  }
  .other_left {
    margin-top: 25px;
    line-height: 20px;
    font-size: @font_12;
    color: @other;
  }
}
</style>