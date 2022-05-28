<template>
  <div class="formlist_fill">
    <div class="top_form">
      <span
        class="name_span"
        :class="{ active_gatherlist: is_tab }"
        @click="tabClick(1)"
        >所有表单</span
      >
      <span class="line_span">|</span>
      <span
        span
        class="name_span"
        :class="{ active_gatherlist: !is_tab }"
        @click="tabClick(2)"
        >所有数据</span
      >
      <span class="right">
        <div class="dis_inline_block" v-show="!is_tab">
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="small"
            @click="fillClick()"
            >添加</el-button
          >
          <el-button
            icon="el-icon-s-promotion"
            size="small"
            @click="addListClick()"
            >提交</el-button
          >
          <el-button icon="el-icon-delete" size="small" @click="batchdel()"
            >删除</el-button
          >
        </div>

        <router-link
          class="margin_l_10"
          :to="{ name: 'ListFill', query: { k: Date.now() } }"
        >
          <el-button icon="iconfont icon-cancel" size="small">返回</el-button>
        </router-link>
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
        <el-table-column type="selection" width="65"></el-table-column>
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
              <div v-else>
                <p v-if="item.is_counted">
                  {{ item.field_label }}:{{ item.value }}
                </p>
              </div>
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
            <el-link
              @click="detailClick(prop.row)"
              class="margin_r_5"
              type="info"
              >详情</el-link
            >
            <el-link
              v-if="
                prop.row.State == 0 ||
                prop.row.State == 2 ||
                prop.row.State == 6
              "
              @click="submitClick(prop.row.Code, 1)"
              class="margin_r_5"
              type="primary"
            >
              提交</el-link
            >
            <el-link
              v-if="
                prop.row.State == 0 ||
                prop.row.State == 2 ||
                prop.row.State == 6
              "
              @click="ediotrFillClick(prop.row)"
              class="margin_r_5"
              type="warning"
            >
              编辑</el-link
            >
            <el-link @click="delClick(prop.row.Code)" type="danger">
              删除</el-link
            >
            <!-- <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="detailClick(prop.row)">详情</p>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    prop.row.State == 0 ||
                    prop.row.State == 2 ||
                    prop.row.State == 6
                  "
                  ><p @click="submitClick(prop.row.Code, 1)">
                    提交
                  </p></el-dropdown-item
                >
                <el-dropdown-item
                  v-if="
                    prop.row.State == 0 ||
                    prop.row.State == 2 ||
                    prop.row.State == 6
                  "
                  ><p @click="ediotrFillClick(prop.row)">
                    编辑
                  </p></el-dropdown-item
                >
                <el-dropdown-item
                  ><p @click="delClick(prop.row.Code)">
                    删除
                  </p></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </data-tables>
      <div class="clearfix"></div>
      <div class="text_right">
        <el-link type="primary" class="margin_l_5 link_font" @click="gourl()"
          >查看汇总>></el-link
        >
      </div>
    </div>
    <el-dialog
      title="选择审批"
      :visible.sync="dialogTableVisible"
      width="600px"
      class="audit_dialog"
      :close-on-click-modal="false"
    >
      <el-form class="auditform" label-width="80px" @submit.native.prevent>
        <el-form-item label="部门">
          <el-select
            v-model="select_depart"
            placeholder="请选择"
            @change="auditSelectClick()"
            filterable
          >
            <el-option
              v-for="item in auditkey"
              :key="item"
              :label="auditlist[item].depart_name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批">
          <el-select v-model="select_auditcode" placeholder="请选择">
            <el-option
              v-for="item in audit_key_list"
              :key="item.NodeCode"
              :label="item.ConditionName"
              :value="item.NodeCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="auditSubmitClick()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <FillAlert
      :is_add="is_add"
      :formlist="formlist"
      :task_code="task_code"
      @back="fillBack"
      @subback="subFillBack"
    ></FillAlert>
    <FillEditorAlert
      :is_add="is_editor"
      :form_data="formdetail"
      :main_code="main_code"
      :task_code="task_code"
      :detail="detail"
      @back="fillEBack"
      @subback="subFillEBack"
    ></FillEditorAlert>
    <DetailAlert
      :is_add="is_detail"
      :detail="detail"
      :form_data="formdetail"
      @back="detailBack"
      @otherback="otherDetailBack"
    ></DetailAlert>
    <LogAlert :is_add="is_log" :code="logcode" @back="logBack"> </LogAlert>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';

import FillAlert from './components/fillSelectForm'
import FillEditorAlert from './components/fillEditorAlert'
import DetailAlert from './components/detailAlert'
import LogAlert from './components/logAlert'
export default {
  name: 'formlist_fill',
  components: { FillAlert, FillEditorAlert, DetailAlert, LogAlert },
  data () {
    return {
      loading: false,
      task_code: '',
      formlist: [],
      is_tab: true,
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
      user: this.$store.state.user
    }
  },
  methods: {
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
      let num = 2
      if (this.is_tab) {
        num = 1
      } else {
        num = 2
      }
      this.$router.push({ name: 'filllistFill', query: { name: item.Title, num: num, taskname: this.$route.query.name, id: beforeEncrypt(item.Code), taskcode: this.$route.query.id } })
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
      console.log('---------')
      console.log(lists)
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
      return list_h.reverse().concat(list_s.reverse())
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
        userid: this.$store.state.userid,
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
    // let other = this.$route.query.other
    let num = this.$route.query.num
    console.log(num)
    if (num == 1 || num == undefined) {
      this.is_tab = true
    } else {
      this.is_tab = false
    }
    this.getselfformlist()
    this.allmaindatabyformcodeanduserid()
    this.getauditlist()
    // this.select_depart = JSON.parse(this.$store.state.user).departid
    // console.log(this.select_depart)
  }
}
</script>
<style lang="less">
.formlist_fill {
  .other_count {
    background: #f56c6c;
    display: inline-block;
    font-size: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }
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