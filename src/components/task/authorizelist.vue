<template>
  <div class="task_list">
    <div class="text_right top_form">
      <el-select v-model="state_val" @change="hangdleSelection()">
        <el-option
          v-for="item in selectlist"
          :key="item"
          :label="item.label"
          :value="item.val"
        ></el-option>
      </el-select>
    </div>
    <div>
      <data-tables
        v-loading="loading"
        :data="tasklist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <el-table-column label="任务名" prop="Title"> </el-table-column>

        <el-table-column label="时间">
          <template slot-scope="props">
            {{
              new Date(
                +new Date(new Date(props.row.StartDate).toJSON()) +
                  8 * 3600 * 1000
              )
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .slice(0, -3)
                .split(" ")[0]
            }}至{{
              new Date(
                +new Date(new Date(props.row.EndDate).toJSON()) +
                  8 * 3600 * 1000
              )
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .slice(0, -3)
                .split(" ")[0]
            }}</template
          >
        </el-table-column>
        <!-- <el-table-column label="学期" prop="Term"> </el-table-column> -->
        <el-table-column label="备注" prop="Remark">
          <template slot-scope="props">
            <span v-if="props.row.Remark == ''">无</span>
            <p class="p_over_2" v-else :title="props.row.Remark">
              {{ props.row.Remark }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="props">
            <div class="flow-permisson-row">
              <span>
                <span class="success flow_per" v-if="props.row.State == 0"
                  >进行中</span
                >
                <span class="flow_per warning" v-if="props.row.State == 1"
                  >未开始</span
                >
                <span class="flow_per danger" v-if="props.row.State == 2"
                  >结束</span
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-link type="primary" @click="goTaskGClick(props.row)"
              >数据</el-link
            >
          </template>
        </el-table-column>
      </data-tables>
    </div>

    <PublicAlert
      :is_add="is_public"
      :detail="public_detail"
      @back="publickBack"
      @sub="publicSub"
    ></PublicAlert>
  </div>
</template>
<script>
import NewTaskAlert from './components/newTaskAlert'
import EditorTaskAlert from './components/editorTaskAlert'
import PublicAlert from './components/publicAlert'
import { beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'task_list',
  components: { NewTaskAlert, EditorTaskAlert, PublicAlert },
  data () {
    return {
      selectlist: [{ label: '未开始', val: 1 }, { label: '进行中', val: 0 }, { label: '已结束', val: 2 }],
      ruleForm: { other: '' },
      rules: {
        other: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
      },
      is_flag: false,
      dialogVisible: false,
      tasklist: [],
      is_add: false,
      is_editor: false,
      detail: {},
      del_detail: {},
      is_public: false,
      state_val: 0
    }
  },
  methods: {
    hangdleSelection () {
      // console.log(this.state_val)
      this.alltasklist(this.state_val)
    },
    goTaskGClick (item) {
      console.log(item)
      this.$router.push({ name: 'alldataATask', query: { id: beforeEncrypt(item.Code), name: item.Title } })
    },
    publicClick (item) {
      this.is_public = true
      this.public_detail = item
    },
    publickBack (val) {
      this.is_public = val
    },
    publicSub () {
      this.alltasklist()
    },
    switchClick (items) {
      let $this = this
      let payload = {
        task_code: items.Code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      if (items.State == 0) {
        payload['state'] = 2
      } else {
        payload['state'] = 0
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['switchtaskstate'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.alltasklist()

      }).catch(err => {
        console.log(err)
      })
    },



    alltasklist (val) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        state: val
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allauthorizetask'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.alltasklist(this.state_val)
  }
}
</script>