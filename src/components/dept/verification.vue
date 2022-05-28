<template>
  <div class="gatherlist">
    <div class="top_form">
      <span class="name_span">核岗工作量</span>
    </div>
    <el-row>
      <el-col> </el-col>
    </el-row>
    <el-form :inline="true">
      <el-form-item label="学期">
        <el-select v-model="terms" multiple size="small">
          <el-option
            v-for="item in termlist"
            :key="item"
            :label="item.Term"
            :value="item.Term"
          ></el-option>
        </el-select>
        <!-- <el-button size="small" class="margin_l_5" @click="search(1)"
          >搜索</el-button
        > -->
      </el-form-item>
      <el-form-item label="任务" style="margin_l_10">
        <el-select v-model="task_code" size="small">
          <el-option
            v-for="item in tasklist"
            :key="item"
            :label="item.Title"
            :value="item.Code"
          ></el-option>
        </el-select>
        <el-button size="small" class="margin_l_5" @click="search(2)"
          >搜索</el-button
        >
        <el-button
          size="small"
          class="margin_l_5"
          type="primary"
          @click="exportExcel()"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <el-card>
      <div class="content sun_content">
        <div class="margin_b_10">
          <el-input
            style="width: 200px"
            placeholder="工号/姓名/单位/填报状态"
            v-model="filters[0].value"
            size="small"
          ></el-input>
        </div>
        <div class="sum_table">
          <data-tables
            v-loading="loading"
            :filters="filters"
            :data="gather_list"
            :pagination-props="{ pageSizes: [10, 15, 30] }"
            ref="refTable"
            @selection-change="handleSelectionChange"
            @row-click="clickTable"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column
              v-for="item in titles_one"
              :key="item"
              :label="item.label"
              :prop="item.prop"
            >
            </el-table-column>
            <el-table-column
              v-for="item in titles_two"
              :key="item"
              :label="item"
              :prop="item"
            >
            </el-table-column>
          </data-tables>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
// import DetailAlertAssign from './components/detailAlertAssign'
export default {
  name: 'gatherlist',
  // components: { DetailAlertAssign },
  data () {
    return {
      loading: false,
      terms: '',
      task_code: '',
      gather_list: [],
      filterText: '',
      filters: [{
        prop: ['userid', 'user_name', 'depart', 'career', 'position', 'user_state'],
        value: ''
      }],
      rule_list: [],
      rule_list_key: [],
      title: '',
      code: '',
      assignlist: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      is_detail: false,
      detail: {},
      formdetail: {},
      termlist: [],
      tasklist: [],
      titles_one: [{ prop: "userid", label: '工号' }, { prop: 'user_name', label: '姓名' }, { prop: 'depart', label: '单位' }, { prop: 'career', label: '专业技术职务' }, { prop: 'position', label: '行政级别' }, { prop: 'user_state', label: '填报状态' }],
      titles_two: ["核岗百分比", "授课工作量百分比", "本科工作量百分比",
        "教学工作量百分比"],
    }
  },
  methods: {
    search (num) {
      let $this = this
      let payload = {

      }
      if (this.terms == '' && this.task_code == '') {
        this.$alert('请选择学期或者任务！', '提示', {
          confirmButtonText: '确定',

        })
        return false
      }

      if (this.terms != '') {
        payload['terms'] = JSON.stringify(this.terms)
        this.task_code = ''
      }


      else if (this.task_code != '') {
        payload['task_code'] = this.task_code
        this.terms = ''
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['hegangworkload'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        if (data.data == null) {
          this.gather_list = []
        } else {
          this.gather_list = data.data
        }

      }).catch(err => {
        console.log(err)
      })
    },
    getterm () {
      let payload = {
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid,

      }

      let _this = this

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['term'] + '?signature=' + keyvalue;

      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.termlist = data.data.reverse()
      })
    },
    alltasklist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alltasklist'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    detailClick (item) {
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
    },
    getgather () {
      let code = this.$route.query.id
      this.code = afterEncrypt(code)
      this.title = this.$route.query.name
      this.taskid = code
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['datagather'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.gather_list = data.data.gather
        this.rule_list = data.data.form
        this.rule_list_key = Object.keys(data.data.form)
        console.log(this.gather_list)
        console.log(this.rule_list)

      }).catch(err => {
        console.log(err)
      })

    },

    exportExcel () {


      let $this = this
      let payload = {

      }
      if (this.terms == '' && this.task_code == '') {
        this.$alert('请选择学期或者任务！', '提示', {
          confirmButtonText: '确定',

        })
        return false
      }

      if (this.terms != '') {
        payload['terms'] = JSON.stringify(this.terms)
        this.task_code = ''
      }


      else if (this.task_code != '') {
        payload['task_code'] = this.task_code
        this.terms = ''
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['exporthegang'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)

      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        window.location.href = this.$store.state.imgurl + '/' + (data.data.path);


      }).catch(err => {
        console.log(err)
      })

    },
  },
  mounted () {
    // this.getgather()
    this.getterm()
    this.alltasklist()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;
  font-weight: bold;
}
</style>