<template>
  <div class="registered">
    <div>
      <div class="top-banner">
        <img src="@/assets/img/logo_index.png" alt="" />
      </div>
      <div class="title-line">
        <span class="tit">注册</span>
      </div>
      <div class="login-box clearfix">
        <div class="login-left"></div>
        <div class="line"></div>
        <div class="login-right">
          <div class="form-login">
            <div class="input-box text_center" id="geetest-wrap">
              <!-- <p class="font_18">联系我们：18525603600</p>
              <p>
                <img src="@/assets/img/erweima.png" alt="" />
              </p> -->
              <div>
                <el-form
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  ref="ruleForm"
                  @submit.native.prevent
                >
                  <el-form-item prop="corp_name">
                    <el-input
                      placeholder="组织名称"
                      v-model.trim="ruleForm.corp_name"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="userid">
                    <el-input
                      placeholder="用户工号"
                      v-model.trim="ruleForm.userid"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="user_name">
                    <el-input
                      placeholder="用户名"
                      v-model.trim="ruleForm.user_name"
                    ></el-input>
                  </el-form-item>

                  <el-form-item prop="mobile">
                    <el-input
                      placeholder="手机号"
                      v-model.trim="ruleForm.mobile"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="verify_code">
                    <div class="flex_verify">
                      <el-input
                        class="left"
                        placeholder="验证码"
                        v-model.trim="ruleForm.verify_code"
                      ></el-input>
                      <span>
                        <el-button v-show="is_count" @click="getCode()"
                          >获取验证码</el-button
                        >
                        <el-button disabled v-show="!is_count"
                          >{{ count }}秒再获取验证码</el-button
                        >
                      </span>
                    </div>
                  </el-form-item>
                  <el-form-item prop="passwd">
                    <el-input
                      placeholder="密码"
                      type="password"
                      v-model.trim="ruleForm.passwd"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      style="width: 414px"
                      @click="submitForm('ruleForm')"
                      >注册</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Validation
      :is_add="is_add"
      @back="BackV"
      @successback="SuccessBack"
    ></Validation>
  </div>
</template>

<script>
import Validation from './validation'
export default {
  name: 'registered',
  components: { Validation },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        this.is_mobile = false
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          let payload = {
            mobile: value
          }
          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['checkmobile'] + '?signature=' + keyvalue;
          console.log(payload)
          this.$server.post(posturl, createvalue['fd']).then(data => {
            console.log(data)
            if (data.data) {
              this.is_mobile = false
              callback(new Error('手机号已存在！'));
            } else {
              this.is_mobile = true
              callback()
            }

          })
        } else {
          this.is_mobile = false
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码！'));
      } else {
        if (value.length < 6)
          callback(new Error('密码过于简单！'));
        else
          callback()
      }
    };
    return {
      is_add: false,
      is_mobile: false,
      count: 0,
      is_count: true,
      flaguser: false,
      ruleForm: {
        corp_name: '',
        userid: '',
        user_name: '',
        mobile: '',
        passwd: '',
        verify_code: '',
      },
      rules: {
        passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { validator: validatePass, trigger: 'blur' }
        ],
        corp_name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
          // { validator: validatePass2, trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请输入用户工号', trigger: 'blur' },
          // { validator: checkAge, trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      }

    }
  },
  methods: {
    BackV (val) {
      this.is_add = val
    },
    SuccessBack () {
      console.log(this.is_mobile)
      let payload = {
        mobile: this.ruleForm.mobile
      }
      let _this = this

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['sendsms'] + '?signature=' + keyvalue;
      console.log(payload)
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.is_count = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.is_count = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }

      })
    },
    getCode () {


      this.$refs['ruleForm'].validateField('mobile', emailError => {
        console.log(emailError)
        if (!emailError) {
          this.is_add = true
        }

      });



      // this.is_add = true
      console.log(this.is_add)


    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let payload = this.ruleForm
          let _this = this

          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['signup'] + '?signature=' + keyvalue;

          this.$server.post(posturl, createvalue['fd']).then(data => {
            this.$message({
              message: '注册成功',
              type: 'success'
            });
            window.location.href = '/login'
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },


    checkuserid () {
      console.log(this.userid)
      let payload = {
        userid: this.userid,
      }
      let _this = this

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['checkuserid'] + '?signature=' + keyvalue;

      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        if (data.code == -2) {
          _this.flaguser = true
        } else {
          _this.flaguser = false
        }
      })

    },
    registerClick () {
      let corpname = this.corpname.trim()
      if (corpname == '') {
        this.$alert('请输入公司名！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }
      let userid = this.userid.trim()
      if (userid == '') {
        this.$alert('请输入用户工号！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }
      if (userid.length < 6) {
        this.$alert('用户工号长度必须大于6位！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let name = this.name.trim()
      if (name == '') {
        this.$alert('请输入用户名！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }

      if (this.flaguser) {
        this.$alert('用户工号已存在！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false
      }
      let pwd = this.pwd.trim()
      if (pwd == '') {
        this.$alert('请输入密码！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }
      let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
      if (!reg.test(pwd) || pwd.length < 6 || pwd.length > 12) {
        this.$alert('密码必须为6-12位的数字和字母的组合！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let pwd_two = this.pwd_two.trim()
      if (pwd_two == '') {
        this.$alert('请再次输入密码！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }

      if (pwd_two != pwd) {
        this.$alert('两次密码不一致！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'

        });
        return false

      }
      let payload = {
        corpname: corpname,
        userid: userid,
        username: name,
        passwd: pwd
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['signup'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(() => {
        this.$alert('注册成功！', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            _this.$router.push({ name: 'login', query: { k: Date.now() } })
          }
        });

      })

    }
  }


}
</script>

<style lang="less">
body {
  background: #ffff;
}
// .register_inside {
//   margin: 144px auto 0;
//   width: 968px;
//   text-align: center;
// }

// .register_item {
//   font-size: 14px;
//   width: 362px;
//   margin: 20px auto;
// }
// .register_item > span {
//   width: 80px;
//   display: inline-block;
//   text-align: right;
// }
// .registered .el-input {
//   width: 250px;
// }
.registered {
  .flex_verify {
    display: flex;
    .el-input {
      width: 280px;
      margin-right: 20px;
    }
  }
  background: @white;
  .top-banner {
    background: @color;
    height: 87px;
    text-align: center;
    margin-bottom: 20px;
  }
  .title-line {
    width: 980px;
    height: 28px;
    margin: 0 auto;
    border-bottom: 1px solid #ddd;
    margin-bottom: 28px;
    text-align: center;
    .tit {
      height: 56px;
      line-height: 56px;
      margin: 0 auto;
      padding: 0 20px;
      font-size: 38px;
      background: #fff;
      text-align: center;
    }
  }
  .login-box {
    position: relative;
    width: 980px;
    margin: 0 auto;
  }
  .form-login {
    position: relative;
  }
  .form-login .input-box {
    margin-top: 50px;
    width: 414px;
  }
  .login-right {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .input-box {
    margin: auto;
  }
  .btn-box {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -moz-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
  }
  .btn_login {
    width: 184px;
  }
}
</style>
