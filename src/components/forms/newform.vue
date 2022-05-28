<template>
  <div class="newform page">
    <div class="title title_form_header">
      <el-row>
        <el-col :span="4">
          <div>
            <div class="fd-nav-back" @click="backClick()">
              <i class="el-icon-arrow-left"></i>
            </div>
          </div>
        </el-col>
        <el-col
          :span="4"
          :offset="15"
          style="line-height: 60px"
          class="text_right"
        >
          <el-button size="small" @click="saveSet(1)" v-if="mycode == '123'"
            >保存并返回</el-button
          >
          <el-button size="small" @click="saveSet(2)" v-else
            >保存并返回</el-button
          >
        </el-col>
      </el-row>
    </div>

    <div class="clearfix"></div>
    <div class="page__content">
      <DynamicForm
        ref="formDesign"
        :conf="formData"
        :is_add="is_form"
        tabName="formDesign"
        @back="formBack"
        @subback="subAlertBack"
      />
    </div>
  </div>
</template>
<script>
import DynamicForm from './components/DynamicForm/index.vue'
export default {
  name: 'newform',
  components: { DynamicForm },
  data () {
    return {
      detail: {},
      is_form: true,
      nownum: 0,
      "formData": {
        "fields": [
        ],
        "title": "",
        "labelPosition": "top",
        "labelWidth": 100,
        "formRules": "rules",
        "is_template": false,
        "type_id": '',
        "urlpath": '',
        "remark": "",
        "sort": '',
      },
    }
  },
  methods: {
    backClick () {
      this.$confirm('未保存返回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ name: 'formList', query: { k: Date.now() } })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消返回'
        });
      });
    },
    saveSet (num) {
      console.log(this.formData)
      let formDesign = this.$refs.formDesign
      this.formData = formDesign.formConf
      console.log(formDesign.formConf)
      console.log(this.formData)
      for (let i in this.formData.fields) {
        if (this.formData.fields[i].tagIcon == 'calculate' && this.formData.fields[i].strlist.length == 0) {
          this.$alert('请填写 ' + this.formData.fields[i].label + ' 的计算公式！', '提示', {
            confirmButtonText: '确定',

          });
          return false;
        } else if (this.formData.fields[i].tagIcon == 'coefficient') {

          if (this.formData.fields[i].const_value == '') {
            this.$alert('请填加 ' + this.formData.fields[i].label + ' 的系数值！', '提示', {
              confirmButtonText: '确定',

            });
            return false
          }
          if (!/^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(this.formData.fields[i].const_value)) {

            this.$alert(this.formData.fields[i].label + ' 的系数值请填写数字！', '提示', {
              confirmButtonText: '确定',

            });
            return false;
          }
          this.formData.fields[i].const_value = parseFloat(this.formData.fields[i].const_value)
        }
        else if (this.formData.fields[i].tagIcon == 'select' || this.formData.fields[i].tagIcon == 'select_number') {
          if (this.formData.fields[i].options.length == 0) {
            this.$alert('请填加 ' + this.formData.fields[i].label + ' 的选项！', '提示', {
              confirmButtonText: '确定',

            });
            return false;
          } else {
            for (let j in this.formData.fields[i].options) {
              if (this.formData.fields[i].options[j].label == '') {
                this.$alert('请填写 ' + this.formData.fields[i].label + ' 的选项名！', '提示', {
                  confirmButtonText: '确定',

                });
                return false;
              }
              if (this.formData.fields[i].tagIcon == 'select_number' && this.formData.fields[i].options[j].value == '') {
                this.$alert('请填写 ' + this.formData.fields[i].label + ' 的选项值！', '提示', {
                  confirmButtonText: '确定',

                });
                return false;
              }
            }
          }
        }
      }
      if (this.formData.title == '') {
        this.$alert('请在表单属性中填写表单名称！', '提示', {
          confirmButtonText: '确定',

        });
        return false;

      }
      if (this.formData.type_id == '') {
        this.$alert('请选择表单分类！', '提示', {
          confirmButtonText: '确定',

        });
        return false;

      }
      if (this.formData.sort != '') {
        if (!/^[+-]?(0|([1-9]\d*))?$/g.test(this.formData.sort)) {

          this.$alert('顺序请填写整数！', '提示', {
            confirmButtonText: '确定',

          });
          return false;
        }
        this.formData.sort = parseInt(this.formData.sort)
      }


      this.$delete(this.formData, 'form_code')
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_info: JSON.stringify(this.formData)

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addonetemplateform'] + '?signature=' + keyvalue;
      console.log(payload)
      console.log(this.formData)
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$router.push({ name: 'formList', query: { k: Date.now() } })

      }).catch(err => {
        console.log(err)
      })
    }



  }
}
</script>
<style lang="less">
.newform {
  // width: 100vw;
  height: 100vh;
  // padding-top: 54px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #f5f5f7;
  }
  .title_form_header {
    color: @white;
    background: @color;
  }
  .middle {
    margin-top: 20px;
  }
  .fd-nav-back {
    display: inline-block;
    width: 60px;
    height: 60px;
    font-size: 22px;
    border-right: 1px solid #1583f2;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
  }
  .fd-nav-back:hover {
    background: #5af;
  }
  .fd-nav-container {
    position: relative;
  }
  .ghost-bar {
    position: absolute;
    width: 150px;
    height: 100%;
    left: 0;
    background: #1583f2;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ghost-bar:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -5px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 6px;
    border-color: transparent transparent #f6f6f6;
  }
  .fd-nav-item.active .order-num {
    color: #1583f2;
    background: #fff;
  }
  .fd-nav-item {
    position: relative;
    cursor: pointer;
    display: inline-block;
    line-height: 60px;
    width: 150px;
    text-align: center;
    white-space: nowrap;
    .order-num {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #fff;
      border-radius: 50%;
      margin-right: 6px;
      -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}
</style>