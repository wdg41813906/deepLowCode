<template>
  <div class="task_list">
    <div class="text_right top_form">
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="small"
        @click="newClick()"
        >新建任务</el-button
      >
    </div>
    <div>
      <data-tables
        v-loading="loading"
        :data="tasklist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <el-table-column label="任务名" prop="Title"> </el-table-column>

        <el-table-column label="时间">
          <template slot-scope="props">
            {{
              new Date(
                +new Date(new Date(props.row.StartDate).toJSON()) +
                  8 * 3600 * 1000
              )
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .slice(0, -3)
                .split(" ")[0]
            }}至{{
              new Date(
                +new Date(new Date(props.row.EndDate).toJSON()) +
                  8 * 3600 * 1000
              )
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .slice(0, -3)
                .split(" ")[0]
            }}</template
          >
        </el-table-column>
        <!-- <el-table-column label="学期" prop="Term"> </el-table-column> -->
        <el-table-column label="备注" prop="Remark">
          <template slot-scope="props">
            <span v-if="props.row.Remark == ''">无</span>
            <p class="p_over_2" v-else :title="props.row.Remark">
              {{ props.row.Remark }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="props">
            <div class="flow-permisson-row">
              <span>
                <span class="success flow_per" v-if="props.row.State == 0"
                  >进行中</span
                >
                <span class="flow_per warning" v-if="props.row.State == 1"
                  >未开始</span
                >
                <span class="flow_per danger" v-if="props.row.State == 2"
                  >结束</span
                >
                <span class="flow_per danger" v-if="props.row.State == -1"
                  >锁定</span
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-dropdown>
              <i class="el-icon-more font_18 cursor"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="props.row.State != -1">
                  <p
                    :underline="false"
                    type="primary"
                    @click="switchClick(props.row)"
                    class="link_font"
                  >
                    <span
                      class="success"
                      v-if="props.row.State == 1 || props.row.State == 2"
                      >激活</span
                    >
                    <span v-else class="danger">停用</span>
                  </p>
                </el-dropdown-item>
                <el-dropdown-item v-if="props.row.State != -1"
                  ><p @click="editorClick(props.row)">编辑</p></el-dropdown-item
                >
                <el-dropdown-item v-if="props.row.State != -1"
                  ><p @click="publicClick(props.row)">公示</p></el-dropdown-item
                >
                <el-dropdown-item
                  ><p @click="goTaskGClick(props.row)">
                    数据
                  </p></el-dropdown-item
                >
                <el-dropdown-item v-if="props.row.State != -1">
                  <p @click="delTaskClick(props.row)">删除</p></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </data-tables>
    </div>
    <NewTaskAlert
      :is_add="is_add"
      @back="newBack"
      @sub="subBack"
    ></NewTaskAlert>
    <EditorTaskAlert
      :is_add="is_editor"
      :detail="detail"
      @back="editorBack"
      @sub="subEditorBack"
    ></EditorTaskAlert>
    <PublicAlert
      :is_add="is_public"
      :detail="public_detail"
      @back="publickBack"
      @sub="publicSub"
    ></PublicAlert>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-alert
        title="输入不一致，请重新输入!"
        type="error"
        v-if="is_flag"
        class="ma"
      >
      </el-alert>
      <el-form
        @submit.native.prevent
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="margin_top_10"
      >
        <el-form-item prop="other" label="为防止误删，请输入完整的任务名">
          <el-input
            v-model="ruleForm.other"
            placeholder="请输入删除任务的任务名"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="subDelClick('ruleForm')" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import NewTaskAlert from './components/newTaskAlert'
import EditorTaskAlert from './components/editorTaskAlert'
import PublicAlert from './components/publicAlert'
import { beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'task_list',
  components: { NewTaskAlert, EditorTaskAlert, PublicAlert },
  data () {
    return {
      ruleForm: { other: '' },
      rules: {
        other: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
      },
      is_flag: false,
      dialogVisible: false,
      tasklist: [],
      is_add: false,
      is_editor: false,
      detail: {},
      del_detail: {},
      is_public: false,
    }
  },
  methods: {
    goTaskGClick (item) {
      console.log(item)
      this.$router.push({ name: 'alldataTask', query: { id: beforeEncrypt(item.Code), name: item.Title } })
    },
    publicClick (item) {
      this.is_public = true
      this.public_detail = item
    },
    publickBack (val) {
      this.is_public = val
    },
    publicSub () {
      this.alltasklist()
    },
    switchClick (items) {
      let $this = this
      let payload = {
        task_code: items.Code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      if (items.State == 0) {
        payload['state'] = 2
      } else {
        payload['state'] = 0
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['switchtaskstate'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.alltasklist()

      }).catch(err => {
        console.log(err)
      })
    },
    delTaskClick (item) {
      this.dialogVisible = true
      this.del_detail = item
    },
    subDelClick (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          console.log(this.ruleForm)
          console.log(this.ruleForm.other)
          console.log(this.del_detail.Title)
          if (this.ruleForm.other == this.del_detail.Title) {
            console.log('sd')
            this.is_add = false
            let payload = {
              userid: this.$store.state.userid,
              corpid: this.$store.state.corpid,
              task_code: this.del_detail.Code
            }

            let _this = this
            let createvalue = this.$createObj(payload);
            var keyvalue = createvalue['keyvalue'];
            let posturl = this.$apilist['countoftask'] + '?signature=' + keyvalue;

            this.$server.post(posturl, createvalue['fd']).then(data => {
              console.log(data)
              this.lastDelClick(data.data)

            })
          } else {
            this.is_flag = true
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    lastDelClick (data) {
      // this.dialogVisible = false
      // this.ruleForm.other = ''
      let text = '此操作将永久删除该任务, 是否继续?'
      if (data > 0) {
        text = "该任务含有" + data + '条数据，此操作将永久删除该任务, 是否继续?'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let payload = {
          userid: this.$store.state.userid,
          corpid: this.$store.state.corpid,
          task_code: this.del_detail.Code
        }

        let _this = this
        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['delonetask'] + '?signature=' + keyvalue;

        this.$server.post(posturl, createvalue['fd']).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.dialogVisible = false
          this.ruleForm.other = ''
          this.alltasklist()

        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        this.dialogVisible = false
        this.ruleForm.other = ''
      });
    },
    newClick () {
      this.is_add = !this.is_add
    },
    newBack (val) {
      this.is_add = val
    },
    subBack () {
      this.alltasklist()
    },
    editorClick (item) {
      this.detail = item
      this.is_editor = !this.is_editor
    },
    editorBack (val) {
      this.is_editor = val
    },
    subEditorBack () {
      this.alltasklist()
    },
    alltasklist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alltasklist'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.alltasklist()
  }
}
</script>