<template>
  <div>
    <div class="lookform_div">
      <el-form label-position="left" :label-width="form_data.labelWidth">
        <el-form-item label="表单">{{ form_data.title }} </el-form-item>
        <!-- <el-form-item>{{ form_data.remark }} </el-form-item> -->
      </el-form>
      <el-form
        class="add_form"
        :label-width="form_data.labelWidth + 'px'"
        :label-position="form_data.labelPosition"
        @submit.native.prevent
      >
        <el-form-item class="remark_style" v-if="form_data.remark != ''">
          {{ form_data.remark }}
        </el-form-item>
        <div v-for="(item, indexS) in form_data1.fields" :key="item">
          <el-form-item
            v-if="
              item.tagIcon == 'divider' ||
              item.tagIcon == 'describe' ||
              item.tagIcon == 'describeImg'
            "
          >
            <div v-if="item.tagIcon == 'divider'">
              <el-divider></el-divider>
            </div>
            <div v-else-if="item.tagIcon == 'describe'">
              <el-tag>{{ item.placeholder }}</el-tag>
            </div>
            <div v-else>
              <el-image :src="item.placeholder"></el-image>
            </div>
          </el-form-item>

          <el-form-item
            v-else-if="item.tagIcon == 'upload'"
            :label-width="
              item.labelWidth > 0
                ? item.labelWidth + 'px'
                : form_data.labelWidth + 'px'
            "
            :label="item.label"
            :label-position="form_data.labelPosition"
            :required="item.required"
          >
            <el-upload
              class="upload-demo"
              :action="domain"
              :data="QiniuData"
              :on-remove="
                (file, fileList) => handleRemoveFile(file, fileList, item)
              "
              :on-error="uploadErrorFile"
              :on-success="
                (response, file, fileList) =>
                  uploadSuccessFile(response, file, fileList, item)
              "
              :before-remove="
                (file, fileList) => beforeRemoveFile(file, fileList, item)
              "
              :before-upload="beforeAvatarUploadFile"
              multiple
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传附件</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传不超过20MB的文件
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item
            v-else-if="item.tagIcon == 'image'"
            :label-width="
              item.labelWidth > 0
                ? item.labelWidth + 'px'
                : form_data.labelWidth + 'px'
            "
            :label="item.label"
            :label-position="form_data.labelPosition"
            :required="item.required"
          >
            <!-- <uploadImg :item="item" :imgList="[]"></uploadImg> -->
            <el-upload
              class="upload-pic"
              :action="domain"
              :data="QiniuData"
              :on-remove="
                (file, fileList) => handleRemove(file, fileList, item)
              "
              :on-error="uploadError"
              :on-success="
                (response, file, fileList) =>
                  uploadSuccess(response, file, fileList, item)
              "
              :before-remove="
                (file, fileList) => beforeRemove(file, fileList, item)
              "
              :before-upload="beforeAvatarUpload"
              list-type="picture-card"
              multiple
              :file-list="imgList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <!-- <el-upload
                class="upload-pic"
                :action="domain"
                :data="QiniuData"
                :on-remove="handleRemove"
                :on-error="uploadError"
                :on-success="
                  (response, file, fileList) =>
                    uploadSuccess(response, file, fileList, item)
                "
                :before-remove="
                  (file, fileList) => beforeRemove(file, fileList, item)
                "
                :before-upload="beforeAvatarUpload"
                list-type="picture-card"
                multiple
                :file-list="imgList"
              >
                <i class="el-icon-plus"></i>
              </el-upload> -->
          </el-form-item>
          <el-form-item
            v-else-if="item.tagIcon == 'calculate'"
            :label-width="
              item.labelWidth > 0
                ? item.labelWidth + 'px'
                : form_data.labelWidth + 'px'
            "
            :label="item.label"
            :label-position="form_data.labelPosition"
          >
            <span class="calculate_span display_inline_block">
              {{ item.value == null ? 0 : item.value }}
            </span>
            <el-button
              size="medium"
              type="text"
              class="margin_l_15"
              v-if="item.enable_assign"
              @click="assignClick(item, indexS)"
              >分配</el-button
            >
            <div v-if="item.assign_data != null">
              <span
                v-if="item.assign_data != null && item.assign_data.length != 0"
                class="success"
              >
                未分配值：{{ calOther(item.value, indexS, item.assign_data) }}
                <span style="color: #fff"
                  >{{ calOther(item.value, indexS, item.assign_data) }}
                </span>
              </span>
              <div
                v-for="(assignitem, index) in item.assign_data"
                :key="assignitem"
                class="margin_top_10"
              >
                <el-select
                  v-model="assignitem.ToUserId"
                  filterable
                  placeholder="请选择被分配人"
                  class="assign_input"
                  :filter-method="dataFilter"
                  @change="assignChange()"
                >
                  <el-option
                    v-for="item in userlist"
                    :key="item.uid"
                    :label="item.name"
                    :value="item.uid"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.uid }}</span
                    >
                  </el-option>
                </el-select>

                <el-input
                  class="assign_input margin_l_15"
                  v-model="assignitem.ToValue"
                  placeholder="请填写分配数值"
                  @input="cal(item.value, item.assign_data, indexS)"
                ></el-input>
                <i
                  class="el-icon-remove assign_icon assign_error danger"
                  @click="removeassign(item, index)"
                ></i>
                <i
                  class="el-icon-circle-plus assign_icon assign_add primary"
                  @click="assignClick(item, indexS)"
                  v-if="index === item.assign_data.length - 1"
                ></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            :label-width="
              item.labelWidth > 0
                ? item.labelWidth + 'px'
                : form_data.labelWidth + 'px'
            "
            :label="item.label"
            :label-position="form_data.labelPosition"
            :required="item.required"
            v-else-if="item.tagIcon != 'calculate'"
          >
            <div v-if="item.tagIcon == 'input'">
              <el-input
                v-model.trim="item.value"
                :placeholder="item.placeholder"
                :maxlength="item.maxlength"
                size="medium"
              ></el-input>
            </div>
            <div v-if="item.tagIcon == 'coefficient'">
              <p>{{ item.const_value }}</p>
            </div>
            <div v-if="item.tagIcon == 'textarea'">
              <el-input
                type="textarea"
                :rows="3"
                v-model="item.value"
                :maxlength="item.maxlength"
                :placeholder="item.placeholder"
              >
              </el-input>
            </div>
            <div v-if="item.tagIcon == 'number'">
              <el-input
                v-model.trim="item.value"
                :placeholder="item.placeholder"
                size="medium"
                @input="enterClick($event)"
              ></el-input>
              <el-button
                size="medium"
                type="text"
                class="margin_l_15"
                v-if="item.enable_assign"
                @click="assignClick(item, indexS)"
                >分配</el-button
              >
              <!-- <input type="text" list="datalist1" />
                <datalist id="datalist1">
                  <option>刘-2020100</option>
                  <option>刘-2020101</option>
                  <option>王-2020102</option>
                </datalist> -->
              <div v-if="item.assign_data != null">
                <span
                  v-if="
                    item.assign_data != null && item.assign_data.length != 0
                  "
                  class="success"
                >
                  未分配值：{{ assign_other[indexS] }}
                </span>
                <div
                  v-for="(assignitem, index) in item.assign_data"
                  :key="assignitem"
                  class="margin_top_10"
                >
                  <el-select
                    v-model="assignitem.ToUserId"
                    filterable
                    placeholder="请选择被分配人"
                    class="assign_input"
                    :filter-method="dataFilter"
                    @change="assignChange()"
                  >
                    <el-option
                      v-for="item in userlist"
                      :key="item.uid"
                      :label="item.name"
                      :value="item.uid"
                    >
                      <span style="float: left">{{ item.name }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.uid }}</span
                      >
                    </el-option>
                  </el-select>

                  <el-input
                    class="assign_input margin_l_15"
                    v-model="assignitem.ToValue"
                    placeholder="请填写分配数值"
                    @input="cal(item.value, item.assign_data, indexS)"
                  ></el-input>
                  <i
                    class="el-icon-remove assign_icon assign_error danger"
                    @click="removeassign(item, index)"
                  ></i>
                  <i
                    class="el-icon-circle-plus assign_icon assign_add primary"
                    @click="assignClick(item, indexS)"
                    v-if="index === item.assign_data.length - 1"
                  ></i>
                </div>
              </div>
            </div>
            <div v-if="item.tagIcon == 'date'">
              <el-date-picker
                v-model="item.value"
                type="date"
                :placeholder="item.placeholder"
                size="medium"
              >
              </el-date-picker>
            </div>
            <div v-if="item.tagIcon == 'select'">
              <el-select
                v-model="item.value"
                :placeholder="item.placeholder"
                size="medium"
              >
                <el-option
                  v-for="items in item.options"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                >
                </el-option>
              </el-select>
            </div>
            <div v-if="item.tagIcon == 'select_number'">
              <span v-if="item.is_counted == false">{{ otherfn(item) }}</span>
              <el-select
                v-model="item.is_counted"
                :placeholder="item.placeholder"
                size="medium"
                @change="selectNChage($event)"
              >
                <el-option
                  v-for="items in item.options"
                  :key="items.value + '__' + items.label"
                  :label="items.label"
                  :value="items.value + '__' + items.label"
                >
                </el-option>
              </el-select>
            </div>
            <div v-if="item.tagIcon == 'rate'">
              <el-rate v-model="item.value" :allow-half="item['allow-half']">
              </el-rate>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div></div>
  </div>
</template>
<script>
import { afterEncrypt } from '../../utils/encryption'
export default {
  name: 'lookform',
  data () {
    return {
      form_data: {},
      is_form: false,
      form_fields: [],
      form_data1: {},
    }
  },
  methods: {
    calOther (val, indexs, assignval) {
      console.log(indexs)
      this.assign_other[indexs] = val
      console.log(this.assign_other)
      // let val = parseFloat(sum)
      // this.assign_other[indexs] = val
      for (let i in assignval) {
        if (typeof assignval[i].ToValue != 'number')
          if (assignval[i].ToValue.split('')[assignval[i].ToValue.length - 1] == '.' || assignval[i].ToValue == '') break;
        if (!(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(assignval[i].ToValue))) {
          this.$alert(' 分配值请填写数字!', '提示', {
            confirmButtonText: '确定',
          });
          return false;

        } else {
          // val -= fen[i].ToValue
          val = this.subtr(val, parseFloat(assignval[i].ToValue))
        }
      }
      this.assign_other[indexs] = val
      return val
    },
    cal (sum, fen, indexs) {
      console.log(sum)
      console.log(fen)
      let val = parseFloat(sum)
      // this.assign_other[indexs] = val
      for (let i in fen) {
        if (fen[i].ToValue.split('')[fen[i].ToValue.length - 1] == '.' || fen[i].ToValue == '') break;
        if (!(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(fen[i].ToValue))) {
          this.$alert(' 分配值请填写数字!', '提示', {
            confirmButtonText: '确定',
          });
          return false;

        } else {
          // val -= fen[i].ToValue
          val = this.subtr(val, parseFloat(fen[i].ToValue))
        }
      }
      this.assign_other[indexs] = val
      console.log(this.assign_other)
      console.log(indexs)
    },
    // 减法
    subtr (arg1, arg2) {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      }
      catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      }
      catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      //last modify by deeka
      //动态控制精度长度
      n = (r1 >= r2) ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
    selectNChage (item) {
      this.subClick()
    },
    enterClick (item) {
      if (item.split('')[item.length - 1] == '.' || item == '') return false;
      if (!(/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(item))) {
        this.$alert(' 请填写数字!', '提示', {
          confirmButtonText: '确定',
        });
        return false;

      }
      console.log(item)
      console.log(this.form_data)
      this.subClick()
    },
    assignClick (item, indexs) {
      console.log(item)
      if (item.value == null || item.value == 0) {
        this.$alert(' 请先填写，再分配!', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      console.log(item.assign_value)
      this.assignChange()
      if (item.assign_data == null) {
        item.assign_data = []
        item['assign_data'].push({ ToUserId: '', ToValue: '' })
      } else {
        item['assign_data'].push({ ToUserId: '', ToValue: '' })
      }
      console.log(item)

    },
    otherfn (item) {
      console.log('-------------------------')
      console.log(item)
      item.is_counted = ''
      return ''
    },
    gettemplateformdetail () {
      let code = afterEncrypt(this.$route.query.id)
      let $this = this
      this.form_code = code
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: code

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettemplateformdetail'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.form_data = data.data
        this.is_form = true
        this.form_data1 = JSON.parse(JSON.stringify(this.form_data))
        this.form_fields = this.form_data1.fields

      }).catch(err => {
        console.log(err)
      })
    },
    getnowdate (val) {
      let date = new Date(val)
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "/" + mymonth + "/" + myweekday);//想要什么格式都可以随便自己拼

    },
    subClick () {
      let formlist = []
      console.log(this.form_fields)
      for (let i in this.form_fields) {
        if (this.form_fields[i].required) {

          if (this.form_fields[i].tagIcon == 'number') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'divider' || this.form_fields[i].tagIcon == 'describe') {
            continue;
          }

          else if (this.form_fields[i].tagIcon == 'select_number') {
            console.log(this.form_fields[i])
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: this.form_fields[i].is_counted, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": false, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].is_counted.split('__')[0]) })

          }
          else if (this.form_fields[i].tagIcon == 'date') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.getnowdate(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'image') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: 'image', "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": false, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          }
          else if (this.form_fields[i].tagIcon == 'upload') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: 'file', "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": false, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          }
          else {
            console.log('sdfffffffff------------------')
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          }

        }
        else {
          if (this.form_fields[i].tagIcon == 'number') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'select_number') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: this.form_fields[i].is_counted, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": false, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": parseFloat(this.form_fields[i].is_counted.split('__')[0]) })

          }
          else if (this.form_fields[i].tagIcon == 'date') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.getnowdate(this.form_fields[i].value) })

          }
          else if (this.form_fields[i].tagIcon == 'image') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: 'image', "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          }
          else if (this.form_fields[i].tagIcon == 'upload') {
            formlist.push({ "field_code": this.form_fields[i].filed_code, opt_label: 'file', "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": this.form_fields[i].enable_assign, "value": this.form_fields[i].value })

          } else if (this.form_fields[i].tagIcon == 'divider' || this.form_fields[i].tagIcon == 'describe') {
            continue;
          }
          else {
            let enable_assign = this.form_fields[i].enable_assign
            formlist.push({ "field_code": this.form_fields[i].filed_code, "field_label": this.form_fields[i].label, "join_gather": this.form_fields[i].join_gather, "is_counted": this.form_fields[i].is_counted, "enable_greater": this.form_fields[i].enable_greater, "enable_assign": enable_assign, "value": this.form_fields[i].value })

          }
        }
      }
      console.log(formlist)
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.form_data.form_code,
        rule_file_info: JSON.stringify(formlist),
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['countfunction'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        if (data.data.length > 0) {
          for (let i in data.data) {
            for (let j in this.form_data1.fields) {
              console.log(this.form_data1.fields[j].filed_code)
              console.log(data.data[i].field_code)
              console.log('------------------------')
              if (this.form_data1.fields[j].filed_code == data.data[i].field_code) {
                this.form_data1.fields[j].value = data.data[i].value
              }
            }
          }
        }
        console.log(this.form_data1.fields)



        // this.formlist = data.data
        // this.form_fields = data.data.fields
        // if (data.data.length > 0) {
        //   for (let i in formlist) {
        //     for (let j in data.data) {
        //       if (formlist[i].field_code == data.data[j].field_code) {
        //         formlist[i].value = data.data[j].value
        //         // break;
        //       }
        //     }

        //   }
        // }
        // this.form_info = formlist
        // console.log($this.form_info)
        // this.is_show = true


      }).catch(err => {
        console.log(err)
      })

    },


  },
  mounted () {
    this.gettemplateformdetail()
  }
}
</script>
<style lang="less">
.lookform_div {
  width: 600px;
  margin: auto;
  background: @white;
  margin-top: 50px;
  padding: 40px;
  min-height: 600px;
  // box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  .el-input {
    width: 445px !important;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
    font-weight: bold;
  }
  .el-form-item__content {
    // line-height: 30px;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-upload__tip {
    line-height: 20px;
  }
}
</style>