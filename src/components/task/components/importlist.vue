<template>
  <div class="importlist">
    <div class="frame_cnt">
      <div class="ww_normalCntHead">
        <div class="ww_normalCntHead_left">
          <router-link
            :to="{
              name: 'formdataTask',
              params: { other: $route.params.other },
              query: {
                k: Date.now(),
                id: this.$route.query.id,
                taskcode: this.$route.query.taskcode,
                name: this.$route.query.name,
                taskname: this.$route.query.taskname,
              },
            }"
            ><i class="el-icon-arrow-left font_18"></i
          ></router-link>
        </div>
        <div class="ww_normalCntHead_title">批量导入</div>
      </div>
      <div class="register_inside_sec">
        <div class="import_settingTips">
          <div class="import_settingTips_text">
            请下载模版，按格式修改后导入
          </div>
          <a @click="exportClick()" class="qui_btn ww_btn cursor">下载模板</a>
          <div class="clearfix"></div>
        </div>
        <div class="import_settingStage">
          <div class="import_settingStage_upload" v-loading="loading">
            <div
              class="ww_icon ww_icon_XlsThumb"
              v-if="Object.keys(excellist).length == 0"
            ></div>
            <div class="ww_icon ww_icon_linght_thumb" v-else></div>
            <div
              class="import_settingStage_upload_fileName"
              v-if="Object.keys(excellist).length == 0"
            >
              仅支持xls、xlsx格式文件
            </div>
            <div class="import_settingStage_upload_fileName" v-else>
              {{ excellist.docname }}
            </div>
            <div class="import_settingStage_upload_inputWrap">
              <el-button
                size="small"
                v-if="Object.keys(excellist).length == 0"
                class="corsur"
                >上传文件</el-button
              >
              <el-button size="small" v-else>重新上传</el-button>

              <input
                type="file"
                class="qui_btn ww_btn ww_fileInputWrap inputFile cursor"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ref="inputfile"
                @change="uploadfile"
              />
            </div>
          </div>
        </div>
        <div style="text-align: center">
          <el-button
            type="primary"
            style="width: 250px"
            @click="excelupload"
            v-loading="exportload"
            >导入</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="form_other_detail">
        <el-row>
          <el-col :span="24">导入成功数据：{{ exportdata.success }} 条</el-col>
          <el-col :span="24" v-if="exportdata.f_data.length > 0"
            >导入失败的数据列表，其工号不存在</el-col
          >
        </el-row>
      </div>
      <div v-if="exportdata.f_data.length > 0">
        <!-- <p>导入失败的数据，其工号不存在</p> -->
        <data-tables
          v-loading="loading"
          :data="exportdata.f_data"
          :pagination-props="{ pageSizes: [5, 10, 15] }"
          :row-key="row_key"
          :expand-row-keys="expandRowKeys"
          @selection-change="handleSelectionChange"
          :table-props="tableProps"
        >
          <el-table-column label="工号" prop="UserId"> </el-table-column>
          <el-table-column label="用户名" prop="Name"> </el-table-column>
        </data-tables>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goother()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { afterEncrypt } from '../../../utils/encryption'
export default {
  name: 'importlist',
  data () {
    return {
      dialogVisible: false,
      appid: '',
      se: '',
      excellist: {},
      imgurl: this.$store.state.imgurl,
      departdetail: {},
      loading: false,
      exportdata: { f_data: [] },
      exportload: false,
    }
  },
  methods: {
    goother () {
      this.$router.push({ name: 'filllistTask', query: { id: this.$route.query.id, taskcode: this.$route.query.taskcode } })
    },
    exportClick () {
      let _this = this
      let payload = {
        corpid: _this.$store.state.corpid,
        userid: _this.$store.state.userid,
        form_code: afterEncrypt(this.$route.query.id)
      }
      let createvalue = _this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      let posturl = _this.$apilist['getexceltemplate'];
      console.log(payload)
      _this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        console.log(this.imgurl)
        // window.open(this.imgurl + '/' + data.data)
        const link = document.createElement('a')
        link.setAttribute("download", data.data.split('/')[1]) //下载的文件名
        link.href = this.imgurl + '/' + data.data  //文件url
        link.click()

      })
    },
    excelupload () {
      if (Object.keys(this.excellist).length == 0) {
        this.$alert('请先上传文件！', '提示', {
          confirmButtonText: '确定',

        });

        return false;
      }
      let _this = this
      let payload = {
        corpid: _this.$store.state.corpid,
        userid: _this.$store.state.userid,
        form_code: afterEncrypt(this.$route.query.id),
        doc_code: this.excellist.doccode,
        task_code: afterEncrypt(this.$route.query.taskcode)
      }
      let createvalue = _this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      let posturl = _this.$apilist['addmaindatabyexcel'];
      console.log(payload)
      this.exportload = true
      _this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.exportload = false
        if (data.data.f_data == null) {
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          _this.$router.push({ name: 'formdataTask', query: { id: this.$route.query.id, taskcode: this.$route.query.taskcode, taskname: this.$route.query.taskname, name: this.$route.query.name } })
        } else {
          console.log(data)
          this.exportdata = data.data
          this.dialogVisible = true
        }
        // _this.$router.push({ name: 'filllistTask', query: { id: this.$route.query.id, taskcode: this.$route.query.taskcode } })


      })
    },
    uploadfile () {
      let _this = this
      let inputDOM = this.$refs.inputfile
      let val = this.isFileType(inputDOM.files)
      if (val == false) {
        return false
      }
      let filsepath = inputDOM.files[0];
      let payload = {
        userid: _this.$store.state.userid,
        // corpid: this.$store.state.corpid
        file: filsepath
      }
      let createvalue = _this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      let posturl = _this.$apilist['uploadfiles'];
      console.log(payload)
      console.log(posturl)
      this.loading = true
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        _this.loading = false
        let dd = data
        setTimeout(function () {
          _this.excellist = dd
          _this.loading = false
          console.log(_this.excellist)
        }, 1000)


      })
    },
    isFileType (files) {
      let Msize = (files[0].size / (1024 * 1024)).toFixed(2)
      console.log(Msize)
      let name = files[0].name;
      console.log(name)
      if (!/.(xls|xlsx)$/.test(name)) {
        this.$alert('请上传excel文件!', '提示', {
          confirmButtonText: '确定',
        });

        return false;

      }
      if (Msize > 20) {
        this.$alert('文件过大,请压缩至20M以内再上传!', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
    },
    getdepart () {
      let id = this.$route.query.k
      let name = this.$route.query.name
      this.departdetail = { id: id, name: name }
    }
  },
  created () {
    this.getdepart()
  }
}
</script>

<style lang='less'>
/* @import "../../../assets/css/index.css"; */
.importlist {
  .frame_cnt {
    width: 1000px;
  }
  .ww_normalCntHead {
    background: rgba(245, 245, 245, 0.5);
    border-bottom: 1px solid #dce1e6;
    border-radius: 4px 4px 0 0;
    padding: 0 18px;
  }
  .clearfix {
    clear: both;
  }
  .register_inside {
    margin: 144px auto 0;
    width: 968px;
    text-align: center;
  }
  .ww_normalCntHead_left {
    position: relative;
    z-index: 2;
    float: left;
    line-height: 40px;
  }
  .ww_normalCntHead_title {
    /* position: absolute; */
    /* left: 18px;
  right: 18px;
  top: 0; */
    z-index: 1;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }

  .import_settingTips {
    width: 450px;
    margin: 20px auto;
    background-color: #fffae2;
    border: 1px solid #fbdd7a;
    font-size: 14px;
    color: #753e00;
    padding: 12px 16px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .import_settingTips_text {
    float: left;
    line-height: 26px;
  }
  .import_settingTips .ww_btn {
    float: right;
    line-height: 26px;
  }
  .inputFile {
    position: absolute;
    height: 640%;
    width: 500%;
    top: 0;
    right: 0;
    /* filter: alpha(opacity=0); */
    padding: 0;
    margin: 0;
    opacity: 0;
  }
  .import_settingStage {
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dadfe2;
    -webkit-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.06);
    margin: 20px auto 15px;
    width: 450px;
    text-align: center;
  }
  .import_settingStage_upload {
    padding: 60px 0 50px;
    border-bottom: 1px solid #e4e6e9;
  }
  .ww_icon_XlsThumb {
    background: url(../../../assets/img/icons.svg);
    background-position: -558px -202px;
    width: 42px;
    height: 50px;
  }
  .ww_icon_linght_thumb {
    background: url(../../../assets/img/icons.svg);
    background-position: -558px -152px;
    width: 42px;
    height: 50px;
  }
  .ww_icon {
    display: inline-block;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
  }
  .import_settingStage_upload_fileName {
    margin-top: 5px;
    color: #787878;
    min-height: 18px;
  }
  .import_settingStage_upload_inputWrap {
    margin-top: 10px;
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .import_settingStage_groupSel {
    padding: 8px 15px;
  }
  .import_settingStage_groupSel_linkBtn {
    float: right;
    line-height: 28px;
    font-size: 14px;
  }
  .import_settingStage_groupSel_left {
    font-size: 14px;
    color: #555557;
    overflow: hidden;
    zoom: 1;
  }
  .import_settingStage_groupSel_left_text {
    float: left;
    line-height: 28px;
  }
  .import_settingStage_groupSel_left .ww_groupSelBtn {
    display: block;
    overflow: hidden;
    zoom: 1;
  }
  .import_settingStage_groupSel_left .ww_groupSelBtn_item {
    margin-top: 1px;
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
  .ww_coommonImg {
    background: url(../../../assets/img/icon_folder_blue.png);
    display: inline-block;
    overflow: hidden;
    width: 14px;
    height: 12px;
    margin-right: 2px;
  }
}
</style>
