<template>
  <div class="editor_user_alert">
    <el-dialog
      title="编辑当前任务的个人信息"
      :visible.sync="my_is_add"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          label-width="100px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="工号" prop="userid">
            <el-input
              v-model="ruleForm.userid"
              placeholder="成员唯一标识"
              size="small"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="ruleForm.username"
              placeholder="请输入用户名"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-select v-model="ruleForm.position">
              <el-option
                v-for="item in position_list"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="career">
            <el-select v-model="ruleForm.career">
              <el-option
                v-for="item in career_list"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="填报状态" prop="state">
            <el-select v-model="ruleForm.state">
              <el-option
                v-for="item in state_list"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="学院" prop="departid">
            <div class="editor_right" style="display: table-cell">
              <div class="ww_groupSelBtn">
                <div
                  class="ww_groupSelBtn_item"
                  v-for="item in selectdepart"
                  :key="item.id"
                >
                  <span class="ww_img"></span>
                  <span class="ww_groupSelBtn_item_text">{{
                    item.Department
                  }}</span>
                  <i
                    class="el-icon-close img_icon"
                    @click="deldepart(item)"
                  ></i>
                </div>
              </div>
              <div
                class="ww_groupSelBtn ww_groupSelBtn_add"
                @click="addDepartClick"
              >
                修改
              </div>
            </div>
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
    <depart-alert
      :is_add="is_depart"
      :departlist="selectdepart"
      :title="'请选择学院'"
      @departSub="departSub"
      @back="addPEvent"
    ></depart-alert>
  </div>
</template>
<script>

import DepartAlert from '../../address/components/departAlert'
export default {
  name: 'new_task_alert',
  props: {
    is_add: Boolean,
    detail: Object
  },
  components: { DepartAlert },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        // this.is_mobile = false
        // return callback(new Error('手机号不能为空'));
        callback()
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback()
        } else {
          this.is_mobile = false
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        // this.is_mobile = false
        // return callback(new Error('手机号不能为空'));
        callback()
      } else {
        if (/^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(value) == false) {
          return callback(new Error("邮箱格式错误"));
        } else {
          callback();
        }

      }
    };
    var checkUserid = (rule, value, callback) => {
      if (!value) {
        this.is_mobile = false
        return callback(new Error('请输入工号'));
      } else {
        let payload = {
          userid: value
        }
        let _this = this

        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['checkuserid'] + '?signature=' + keyvalue;
        console.log(payload)
        this.$server.post(posturl, createvalue['fd']).then(data => {
          console.log(data)
          if (data.data) {
            this.is_mobile = false
            callback(new Error('工号已存在！'));
          } else {
            this.is_mobile = true
            callback()
          }

        })
      }
    }
    return {
      is_depart: false,
      career_list: [],
      position_list: [],
      selectdepart: {},
      my_detail: {},
      my_is_add: false,
      state_list: [{ label: '普通填报', value: 0 }, { label: '首次填报', value: 1 }],
      ruleForm: {
        task_code: '',
        userid: '',
        username: '',
        departid: '',
        position: '',
        career: '',
        state: ''
      },
      rules: {
        departid: [
          { required: true, message: '请选择部门', trigger: 'blur' },
          // { validator: checkAge, trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          // { validator: checkUserid, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        position: [
          { required: true, message: '请选择职位', trigger: 'blur' },
          // { validator: checkAge, trigger: 'blur' }
        ],
        career: [
          { required: true, message: '请选择职称', trigger: 'blur' },
        ],
        state: [
          { required: true, message: '请选择填报状态', trigger: 'blur' },
        ],

      }
    }
  },
  methods: {
    deldepart (item) {
      let index = this.selectdepart.indexOf(item)
      if (index > -1) {
        this.$delete(this.selectdepart, index)
      }
      this.ruleForm.departid = ''
    },
    departSub (val) {
      console.log(val)
      this.selectdepart = val
      this.ruleForm.departid = val[0].id
    },
    addPEvent (val) {
      console.log(val)
      this.is_depart = val
    },
    addDepartClick () {
      console.log('sdfsdf')
      this.is_depart = !this.is_depart
    },
    back () {
      this.my_is_add = false
    },
    subClick (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          console.log(this.ruleForm)
          // let payload = {
          //   userid: this.$store.state.userid,
          //   corpid: this.$store.state.corpid,
          //   title: this.ruleForm.title,
          //   // remark: this.ruleForm.remark,
          //   // start_date: this.ruleForm.dateval[0],
          //   end_date: this.ruleForm.dateval[1],
          //   task_code: this.detail.Code
          // }
          let payload = this.ruleForm

          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['edittaskuser'] + '?signature=' + keyvalue;
          console.log(this.ruleForm)
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
    },
    getallposition () {
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getallposition'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        data.data.unshift({ Title: '无', Id: 0 })
        this.position_list = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    getallcareer () {
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getallcareer'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        data.data.unshift({ Title: '无', Id: 0 })
        this.career_list = data.data
      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.getallposition()
    this.getallcareer()
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        console.log(this.detail)
        this.my_detail = JSON.parse(JSON.stringify(this.detail))
        console.log(this.my_detail)
        this.selectdepart = [{ id: this.my_detail.DepartmentId, depart_id: this.my_detail.DepartmentId, Department: this.my_detail.Department }]
        this.ruleForm = {
          task_code: this.my_detail.Code,
          userid: this.my_detail.UserId,
          username: this.my_detail.Name,
          position: this.my_detail.Position,
          departid: this.my_detail.DepartmentId,
          career: this.my_detail.Career,
          state: this.my_detail.State
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
.editor_user_alert {
  .el-input,
  .el-textarea {
    width: 350px;
  }
  .editor_righth {
    position: relative;
    display: table-cell;
    vertical-align: bottom;
    padding-left: 8px;
  }
  .ww_groupSelBtn {
    display: inline-block;
    vertical-align: top;
    min-height: 22px;
    font-size: 13px;
    margin-top: 5px;
  }
  .ww_groupSelBtn_item {
    float: left;
    max-width: 231px;
    line-height: 1.5;
    margin: 3px 10px 3px 0;
    padding: 3px 11px 3px 7px;
    background-color: #fff;
    border: 1px solid #e4e6e9;
    border-radius: 2px;
  }
  .ww_img {
    display: inline-block;
    background: url(../../../assets/img/icon_folder_blue.png);
    width: 14px;
    height: 12px;
    margin: 2px 5px 0 0;
  }
  .ww_groupSelBtn_item_text {
    /* float: left; */
    max-width: 174px;
    padding-right: 11px;
    overflow: hidden;
    line-height: 18px;
    cursor: default;
  }
  .img_icon {
    cursor: pointer;
  }
  .ww_groupSelBtn_add {
    cursor: pointer;
    margin-top: 1px;
    color: #0c4c7f;
  }
}
</style>