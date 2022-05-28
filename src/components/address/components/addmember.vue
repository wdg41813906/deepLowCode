<template>
  <div class="addmember">
    <div class="member_colRight_head">
      <span class="member_right_title">添加成员</span>
    </div>
    <div class="js_has_member">
      <div class="operation_member">
        <el-button
          size="small"
          type="primary"
          icon="iconfont icon-baocun"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button size="small" @click="back" icon="iconfont icon-cancel"
          >取消</el-button
        >
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
      @departSub="selectDepart"
      @back="addPEvent"
    ></depart-alert>
  </div>
</template>

<script>
import DepartAlert from './departAlert'
export default {
  name: 'addmember',
  props: {
    selectFile: Object,
    add_show: Boolean,
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
    };
    return {
      is_add: false,

      check_user: false,
      position_list: [],
      career_list: [],
      my_add_show: this.add_show,
      selectdepart: [{ id: this.selectFile.data.id, Department: this.selectFile.data.Department, depart_id: this.selectFile.data.depart_id }],
      ruleForm: {
        userid: '',
        username: '',
        departid: this.selectFile.data.id,
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
          { validator: checkUserid, trigger: 'blur' }
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
    selectDepart (val) {
      console.log(val)
      this.selectdepart = val
      this.ruleForm.departid = val[0].id
    },
    addPEvent (val) {
      this.is_add = val
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          console.log(this.ruleForm)
          let payload = this.ruleForm
          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['addoneuser'] + '?signature=' + keyvalue;

          this.$server.post(posturl, createvalue['fd']).then(data => {
            this.$message({
              message: '添加成功！',
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
    // selectDepart (val) {
    //   console.log(val)
    //   this.selectdepart = val
    // },
    // addPEvent (val) {
    //   this.is_add = val
    // },
    addDepartClick () {
      this.is_add = !this.is_add
    },
    back () {
      console.log('sdfsdf')
      console.log(this.my_add_show)
      this.my_add_show = !this.my_add_show
      console.log(this.my_add_show)
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
    add_show (val) {
      console.log('123123123')
      this.my_add_show = val
      console.log(this.selectFile)
      // if (val) {
      //   this.ruleForm.departid = this.selectFile.id
      // }

    },
    my_add_show (val) {
      console.log('val')
      this.$emit('backadd', val)
    }
  }
}
</script>

<style scoped lang="less">
.addmember {
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
.check_mobile_p {
  display: inline-block;
  color: red;
  margin-left: 5px;
}
.item_div {
  display: table-cell;
  padding-top: 5px;
  vertical-align: top;
  width: 80px;
  text-align: right;
}
.addmember .el-input {
  width: 250px;
}
.editor_right {
  position: relative;
  display: table-cell;
  vertical-align: bottom;
  /* padding-left: 8px; */
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
