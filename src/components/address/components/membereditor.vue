<template>
  <div class="editormember" v-show="my_add_show">
    <div class="member_colRight_head">
      <span class="member_right_title">编辑成员信息</span>
    </div>
    <div class="js_has_member">
      <div class="operation_member">
        <el-row>
          <el-col :span="18">
            <el-button
              size="small"
              @click="submitForm('ruleForm')"
              type="primary"
              icon="iconfont icon-baocun"
              >保存</el-button
            >
            <el-button size="small" @click="back()" icon="iconfont icon-cancel"
              >取消</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="member_colRight_table">
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
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="ruleForm.mobile"
              placeholder="请输入手机号"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="ruleForm.email"
              placeholder="成员唯一标识"
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
          <el-form-item label="部门" prop="departid">
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
          <el-form-item label="备注">
            <el-input v-model="ruleForm.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <depart-alert
      :is_add="is_add"
      :departlist="selectdepart"
      :title="'请选择部门'"
      @departSub="departSub"
      @back="addPEvent"
    ></depart-alert>
  </div>
</template>

<script>
import DepartAlert from './departAlert'
export default {
  name: 'editormember',
  props: {
    selectFile: Object,
    editor_show: Boolean,
    userdetail: Object,
    random: Number
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
      is_add: false,
      career_list: [],
      position_list: [],
      my_add_show: false,
      selectdepart: [],
      ruleForm: {
        userid: '',
        username: '',
        departid: '',
        mobile: '',
        email: '',
        position: '',
        career: '',
        remark: '',
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
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          console.log(this.ruleForm)
          let payload = this.ruleForm
          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['edituser'] + '?signature=' + keyvalue;

          this.$server.post(posturl, createvalue['fd']).then(data => {
            this.$message({
              message: '编辑成功！',
              type: 'success'
            });
            this.back()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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
      this.is_add = val
    },
    addDepartClick () {
      console.log('sdfsdf')
      this.is_add = !this.is_add
    },
    back () {
      this.my_add_show = !this.my_add_show
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

    userdetail (val) {
      console.log(val)

    },
    editor_show (val) {
      console.log('123123123')
      this.my_add_show = val
      console.log(this.userdetail)

      this.selectdepart = [{ id: this.userdetail.DepartmentId, depart_id: this.userdetail.DepartmentId, Department: this.userdetail.Department }]
      this.ruleForm = {
        userid: this.userdetail.UserId,
        username: this.userdetail.Name,
        departid: this.userdetail.DepartmentId,
        mobile: this.userdetail.Mobile,
        email: this.userdetail.Email,
        position: this.userdetail.Position,
        career: this.userdetail.Career,
        remark: this.userdetail.Remark,
      }

    },
    my_add_show (val) {
      console.log('dsdfsdfsdfsdf')
      this.$emit('backadd', val)
    }
  }
}
</script>

<style scoped lang="less">
.editormember {
  .el-textarea,
  .el-select {
    width: 250px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
.register_item {
  font-size: 14px;
  /* width: 362px; */
  margin: 20px 20px;
}
.register_item > span {
  width: 80px;
  display: inline-block;
  text-align: right;
}
.item_div {
  display: table-cell;
  padding-top: 5px;
  vertical-align: top;
  width: 80px;
  text-align: right;
}
.editormember .el-input {
  width: 250px;
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
</style>
