<template>
  <div class="new_task_alert">
    <el-dialog
      title="编辑任务"
      :visible.sync="my_is_add"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="任务名" prop="title">
            <el-input v-model="ruleForm.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="dateval">
            <div class="el-input">
              <el-date-picker
                size="small"
                v-model="ruleForm.dateval"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="my_is_add = false" size="small">取 消</el-button>
        <el-button type="primary" @click="subClick('ruleForm')" size="small"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'new_task_alert',
  props: {
    is_add: Boolean,
    detail: Object
  },
  data () {
    var checkDate = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('请选择日期'));
      } else {
        callback()

      }
    };
    return {
      my_is_add: false,
      ruleForm: {
        title: '',
        remark: '',
        dateval: [],
      },
      rules: {
        title: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        dateval: [
          { validator: checkDate, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    back () {
      this.my_is_add = false
    },
    subClick (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          console.log(this.ruleForm)
          let payload = {
            userid: this.$store.state.userid,
            corpid: this.$store.state.corpid,
            title: this.ruleForm.title,
            remark: this.ruleForm.remark,
            start_date: this.ruleForm.dateval[0],
            end_date: this.ruleForm.dateval[1],
            task_code: this.detail.Code
          }

          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['editonetask'] + '?signature=' + keyvalue;

          this.$server.post(posturl, createvalue['fd']).then(data => {
            this.$message({
              message: '编辑成功！',
              type: 'success'
            });
            this.back()
            this.$emit('sub')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        console.log(this.detail)
        this.ruleForm = {
          title: this.detail.Title,
          remark: this.detail.Remark,
          dateval: [this.detail.StartDate, this.detail.EndDate]
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
.new_task_alert {
  .el-input,
  .el-textarea {
    width: 350px;
  }
}
</style>