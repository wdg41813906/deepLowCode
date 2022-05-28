<template>
  <div class="gatherlist">
    <div class="top_form">
      <span class="name_span">汇总</span>
    </div>
    <el-row>
      <el-col> </el-col>
    </el-row>
    <el-form :inline="true">
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
            placeholder="工号/姓名/学院"
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
            :table-props="tableProps"
          >
            <el-table-column
              v-for="item in titles_one"
              :key="item"
              :label="item.label"
              :prop="item.prop"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="prop">
                <div>
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="gourlClick(prop.row)"
                    >详情</el-link
                  >
                </div>
              </template>
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
      departid: '',
      departlist: [],
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
      titles_one: [{ prop: "userid", label: '工号' }, { prop: 'user_name', label: '姓名' }, { prop: 'depart', label: '学院' }, { prop: '理论课', label: '理论课' }, { prop: '实验课', label: '实验课' }, { prop: '上机课', label: '上机课' }, { prop: '实践课', label: '实践课' }, { prop: '课程设计', label: '课程设计' }, { prop: '毕业设计', label: '毕业设计' },
      { prop: '实习', label: '实习' }, { prop: '大创', label: '大创' }, { prop: '其他', label: '其他' }, { prop: '合计', label: '合计' }, { prop: '金石滩计划学时', label: '金石滩计划学时' }],
      titles_two: ["全日制本科", "非全日制本科", "继续教育、职业教育、专科",
        "学术型研究生", "全日制专业型硕士", "非全日制专业型硕士", "MBA专业硕士", "本科生毕业论文", "硕士生毕业论文",
        "博士生毕业论文", "硕士生日常指导", "博士生日常指导", "辅修、双学位", "本科生双创项目", "补贴工作量", "授课工作量补贴",
        "非授课工作量补贴", "补贴备注", "非授课工作量", "授课工作量", "其他"],

      gather_list: '',
    }
  },
  methods: {
    gourlClick (row) {
      this.$router.push({ name: 'filllistAudit', query: { num: beforeEncrypt('2'), userid: beforeEncrypt(row.userid), id: beforeEncrypt(this.task_code) } })
    },
    search (num) {
      let $this = this

      if (this.task_code == '') {
        this.$alert('请选择任务！', '提示', {
          confirmButtonText: '确定',

        })
        return false
      }


      let payload = {
        task_code: this.task_code,
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['alluserdatagatherbytask'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // console.log(JSON.stringify(data))
        this.loading = false
        this.gather_list = data.data
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
        this.task_code = data.data[0].Code
        this.search(2)
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

        this.gather_list = data.data
        // this.rule_list = data.data.form
        // this.rule_list_key = Object.keys(data.data.form)
        console.log(this.gather_list)
        console.log(this.rule_list)

      }).catch(err => {
        console.log(err)
      })

    },
    level2departmap () {

      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['level2departmap'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.departlist = data.data

      }).catch(err => {
        console.log(err)
      })

    },

    exportExcel () {
      let $this = this
      if (this.task_code == '') {
        this.$alert('请选择任务！', '提示', {
          confirmButtonText: '确定',

        })
        return false
      }

      let payload = {
        task_code: this.task_code,
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['exportallgatherexcel'] + '?signature=' + keyvalue;
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
    console.log(this.$store.state.user)
    // this.getterm()
    this.alltasklist()
    this.level2departmap()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;
  font-weight: bold;
}
</style>