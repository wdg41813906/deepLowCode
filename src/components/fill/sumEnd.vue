<template>
  <div class="gatherlist">
    <div class="top_form">
      <span class="name_span">{{ title }}</span>
      <span class="right">
        <router-link
          :to="{
            name: 'endlistFill',
            query: {
              id: this.$route.query.id,
              name: this.$route.query.name,
              k: Date.now(),
            },
          }"
          class="margin_l_15"
        >
          <el-button
            size="small"
            icon="iconfont icon-cancel"
            class="margin_l_15 width_90"
            @click="close()"
            >返回</el-button
          >
        </router-link>
      </span>
    </div>
    <div class="content sun_content">
      <div class="content_title">
        <p class="before display_inline_block"></p>
        <p class="before_font display_inline_block">汇总</p>
      </div>
      <div class="sum_table">
        <el-table
          v-loading="loading"
          :filters="filters"
          :data="gather_list"
          :pagination-props="{ pageSizes: [10, 15, 30] }"
          ref="refTable"
          @selection-change="handleSelectionChange"
          @row-click="clickTable"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column
            v-for="item in titles_one"
            :key="item"
            :label="item.label"
            :prop="item.prop"
          >
          </el-table-column>

          <!-- <el-table-column label="操作">
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
        </el-table-column> -->
        </el-table>
      </div>
    </div>

    <div class="margin_top_30 content sun_content">
      <div class="content_title">
        <p class="before display_inline_block"></p>
        <p class="before_font display_inline_block">分配（他人分配给自己的）</p>
      </div>
      <div class="sum_table">
        <data-tables
          v-loading="loading"
          :filters="filters"
          :data="assignlist"
          :pagination-props="{ pageSizes: [10, 15, 30] }"
          ref="refTable"
          @selection-change="handleSelectionChange"
          @row-click="clickTable"
          :table-props="tableProps"
        >
          <el-table-column label="表单名">
            <template slot-scope="prop">
              <div>
                {{ prop.row.FormName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配字段">
            <template slot-scope="prop">
              {{ prop.row.FieldName }}
              <!-- <GetTreeNameM
              :openid="prop.row.userid"
              :is_depart="false"
            ></GetTreeNameM> -->
            </template>
          </el-table-column>
          <el-table-column label="分配人">
            <template slot-scope="prop">
              <div>
                {{ prop.row.FormUserName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配值">
            <template slot-scope="prop">
              <span v-if="prop.row.ToValue != undefined">
                {{ prop.row.ToValue }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="props">
              <div class="flow-permisson-row">
                <span>
                  <span class="flow_per" v-if="props.row.State == 0"
                    >未提交</span
                  >
                  <span class="flow_per" v-else-if="props.row.State == 6"
                    >导入数据</span
                  >
                  <span
                    class="flow_per warning"
                    v-else-if="props.row.State == 1"
                    >已提交</span
                  >
                  <span class="flow_per danger" v-else-if="props.row.State == 2"
                    >驳回</span
                  >
                  <span
                    class="flow_per success"
                    v-else-if="props.row.State == 3"
                    >已通过</span
                  >
                  <span
                    class="flow_per warning"
                    v-else-if="props.row.State == 4"
                    >审核中</span
                  >
                  <span
                    class="flow_per success"
                    v-else-if="props.row.State == 5"
                    >已通过</span
                  >
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-link
                :underline="false"
                type="primary"
                @click="detailClick(props.row)"
                >详情</el-link
              >
            </template>
          </el-table-column>
        </data-tables>
      </div>
    </div>
    <DetailAlertAssign
      :is_add="is_detail"
      :detail="detail"
      :form_data="formdetail"
      @back="detailBack"
    ></DetailAlertAssign>
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import DetailAlertAssign from './components/detailAlertAssign'
export default {
  name: 'gatherlist',
  components: { DetailAlertAssign },
  data () {
    return {
      gather_list: [],
      rule_list: [],
      rule_list_key: [],
      title: '',
      code: '',
      assignlist: [],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      titles_one: [{ prop: "userid", label: '工号' }, { prop: 'user_name', label: '姓名' }, { prop: 'depart', label: '学院' }, { prop: '理论课', label: '理论课' }, { prop: '实验课', label: '实验课' }, { prop: '上机课', label: '上机课' }, { prop: '实践课', label: '实践课' }, { prop: '课程设计', label: '课程设计' }, { prop: '毕业设计', label: '毕业设计' },
      { prop: '实习', label: '实习' }, { prop: '大创', label: '大创' }, { prop: '其他', label: '其他' }, { prop: '合计', label: '合计' }, { prop: '金石滩计划学时', label: '金石滩计划学时' }],
      titles_two: ["全日制本科", "非全日制本科", "继续教育、职业教育、专科",
        "学术型研究生", "全日制专业型硕士", "非全日制专业型硕士", "MBA专业硕士", "本科生毕业论文", "硕士生毕业论文",
        "博士生毕业论文", "硕士生日常指导", "博士生日常指导", "辅修、双学位", "本科生双创项目", "补贴工作量", "授课工作量补贴",
        "非授课工作量补贴", "补贴备注", "非授课工作量", "授课工作量", "其他"],
      titles_three: [{ prop: "teacher_id", label: '工号' }, { prop: 'teacher_name', label: '姓名' }, { prop: 'teacher_department', label: '单位' }, { prop: 'career', label: '专业技术职务' }, { prop: 'reward_value', label: "酬金标准（元/学时）" }, { prop: 'teach_quato', label: "定额（学时）" }, { prop: "A", label: "超工作量（学时）" }, { prop: 'overloadworkload', label: "超工作量酬金（元）" }],

      is_detail: false,
      detail: {},
      formdetail: {},
      overload_list: [],
    }
  },
  methods: {
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
      this.title = afterEncrypt(this.$route.query.name)
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

      }).catch(err => {
        console.log(err)
      })

    },

    othertoselfassigndata () {
      let code = this.$route.query.id
      this.code = afterEncrypt(code)
      this.title = afterEncrypt(this.$route.query.name)
      this.taskid = code
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['othertoselfassigndata'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)

      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        // this.gather_list = data.data.gather
        // this.rule_list = data.data.form
        // this.rule_list_key = Object.keys(data.data.form)
        // console.log(this.gather_list)
        // console.log(this.rule_list)
        this.assignlist = data.data

      }).catch(err => {
        console.log(err)
      })

    },
    exportExcel () {


      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['export'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      this.gather_list = []
      this.rule_list = []
      this.rule_list_key = []
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        window.location.href = (data.data.path);


      }).catch(err => {
        console.log(err)
      })

    },
  },
  mounted () {
    this.getgather()
    this.othertoselfassigndata()
    this.overloadworkload()
  }
}
</script>
<style lang="less">
.name_span {
  font-size: @font_16;
  font-weight: bold;
}
</style>