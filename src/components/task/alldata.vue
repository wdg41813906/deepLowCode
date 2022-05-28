<template>
  <div class="alldatalist">
    <div class="top_form">
      <span
        class="name_span"
        :class="{ active_gatherlist: is_tab }"
        @click="tabClick(1)"
        >{{ title }}</span
      >
      <span class="line_span">|</span>
      <span
        span
        class="name_span"
        :class="{ active_gatherlist: !is_tab }"
        @click="tabClick(2)"
        >数据详情</span
      >
      <span class="right">
        <span v-show="!is_tab">
          <el-input
            placeholder="搜索"
            size="small"
            class="width_150"
            v-model="filters[0].value"
          ></el-input>

          <el-button
            icon="el-icon-plus"
            type="primary"
            size="small"
            class="margin_l_15"
            @click="fillClick()"
            >添加</el-button
          >
          <el-button
            icon="el-icon-delete"
            class="margin_l_15"
            size="small"
            @click="batchdel()"
            >删除</el-button
          >
        </span>

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
    <div class="flex_item">
      <div class="right_fill_top_content">
        <!-- <p class="audit_name_p">工作量数据审核情况</p> -->
        <div class="flex audit_content">
          <div class="flex_item">
            <p class="audit_num">{{ main_data.CommitCount }}</p>
            <p class="audit_font">已提交</p>
          </div>
          <div class="flex_item">
            <p class="audit_num">{{ main_data.DenyCount }}</p>
            <p class="audit_font">已退回</p>
          </div>
          <div class="flex_item">
            <p class="audit_num">{{ main_data.PassedCount }}</p>
            <p class="audit_font">已通过</p>
          </div>
          <div class="flex_item">
            <p class="audit_num">{{ main_data.ReviewingCount }}</p>
            <p class="audit_font">审核中</p>
          </div>
          <!-- <div class="flex_item">
            <p class="audit_num">{{main_data.ImportCount}}</p>
            <p class="audit_font">导入</p>
          </div> -->
        </div>
      </div>
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
                  <div class="left other_left">
                    包含
                    <span class="other_span">{{ items.AllCount }}</span> 条数据
                  </div>
                  <ul class="operation flex right">
                    <li @click="authorizationFormClick(items)">授权导入</li>
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

    <div class="type_div" v-show="!is_tab">
      <!-- <div class="text_right list_top">
        <el-input
          placeholder="搜索用户名"
          size="small"
          class="width_150"
          v-model="filters[0].value"
        ></el-input>
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          class="margin_l_15"
          @click="fillClick()"
          >添加</el-button
        >
        <el-button
          icon="el-icon-delete"
          class="margin_l_15"
          size="small"
          @click="batchdel()"
          >删除</el-button
        >
      </div> -->
      <data-tables
        v-loading="loading"
        :data="table_data"
        :filters="filters"
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
            </div>
          </template>
        </el-table-column>
        <el-table-column label="工号" prop="CreateUserId"></el-table-column>
        <el-table-column label="姓名" prop="CreateUserName"></el-table-column>
        <el-table-column label="表单名" prop="FormName"> </el-table-column>
        <el-table-column label="部门" prop="Department"> </el-table-column>
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
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="detailClick(prop.row)">详情</p>
                </el-dropdown-item>
                <!-- <el-dropdown-item
                  v-if="
                    prop.row.State == 0 ||
                    prop.row.State == 2 ||
                    prop.row.State == 6
                  "
                  ><p @click="submitClick(prop.row.Code, 1)">
                    提交
                  </p></el-dropdown-item
                > -->
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
            </el-dropdown>
          </template>
        </el-table-column>
      </data-tables>

      <div class="clearfix"></div>
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
    <DepartAlertS
      :is_add="is_depart"
      :departlist="departlist"
      :title="'表单授权'"
      @back="departBack"
      @departSub="departSub"
    ></DepartAlertS>
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
    authorizationFormClick (item) {
      console.log(item)
      this.is_depart = true
      this.form_code = item.Code
      if (item.CooperationInfo == null) {
        this.departlist = []
      } else {
        this.departlist = item.CooperationInfo
      }

    },
    departBack (val) {
      this.is_depart = val
    },
    departSub (val) {
      console.log(val)
      console.log(this.form_code)
      let userids = []
      let $this = this
      for (let i in val) {
        delete val[i].Children
        delete val[i].ParentId
        // userids.push({ id: val[i].id, depart_id: val[i].depart_id })
      }
      let payload = {
        cooper: JSON.stringify(val),
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['updatecooper_task'] + '?signature=' + keyvalue;
      console.log(payload)
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '授权成功!'
        });
        this.departlist = []
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange (val) {
      console.log(val)
      this.dellist = val
    },
    subFillBack () {
      this.getgather()
    },
    fillClick () {
      this.is_add = !this.is_add
      console.log(this.is_add)
      console.log(this.formlist)
    },
    fillBack (val) {
      this.is_add = val
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
    submitClick (codeval, num) {
      console.log('ssss')
      console.log(this.TypeId)
      // if (this.TypeId == 0) {
      //   //不需要审批
      //   if (num == 1) {
      //     //单条审批
      //     this.commitmaindatawithoutaudit(codeval)
      //   } else {
      //     //批量审批
      //     this.batchcommitmaindatawithoutaudit(codeval)
      //   }
      // } else if (this.TypeId == 3) {
      this.dialogTableVisible = !this.dialogTableVisible
      this.num = num
      this.codeval = codeval
      //选择部门审批
      if (num == 1) {
        //单条审批
      } else {
        //批量审批
      }
      // } else {
      //   console.log('sdfsdf')
      //   //简单审批
      //   if (num == 1) {
      //     //单条审批
      //     this.commitmaindatawithtask(codeval)
      //   } else {
      //     //批量审批

      //     this.batchcommitmaindatawithtask(codeval)
      //   }
      // }

    },
    /*--------------start----------------*/
    getauditlist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(this.$route.query.id)
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
        this.getgather()

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
              this.getgather()
            }
          });
        } else {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getgather()
        }

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
      console.log(list_h)
      if (list_h[0] == '其他') {
        list_h.reverse()
      }
      return list_h.concat(list_s)
    },
    goback () {
      console.log(this.$route.params.other)
      this.$router.push({ name: 'indexTask', query: { k: Date.now() } })

    },
    goClick (item) {
      this.$router.push({ name: 'formdataTask', params: { other: this.$route.params.other }, query: { id: beforeEncrypt(item.Code), taskname: this.$route.query.name, taskcode: this.$route.query.id, name: item.Title } })
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
      let posturl = $this.$apilist['getformlist'] + '?signature=' + keyvalue;
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
        // userid: this.$store.state.userid,
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
    this.getauditlist()
    this.getgather()
    this.getalltemplateform()
    this.maincountinfo()
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

.alldatalist {
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
    width: 151px;
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