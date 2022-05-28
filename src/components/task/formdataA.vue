<template>
  <div class="form_list_fill">
    <div v-if="!is_more">
      <div class="top_form">
        <span class="name_span">{{ $route.query.name }}表单</span>
        <span class="right">
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
            icon="el-icon-upload"
            class="margin_l_15"
            size="small"
            @click="gourl()"
            >批量导入</el-button
          >

          <el-button
            icon="el-icon-delete"
            class="margin_l_15"
            size="small"
            @click="batchdel()"
            >删除</el-button
          >
          <router-link
            :to="{
              name: 'alldataATask',
              query: {
                id: $route.query.taskcode,
                taskcode: $route.query.taskcode,
                k: Date.now(),
                name: $route.query.taskname,
              },
            }"
            class="margin_l_15"
          >
            <el-button icon="iconfont icon-cancel" size="small">返回</el-button>
          </router-link>
        </span>
      </div>

      <div class="text_center" v-if="tableData.length == 0">
        <data-tables
          v-loading="loading"
          :data="tableData"
          :pagination-props="{ pageSizes: [5, 10, 15] }"
          :row-key="row_key"
          :expand-row-keys="expandRowKeys"
          @selection-change="handleSelectionChange"
          :table-props="tableProps"
        >
          <el-table-column
            v-for="item in filed_infos"
            :key="item"
            :label="item.label"
          />
        </data-tables>
      </div>
      <div v-else>
        <data-tables
          v-loading="loading"
          :data="tableData"
          :filters="filters"
          :pagination-props="{ pageSizes: [5, 10, 15] }"
          :row-key="row_key"
          :expand-row-keys="expandRowKeys"
          @selection-change="handleSelectionChange"
          :table-props="tableProps"
        >
          <el-table-column type="selection" width="65"></el-table-column>
          <!-- <el-table :data="tableData" style="width: 100%"> -->
          <el-table-column label="工号" prop="CreateUserId"></el-table-column>
          <el-table-column label="姓名" prop="CreateUserName"></el-table-column>
          <el-table-column label="部门" prop="Department"> </el-table-column>
          <el-table-column label="时间">
            <template slot-scope="prop">
              <p>
                {{
                  new Date(
                    +new Date(new Date(prop.row.CreateTime).toJSON()) +
                      8 * 3600 * 1000
                  )
                    .toISOString()
                    .replace(/T/g, " ")
                    .replace(/\.[\d]{3}Z/, "")
                    .slice(0, -3)
                    .split(" ")[0]
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="item.field_label"
            v-for="(item, index) in tableData[0].FormFieldInfos"
            :key="item"
            v-show="item.tagIcon != 'describe'"
          >
            <template slot-scope="prop">
              <p
                v-if="
                  prop.row.FormFieldInfos[index].opt_label != '' &&
                  prop.row.FormFieldInfos[index].opt_label != 'image' &&
                  prop.row.FormFieldInfos[index].opt_label != 'file'
                "
              >
                {{ prop.row.FormFieldInfos[index].opt_label.split("__")[1] }}
              </p>
              <div
                v-else-if="
                  prop.row.FormFieldInfos[index].assign_data != null &&
                  prop.row.FormFieldInfos[index].assign_data.length > 0
                "
              >
                {{ prop.row.FormFieldInfos[index].value }}
                <!-- <p
                  v-for="assignitem in prop.row.FormFieldInfos[index]
                    .assign_data"
                  :key="assignitem"
                  class="assign_list_p"
                >
                  <span class="assign_list_span assign_list_span_1">
                    {{ assignitem.ToUserName }}</span
                  >：<span class="assign_list_span">{{
                    assignitem.ToValue
                  }}</span>
                </p> -->
              </div>

              <div
                v-else-if="
                  prop.row.FormFieldInfos[index].opt_label == 'image' ||
                  prop.row.FormFieldInfos[index].opt_label == 'file'
                "
              >
                <p
                  v-for="item_img in prop.row.FormFieldInfos[index].value"
                  :key="item_img"
                >
                  <span @click="goimg(item_img.url)" class="upload_list_span">
                    {{ item_img.name }}
                  </span>
                </p>
              </div>
              <p v-else>
                {{ prop.row.FormFieldInfos[index].value }}
              </p>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" width="180"> </el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="props">
              <div class="flow-permisson-row">
                <span @click="logClick(props.row.Code)" class="cursor">
                  <span class="flow_per" v-if="props.row.State == 0"
                    >未提交</span
                  >
                  <span
                    class="flow_per warning"
                    v-else-if="props.row.State == 1"
                    >已提交</span
                  >
                  <span class="flow_per danger" v-else-if="props.row.State == 2"
                    >驳回</span
                  >
                  <span
                    class="flow_per success"
                    v-else-if="props.row.State == 3"
                    >已通过</span
                  >
                  <span
                    class="flow_per warning"
                    v-else-if="props.row.State == 4"
                    >审核中</span
                  >
                  <span
                    class="flow_per success"
                    v-else-if="props.row.State == 5"
                    >已通过</span
                  >
                  <span class="flow_per" v-else-if="props.row.State == 6"
                    >导入数据</span
                  >
                </span>
                <span
                  v-if="props.row.AssignState == 1"
                  class="margin_l_5 flow_per"
                  >(分配未完成)</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
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
      </div>
    </div>

    <FillAlert
      :is_add="is_add"
      :form_data="formdetail"
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
import { getUser } from '../../utils/auth'
import { afterEncrypt, beforeEncrypt } from '../../utils/encryption'
import FillAlert from './components/fillAlertOne'
import FillEditorAlert from './components/fillEditorAlert'
import DetailAlert from './components/detailAlert'
import LogAlert from './components/logAlert'
export default {
  name: 'form_list',
  components: { DetailAlert, LogAlert, FillAlert, FillEditorAlert },
  data () {
    return {
      is_detail: false,
      is_editor: false,
      is_add: false,
      filters: [
        {
          prop: ['CreateUserName', 'Department', 'CreateUserId', 'FormName'],
          value: ''
        }
      ],
      name: '',
      is_log: false,
      logcode: '',
      corpid: this.$store.state.corpid,
      dialogTableVisible: false,
      formdetail: {},
      form_code: '',
      task_code: '',
      is_add: false,
      is_editor: false,
      tableData: [],
      main_code: '',
      dellist: [],
      TypeId: 0,
      auditkey: [],
      audit_key_list: [],
      select_auditcode: '',
      select_depart: '',
      is_detail: false,
      detail: {},
      filed_infos: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } }

    }
  },
  methods: {
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
    otherDetailBack () {
      this.allmaindatabyformcodeanduserid()
    },
    gourl () {
      // let other=this.$route.params.other
      this.$router.push({ name: 'importATask', query: { id: this.$route.query.id, taskcode: this.$route.query.taskcode, taskname: this.$route.query.taskname, name: this.$route.query.name } })
    },
    goimg (key) {
      window.open(key);
      return false;
      let $this = this
      let payload = {
        key: key
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        window.open(data.data);
      }).catch(err => {
        console.log(err)
      })
    },
    allmaindatabyformcodeanduserid () {
      let $this = this
      let code = this.$route.query.id
      this.task_code = afterEncrypt(this.$route.query.taskcode)
      let payload = {
        corpid: this.$store.state.corpid,
        // userid: this.$store.state.userid,
        form_code: afterEncrypt(code),
        task_code: this.task_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allmaindatabyimportuserid'] + '?signature=' + keyvalue;
      // return false;

      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tableData = data.data
        if (data.data.length == 0) {
          // this.filed_infos = data.filed_infos
          this.filed_infos = []
          for (let i in data.filed_infos) {
            this.filed_infos.push({ label: data.filed_infos[i].label })
          }
          // this.filed_infos.push({ label: '状态' })
          // this.filed_infos.push({ label: '操作' })
        }
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },
    getformdetail () {
      let $this = this
      this.form_code = afterEncrypt(this.$route.query.id)
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['formdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formdetail = data.data
        this.formdetail.form_code = this.form_code

      }).catch(err => {
        console.log(err)
      })
    },


  },
  mounted () {
    console.log('000000')
    this.allmaindatabyformcodeanduserid()
    this.getformdetail()
  }
}
</script>
<style lang="less">
.form_list_fill {
  .type_div {
    margin-top: 20px;
    .type_num_span {
      // display: inline-block;
      font-size: 14px;
      color: #999;
    }
    .type_editor_text {
      margin-left: 10px;
    }
    .del_span {
      color: #f56c6c;
    }
  }

  .title_form {
    border-bottom: 1px solid transparent;
    font-size: @font_16;
    margin-left: 10px;
    padding-bottom: 10px;
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
}
</style>