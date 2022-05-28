<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="my_is_add"
      width="600px"
      class="detail_alert_dialog"
      :close-on-click-modal="false"
    >
      <div class="form_other_detail">
        <el-row>
          <el-col :span="24">表单名：{{ detail.FormName }}</el-col>
          <el-col :span="12">创建人：{{ detail.CreateUserName }}</el-col>
          <el-col :span="12"
            >创建时间：{{
              new Date(detail.CreateTime)
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .split(" ")[0]
            }}</el-col
          >
        </el-row>
      </div>
      <el-table
        :data="detail_arr"
        v-if="detail_arr.length > 0"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column prop="name" width="150" label="字段">
          <template slot-scope="props">
            <span
              v-if="props.row.str_list != null && props.row.str_list.length > 0"
            >
              {{ props.row.name }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="props.row.str_list.join('')"
                placement="right"
              >
                <i class="el-icon-warning-outline cursor"></i> </el-tooltip
            ></span>

            <span v-else> {{ props.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="数值">
          <template slot-scope="props">
            <p
              v-if="
                props.row.opt_label !== '' &&
                props.row.opt_label !== 'image' &&
                props.row.opt_label !== 'file'
              "
            >
              {{ props.row.opt_label.split("__")[1] }}
            </p>
            <div v-else-if="props.row.opt_label == 'image'">
              <span
                v-for="item_img in props.row.value"
                :key="item_img"
                class="margin_r_10 display_block"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="item_img.url"
                  :preview-src-list="props.row.enable_greater"
                >
                </el-image>
              </span>
            </div>
            <div v-else-if="props.row.opt_label == 'file'">
              <div v-for="item_file in props.row.value" :key="item_file">
                <p>
                  <span @click="goimg(item_file.url)" class="upload_list_span">
                    {{ item_file.name }}
                  </span>
                </p>
              </div>
            </div>
            <p v-else>{{ props.row.value }}</p>
            <div
              v-if="
                props.row.assign_data != null &&
                props.row.assign_data.length > 0
              "
            >
              <el-table :data="props.row.assign_data" border>
                <el-table-column
                  label="被分配人"
                  prop="ToUserName"
                ></el-table-column>
                <el-table-column
                  label="被分配值"
                  prop="ToValue"
                ></el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form class="auditform" label-width="150px" @submit.native.prevent>
        <!-- <el-form-item
          :label="item.field_label + ':'"
          v-for="item in detail.FormFieldInfos"
          :key="item"
          class="detail_form_item"
        >
          <p
            v-if="
              item.opt_label !== '' &&
              item.opt_label != 'image' &&
              item.opt_label != 'file'
            "
          >
            {{ item.opt_label.split("__")[1] }}
          </p>
          <div v-else-if="item.opt_label == 'image'">
            <span
              v-for="item_img in item.value"
              :key="item_img"
              class="margin_r_10 display_block"
            >
              <el-image
                style="width: 100px; height: 100px"
                :src="item_img.url"
                :preview-src-list="item.enable_greater"
              >
              </el-image>
            </span>
          </div>
          <div v-else-if="item.opt_label == 'file'">
            <div v-for="item_file in item.value" :key="item_file">
              <p>
                <span @click="goimg(item_file.key)" class="upload_list_span">
                  {{ item_file.name }}
                </span>
              </p>
            </div>
          </div>
          <p v-else>{{ item.value }}</p> -->
        <!-- <div
            v-if="item.assign_data != null && item.assign_data.length > 0"
            class="assign_show_div"
          >
            <p v-for="items in item.assign_data" :key="items">
              {{ items.ToUserName }}:{{ items.ToValue }}
            </p>
          </div> -->
        <!-- <div v-if="item.assign_data != null && item.assign_data.length > 0">
            <el-table
              :data="item.assign_data"
              border
              v-if="item.assign_data.length <= 5"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            >
              <el-table-column
                label="被分配人"
                prop="ToUserName"
              ></el-table-column>
              <el-table-column
                label="被分配值"
                prop="ToValue"
              ></el-table-column>
            </el-table>
            <data-table></data-table>
            <data-tables
              :data="item.assign_data"
              :pagination-props="{ pageSizes: [5, 10, 15] }"
              :row-key="row_key"
              :expand-row-keys="expandRowKeys"
              @selection-change="handleSelectionChange"
              :table-props="tableProps"
              v-if="item.assign_data.length > 5"
            >
              <el-table-column
                label="被分配人"
                prop="ToUserName"
              ></el-table-column>
              <el-table-column
                label="被分配值"
                prop="ToValue"
              ></el-table-column>
            </data-tables>
          </div>
        </el-form-item> -->
        <el-form-item
          label="审批流程："
          label-width="200px"
          v-if="detail.AuditStates != null"
          class="audit_item"
        >
          <div class="audit_div">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in detail.AuditStates"
                :key="index"
                :color="activity.node_state == 0 ? '#0bbd87' : '#D6D6D6'"
              >
                <div>
                  <div class="left">
                    <p class="audit_title">审批人</p>
                    <p class="audit_num">
                      {{ activity.userids.length }}人
                      <span>{{
                        activity.node_state == 0 ? "(已审批)" : "(待审批)"
                      }}</span>
                    </p>
                  </div>
                  <div class="right">
                    <span
                      v-for="(item, index) in activity.user_info"
                      :key="item"
                    >
                      <!-- <GetTreeNameM :openid="item"></GetTreeNameM> -->
                      {{ item.name }}
                      <span v-if="index < activity.userids.length - 1">/</span>
                    </span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- :is_add="is_editor"
      :detail="detail"
      :task_code="detail.TaskCode"
      @back="editorBack"
      @subback="editorSubBack" -->

    <EditorDetailAlert
      :is_add="is_editor"
      :form_data="detail"
      :detail="detail"
      :main_code="main_code"
      :task_code="detail.TaskCode"
      @back="editorBack"
      @subback="editorSubBack"
    ></EditorDetailAlert>
    <LogAlert :is_add="is_log" :code="logcode" @back="logBack"> </LogAlert>
  </div>
</template>
<script>
import EditorDetailAlert from './editorDetailAlert'
import LogAlert from './logAlert'
// import GetTreeNameM from '../../publicLibrary/getTreeNameM.vue'
export default {
  name: 'detail_alert_dialog',
  props: {
    is_add: Boolean,
    detail: Object,
    is_flag: Number
  },
  components: { EditorDetailAlert, LogAlert },
  data () {
    return {
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      my_is_add: false,
      is_editor: false,
      activeName: '',
      assignlist: [],
      logcode: '',
      is_log: false,
      main_code: '',
      detail_arr: [],
    }
  },
  methods: {
    goimg (key) {
      window.open(key);
      return false;

    },
    logClick (code) {
      this.logcode = code
      this.is_log = !this.is_log
    },
    logBack (val) {
      this.is_log = val
    },

    editorClick (code) {
      this.main_code = code
      this.is_editor = !this.is_editor
    },
    editorSubBack () {
      this.$emit('otherback')
      this.my_is_add = !this.my_is_add
    },
    editorBack (val) {
      this.is_editor = val
    },
    addClick (code) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        main_code: code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['approveone'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.$message({
          type: 'success',
          message: '通过成功!'
        });
        this.editorSubBack()

      }).catch(err => {
        console.log(err)
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

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('otherback')
          this.my_is_add = !this.my_is_add

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {

      });

    },
    callbackone (code) {
      this.$prompt('退回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',

      }).then(({ value }) => {

        // if (value == null || value.trim == '') {
        //   this.$alert('请填写退回理由！', '提示', {
        //     confirmButtonText: '确定',

        //   });
        //   return false;
        // }
        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          main_code: code,
        }
        if (value != null && value.trim != '') {
          payload['content'] = value
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['denyone'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then(() => {

          this.$message({
            type: 'success',
            message: '退回成功!'
          });
          this.$emit('otherback')
          this.my_is_add = !this.my_is_add

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退回！'
        });
      });
    },
    getimgurl (key, item) {

      item.enable_greater = []
      for (let i in item.value) {
        item.enable_greater.push(item.value[i].url)
      }

      // let $this = this
      // let payload = {
      //   key: key.key
      // }

      // let createvalue = $this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      // let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // // return false;
      // $this.$server.post(posturl, createvalue['fd']).then((data) => {
      //   console.log(data)
      //   key.url = data.data
      //   item.enable_greater.push(data.data)
      //   return data.data
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      console.log(this.detail)
      if (val) {
        this.detail_arr = []
        for (let i in this.detail.FormFieldInfos) {
          if (this.detail.FormFieldInfos[i].opt_label == 'image' || this.detail.FormFieldInfos[i].opt_label == 'file') {
            this.enable_assign = []
            this.detail.FormFieldInfos[i].enable_greater = []
            for (let j in this.detail.FormFieldInfos[i].value) {
              let img = this.getimgurl(this.detail.FormFieldInfos[i].value[j], this.detail.FormFieldInfos[i])
              console.log(img)
              console.log(this.detail.FormFieldInfos[i].value[j])
              // this.detail.FormFieldInfos[i].enable_greater.push(this.detail.FormFieldInfos[i].value[j].url)
            }
            console.log(this.detail)

          }
          this.detail_arr.push({ name: this.detail.FormFieldInfos[i].field_label, str_list: this.detail.FormFieldInfos[i].str_list, value: this.detail.FormFieldInfos[i].value, assign_data: this.detail.FormFieldInfos[i].assign_data, opt_label: this.detail.FormFieldInfos[i].opt_label, enable_greater: this.detail.FormFieldInfos[i].enable_greater, })

        }
      }

    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.detail_alert_dialog {
  .assign_show_div {
    padding: 5px;
    border-radius: 5px;
    color: #858e99;
    font-size: @font_12;
    // border: @border;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-dialog__body {
    height: 520px;
    overflow: auto;
    padding-top: 20px;
  }
  .el-form-item__label,
  .el-form-item__content {
    line-height: 25px;
  }
  // .detail_form_item {
  .el-form-item__label {
    color: #858e99;
  }
  // }
}
.detail_alert_dialog {
  .el-collapse {
    border-top: none;
  }
  .el-collapse-item__header {
    height: 25px;
    line-height: 30px;
    border-bottom: none;
  }
  .audit_item {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e3e3e4;
  }
  .audit_div {
    // background: red;
    width: 320px;
    margin-top: 5px;
    .el-timeline-item {
      height: 50px;
    }
    .el-timeline-item__tail {
      top: 10px;
    }
    .el-timeline-item__content {
      line-height: 20px;
    }
    .audit_title {
      // font-size: 18px;
    }
    .audit_num {
      color: #858585;
      font-size: 12px;
    }
  }
}
</style>