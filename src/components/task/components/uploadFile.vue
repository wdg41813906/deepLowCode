<template>
  <div class="upload_file">
    <div v-show="is_error">
      <el-alert title="上传失败，请删除附件重新上传！" type="error"> </el-alert>
    </div>
    <div v-show="loading">
      <el-alert title="上传中！" type="warning"> </el-alert>
    </div>
    <el-upload
      v-loading="loading"
      class="upload-demo"
      action=""
      :data="QiniuData"
      :on-remove="(file, fileList) => handleRemoveFile(file, fileList, item)"
      :on-error="uploadErrorFile"
      :on-success="
        (response, file, fileList) =>
          uploadSuccessFile(response, file, fileList, item)
      "
      :before-remove="
        (file, fileList) => beforeRemoveFile(file, fileList, item)
      "
      :before-upload="beforeAvatarUploadFile"
      :http-request="(file, fileList, item) => Upload(file, fileList, item)"
      multiple
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传附件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传不超过20MB的文件</div>
    </el-upload>
  </div>
</template>
<script>
import { getDate } from '@/utils/encryption'
import { genUpToken, uploadQi } from '@/utils/qiniuToken'
export default {
  name: 'upload_file',
  props: {
    fileList: Object,
    item: Object
  },
  data () {
    return {
      imgurl: this.$store.state.imgurl,
      uploadKey: "",
      uploadToken: "",
      baseUrl: "http://images.xxxx.cn/",
      QiniuData: {
        key: "", //图片名字处理
        token: "" //七牛云token
      },
      // domain: "http://up-z2.qiniu.com", // 七牛云的上传地址（华南区）
      domain: "", // 七牛云的上传地址（华北区）
      qiniuaddr: "", // 七牛云的图片外链地址 你的七牛云里配置有
      uploadPicUrl: "", //提交到后台图片地址
      // fileList: [{ name: '123', url: '-----' }],
      imgList: [],
      nowTime: '',
      fileExtension: '',
      otherlist: [],
      newFile: {},
      is_error: false,
      loading: false
    }
  },
  methods: {
    getval (fileList) {
      let otherlist = []
      for (let i in fileList) {
        if (Object.keys(fileList[i]).join(',').indexOf('response') != -1) {
          otherlist.push({ name: fileList[i].response.key, hash: fileList[i].response.hash, url: fileList[i].url })
        }
      }
      return otherlist
    },
    beforeAvatarUploadFile (file) {

      console.log(this.nowTime);
      //这个this.fileExtension是文件名的后缀
      let filename = file.name.split(".")
      this.fileExtension = filename.pop();
      console.log(this.fileExtension);
      console.log(filename)
      console.log(file)
      this.newFile = file
    },
    Upload (file, fileList, item) {
      console.log(this.newFile)
      let _this = this
      let payload = {
        userid: _this.$store.state.userid,
        // corpid: this.$store.state.corpid
        file: this.newFile
      }
      let createvalue = _this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      let posturl = _this.$apilist['uploadfiles'];
      this.loading = true
      console.log(fileList)
      console.log(file)
      console.log(_this.item)
      _this.$emit('back_btn', true)
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        _this.loading = false
        let dd = data
        console.log(data)

        setTimeout(function () {
          _this.uploadPicUrl = data.urlpath
          _this.otherlist = fileList
          console.log(_this.fileList)
          // console.log(response.data)
          _this.fileList.push({ name: data.docname, url: _this.imgurl + data.urlpath, doccode: data.doccode })
          _this.item.value = _this.fileList
          console.log(_this.item)
          _this.is_error = false
          _this.loading = false
          _this.$emit('back_btn', false)
          _this.$message.success("添加成功")
          _this.$emit('updata:item', _this.item)
        }, 1000)


      }).catch(err => {
        _this.is_error = true
        _this.loading = false
        _this.$emit('back_btn', false)
      })
    },

    uploadSuccessFile (response, file, fileList, item) {
      console.log(fileList);
      console.log(response)
      console.log(file)
      return false;
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`;
      // this.uploadPicUrl = uploadQi(this.uploadToken, this.uploadToken, this.qiniuaddr, response.key)

      let $this = this
      let payload = {
        key: response.key
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['qiniudown'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.uploadPicUrl = data.data
        this.otherlist = fileList
        console.log(this.fileList)
        console.log(response.data)
        this.fileList.push({ name: response.key.split('__' + this.$store.state.corpid)[0] + '.' + response.key.split('.').pop(), key: response.key, hash: response.hash, url: data.data })
        item.value = this.fileList
        console.log(item)
        this.$emit('updata:item', item)
      }).catch(err => {
        console.log(err)
      })
      console.log(this.fileList)

      console.log(this.uploadPicUrl);
      //在这里你就可以获取到上传到七牛的外链URL了
    },
    uploadSuccessFile1 (response, file, fileList, item) {
      let _this = this
      // let inputDOM = this.$refs.inputfile
      // let val = this.isFileType(inputDOM.files)
      // if (val == false) {
      //   return false
      // }
      // let filsepath = inputDOM.files[0];
      let payload = {
        userid: _this.$store.state.userid,
        // corpid: this.$store.state.corpid
        file: file
      }
      let createvalue = _this.$createObj(payload);
      // var keyvalue = createvalue['keyvalue'];
      let posturl = _this.$apilist['uploadfiles'];
      this.loading = true
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        _this.loading = false
        let dd = data
        setTimeout(function () {
          _this.excellist = dd
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

    uploadErrorFile (err, file, fileList) {
      console.log(err)
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    handleRemoveFile (file, fileList, item) {
      console.log(fileList)
      this.fileList = fileList
      item.value = fileList
      this.$emit('updata:item', item)
      console.log(file)
    },
    beforeRemoveFile (file, fileList, item) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      console.log(this.fileList)
      // this.otherlist = fileList
      // if (fileList.length > 0) {
      //   item.value = this.getval(fileList)
      //   this.$emit('update:item', item)
      // }
    },

  },
  created () {
    this.nowTime = getDate();
    console.log(this.nowTime)
    var token;
    var policy = {};
    var bucketName = 'deepgrid';//你的七牛桶名称
    var AK = this.uploadToken; //你的七牛AK
    var SK = this.uploadKey;//你的七牛SK
    var deadline = Math.round(new Date().getTime() / 1000) + 3600;
    policy.scope = bucketName;
    policy.deadline = deadline;
    token = genUpToken(AK, SK, policy);
    this.QiniuData.token = token;
  }
}
</script>