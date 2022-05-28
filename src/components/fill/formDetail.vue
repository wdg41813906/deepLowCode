<template>
  <div class="form_list_fill">
    <div v-if="!is_more">
      <div class="top_form">
        <span class="name_span">{{ name }}表单</span>
        <span class="right">
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
          <router-link
            :to="{
              name: 'formlistFill',
              query: {
                id: $route.query.taskcode,
                k: Date.now(),
                name: $route.query.taskname,
                num: $route.query.num,
              },
            }"
            class="margin_l_15"
          >
            <el-button icon="iconfont icon-cancel" size="small">返回</el-button>
          </router-link>
        </span>
      </div>
      <!-- <div class="text_right top_form">
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
        <router-link
          :to="{
            name: 'formFill',
            query: { id: $route.query.taskcode, k: Date.now() },
          }"
          class="margin_l_15"
        >
          <el-button icon="iconfont icon-cancel" size="small">返回</el-button>
        </router-link>
      </div> -->
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
          :pagination-props="{ pageSizes: [5, 10, 15] }"
          :row-key="row_key"
          :expand-row-keys="expandRowKeys"
          @selection-change="handleSelectionChange"
          :table-props="tableProps"
        >
          <el-table-column type="selection" width="65"></el-table-column>
          <!-- <el-table :data="tableData" style="width: 100%"> -->
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
                  <span
                    @click="goimg(item_img.url)"
                    class="upload_list_span cursor"
                  >
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
              </el-dropdown>
            </template>
          </el-table-column>
        </data-tables>
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
import FillAlert from './components/fillAlert'
import FillEditorAlert from './components/fillEditorAlert'
import DetailAlert from './components/detailAlert'
import LogAlert from './components/logAlert'
export default {
  name: 'form_list',
  components: { FillAlert, FillEditorAlert, DetailAlert, LogAlert },
  data () {
    return {
      name: '',
      is_log: false,
      logcode: '',
      corpid: this.$store.state.corpid,
      dialogTableVisible: false,
      formdetail: {},
      task_code: '',
      is_add: false,
      is_editor: false,
      tableData: [],
      main_code: '',
      dellist: [],
      TypeId: 3,
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
    logClick (code) {
      this.logcode = code
      this.is_log = !this.is_log
    },
    logBack (val) {
      this.is_log = val
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
      if (this.TypeId == 0) {
        //不需要审批
        if (num == 1) {
          //单条审批
          this.commitmaindatawithoutaudit(codeval)
        } else {
          //批量审批
          this.batchcommitmaindatawithoutaudit(codeval)
        }
      } else if (this.TypeId == 3) {
        this.dialogTableVisible = !this.dialogTableVisible
        this.num = num
        this.codeval = codeval
        //选择部门审批
        if (num == 1) {
          //单条审批
        } else {
          //批量审批
        }
      } else {
        console.log('sdfsdf')
        //简单审批
        if (num == 1) {
          //单条审批
          this.commitmaindatawithtask(codeval)
        } else {
          //批量审批

          this.batchcommitmaindatawithtask(codeval)
        }
      }

    },
    /*--------------start----------------*/
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
    //不需要审批
    commitmaindatawithoutaudit (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithoutaudit'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {


        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()


      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithoutaudit (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithoutaudit'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
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
    //简单审批
    commitmaindatawithtask (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['commitmaindatawithtask'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
        this.allmaindatabyformcodeanduserid()

      }).catch(err => {
        console.log(err)
      })
    },
    batchcommitmaindatawithtask (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_codes: JSON.stringify(code),
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['batchcommitmaindatawithtask'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
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
    /*--------------end----------------*/
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
    getformdetail () {
      let $this = this
      let code = this.$route.query.id
      this.task_code = afterEncrypt(this.$route.query.taskcode)
      this.name = this.$route.query.name
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['formdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formdetail = data.data
        this.formdetail.form_code = afterEncrypt(code)

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
        userid: this.$store.state.userid,
        form_code: afterEncrypt(code),
        task_code: this.task_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allmaindatabyformcodeanduserid'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tableData = data.data
        this.select_depart = ''
        this.select_auditcode = ''
        if (data.data.length == 0) {
          // this.filed_infos = data.filed_infos
          this.filed_infos = []
          for (let i in data.filed_infos) {
            this.filed_infos.push({ label: data.filed_infos[i].label })
          }
          this.filed_infos.push({ label: '状态' })
          this.filed_infos.push({ label: '操作' })
        }
        // this.formdetail.form_code = afterEncrypt(code)

      }).catch(err => {
        console.log(err)
      })
    },


  },
  mounted () {
    console.log('000000')
    this.getformdetail()
    this.allmaindatabyformcodeanduserid()

    this.getauditlist()
  }
}
</script>
<style lang="less">
.form_list_fill {
  .type_div {
    margin-top: 20px;
    // cursor: pointer;
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