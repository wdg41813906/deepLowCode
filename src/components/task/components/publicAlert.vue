<template>
  <div class="public_alert" v-if="is_public">
    <el-dialog
      title="公示"
      :visible.sync="is_public"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent label-width="100px">
        <el-form-item label="任务名">
          <label for="">{{ detail.Title }}</label>
        </el-form-item>
        <el-form-item label="公示状态">
          <el-radio v-model="detail.IsPub" :label="true">开始</el-radio>
          <el-radio v-model="detail.IsPub" :label="false">结束</el-radio>
        </el-form-item>
        <!-- 
        <el-form-item label="公示部门" v-if="this.radio == 1">
          <div
            class="departid_div el-input el-input--small"
            @click="departPClick()"
          >
            <span v-for="item in publiclist" :key="item" class="departid_span"
              >{{ item.Department }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="公示时间" v-if="this.radio == 1">
          <el-date-picker
            v-model="date_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公示描述" v-if="this.radio == 1">
          <el-input type="textarea" v-model="remark"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="is_public = false" size="small">结束公示</el-button> -->
        <el-button type="primary" @click="updatepubinfo()" size="small"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <DepartAlertP
      :is_add="is_depart_p"
      :departlist="publiclist"
      :title="'公示部门'"
      @back="departPBack"
      @departSub="departPSub"
    ></DepartAlertP>
  </div>
</template>
<script>
import DepartAlertP from '@/components/public/departAlertA.vue'
export default {
  name: 'public_alert',
  props: {
    is_add: false,
    detail: Object,
  },
  components: { DepartAlertP },
  data () {
    return {
      is_public: false,
      is_depart_p: false,
      publiclist: [],
      radio: 0,
      date_time: [],
      remark: '',
    }
  },
  methods: {
    departPSub (val) {
      console.log(val)
      this.publiclist = val
      for (let i in val) {
        delete this.publiclist[i].Children
        delete this.publiclist[i].ParentId
      }
      // this.publiclist = val
      // console.log(this.firstval)
      // this.ruleForm.departid = val
    },
    departPClick () {
      this.is_depart_p = !this.is_depart_p
      console.log(this.is_depart_a)
    },
    departPBack (val) {
      this.is_depart_p = val
    },
    getpubinfo () {
      let $this = this
      let payload = {

        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.detail.Code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getpubinfo'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        if (data.data.PubScope != null) {
          this.publiclist = data.data.PubScopeInfo
        } else {
          this.publiclist = []
        }
        this.radio = data.data.State
        if (data.data.StartDate == '' || data.data.StartDate == '') {
          this.date_time = []
        } else {
          this.date_time = [data.data.StartDate * 1000, data.data.EndDate * 1000]
        }


      }).catch(err => {
        console.log(err)
      })
    },
    updatepubinfo () {
      let $this = this
      let payload = {

        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.detail.Code,
        state: this.radio
      }
      // if (this.radio == 1 || this.radio == '1') {
      //   console.log(this.publiclist)
      //   if (this.publiclist == null || this.publiclist.length == 0) {
      //     this.$alert('请选择公示部门', '提示', {
      //       confirmButtonText: '确定',

      //     });
      //     return false
      //   }
      //   if (this.date_time.length == 0) {
      //     this.$alert('请选择公示时间', '提示', {
      //       confirmButtonText: '确定',
      //     });
      //     return false
      //   }
      //   payload['pub_scope'] = JSON.stringify(this.publiclist)
      //   payload['end_date'] = this.date_time[1]
      //   payload['start_date'] = this.date_time[0]
      //   payload['remark'] = this.remark
      // }


      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['pubtask'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          message: '操作成功！',
          type: 'success'
        });
        this.is_public = false
        // this.radio = 0
        this.$emit('sub')

      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    is_add (val) {
      console.log(this.detail)
      if (val) {
        // this.getpubinfo()
        console.log(this.detail.IsPub)
        if (this.detail.IsPub == true) {
          this.radio = 1
        } else {
          this.radio = 0
        }
        console.log(this.radio)
        this.is_public = val
      }

    },
    is_public (val) {

      this.$emit('back', val)
      this.radio = 0
    }
  }

}
</script>
<style lang="less">
.public_alert {
  .departid_div {
    // margin-left: 100px;
    width: 100%;
    min-height: 42px;
    border: @border;
    border-radius: 5px;
    cursor: pointer;
  }
  .departid_div:hover {
    border: 1px solid #c0c4cc;
  }
  .departid_span:first-of-type {
    margin-left: 5px;
  }
  .departid_span {
    display: inline-block;
    border: @border;
    padding: 4px 15px;
    border-radius: 4px;
    margin-right: 5px;
    line-height: 14px;
    font-size: 12px;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
}
</style>