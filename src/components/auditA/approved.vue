<template>
  <div class="audit_index">
    <div class="text_right top_form">
      <!-- <el-button
        type="primary"
        size="small"
        class="top_add"
        icon="el-icon-check"
        @click="addListClick()"
        >批量通过</el-button
      > -->
      <el-button
        size="small"
        class="top_add"
        icon="el-icon-refresh-left"
        @click="delListClick()"
        >批量退回</el-button
      >
    </div>
    <div>
      <div class="margin_b_10">
        <el-input
          style="width: 200px"
          placeholder="提交人/表单名/任务名"
          v-model="filters[0].value"
          size="small"
        ></el-input>
      </div>
      <data-tables
        v-loading="loading"
        :filters="filters"
        :data="tasklist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        ref="table"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="props">
            <div v-for="(item, index) in props.row.FormFieldInfos" :key="item">
              <p class="flow-subtitle" v-if="index < 3">
                <span
                  v-if="
                    item.opt_label != '' &&
                    item.opt_label != 'image' &&
                    item.opt_label != 'file'
                  "
                >
                  {{ item.field_label }}:{{ item.opt_label.split("__")[1] }}
                </span>
                <span
                  v-else-if="
                    item.opt_label == 'image' || item.opt_label == 'file'
                  "
                >
                  <!-- {{ item.vaule }} -->
                  {{ item.field_label }}:
                  <span v-if="item.value.length > 1"
                    >{{ item.value[0].name }}...</span
                  >
                  <span v-else-if="item.value.length == 1">{{
                    item.value[0].name
                  }}</span>
                  <span v-else>-</span>
                </span>
                <span v-else> {{ item.field_label }}:{{ item.value }} </span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="任务名">
          <template slot-scope="props">
            {{ props.row.TaskName }}
          </template>
        </el-table-column>

        <el-table-column label="表单名" prop="FormName"> </el-table-column>
        <el-table-column label="提交人" prop="CreateUserName">
        </el-table-column>
        <el-table-column label="发起时间">
          <template slot-scope="props">
            <div class="flow-permisson-row">
              <span class="flow-subtitle">
                {{
                  new Date(props.row.CreateTime)
                    .toISOString()
                    .replace(/T/g, " ")
                    .replace(/\.[\d]{3}Z/, "")
                    .split(" ")[0]
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="props">
            <div class="flow-permisson-row">
              <span>
                <span class="flow_per" v-if="props.row.State == 0">未提交</span>
                <span class="flow_per warning" v-else-if="props.row.State == 1"
                  >已提交

                  <!-- {{ auditFirst(props.row.AuditStates) }} -->
                </span>
                <span class="flow_per danger" v-else-if="props.row.State == 2"
                  >驳回</span
                >
                <span class="flow_per success" v-else-if="props.row.State == 3"
                  >已通过</span
                >
                <span class="flow_per warning" v-else-if="props.row.State == 4">
                  <span
                    v-for="(item, index) in props.row.AuditStates"
                    :key="item"
                  >
                    <span>{{ item.user_info[0].name }}</span>
                    <span v-if="index < props.row.AuditStates.length - 1"
                      >/</span
                    >
                  </span>
                  审核中</span
                >
                <span class="flow_per success" v-else-if="props.row.State == 5"
                  >已通过</span
                ><span class="flow_per success" v-else-if="props.row.State == 6"
                  >导入数据</span
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <div class="form_operate">
              <el-link
                :underline="false"
                type="primary"
                @click="detailClick(props.row, 2)"
              >
                <span>详情</span>
              </el-link>
              <!-- <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="addClick(props.row.Code)"
              >
                <span>通过</span>
              </el-link>

              <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="delClick(props.row.Code)"
              >
                <span>退回</span>
              </el-link> -->

              <!-- <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="delClick(props.row.Code)"
                v-if="props.row.State == 0 || props.row.State == 2"
                >删除</el-link
              > -->
            </div>
          </template>
        </el-table-column>
      </data-tables>
    </div>
    <DetailAlert
      :is_add="is_detail"
      :detail="detail"
      :is_flag="is_flag"
      @back="detailBack"
      @otherback="otherDetailBack"
    ></DetailAlert>
  </div>
</template>
<script>
import DetailAlert from './components/detailAlert'
export default {
  name: 'audit_index',
  components: { DetailAlert },
  data () {
    return {
      filters: [{
        prop: ['CreateUserName', 'FormName', 'TaskName'],
        value: ''
      }],
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      tasklist: [],
      is_flag: 2,
      is_detail: false,
      detail: {},
      selectedRow_review: [],
    }
  },
  methods: {
    handleSelectionChange (val) {
      console.log(val)
      this.selectedRow_review = val
      // this.$emit("editorShow", this.selectedRow)
    },
    addListClick () {
      if (this.selectedRow_review.length == 0) {
        this.$alert('请选择通过内容！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let codelist = []
      for (let i in this.selectedRow_review) {
        codelist.push(this.selectedRow_review[i].Code)
      }
      console.log()
      payload['main_codes'] = JSON.stringify(codelist)
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['approvemaindatas'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.$message({
          type: 'success',
          message: '批量通过成功!'
        });
        this.alltoauditelist()

      }).catch(err => {
        console.log(err)
      })
    },
    delListClick () {
      if (this.selectedRow_review.length == 0) {
        this.$alert('请选择退回内容！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      this.$prompt('退回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',

      }).then(({ value }) => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid
        }
        let codelist = []
        for (let i in this.selectedRow_review) {
          codelist.push(this.selectedRow_review[i].Code)
        }
        if (value != null && value.trim != '') {
          payload['content'] = value
        }
        payload['main_codes'] = JSON.stringify(codelist)

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['denymaindatas'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          this.$message({
            type: 'success',
            message: '批量退回成功!'
          });
          this.alltoauditelist()
          this.allhaveauditedlist()

        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退回！'
        });
      });

    },

    detailClick (item, num) {
      this.is_flag = num
      this.is_detail = !this.is_detail
      this.detail = item
    },
    detailBack (val) {
      this.is_detail = val
    },
    otherDetailBack () {
      this.alltoauditelist()
      this.allhaveauditedlist()
    },
    alltoauditelist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allhaveauditedlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tasklist = data.data
        // this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
        console.log(Object.keys(data.data))

      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.alltoauditelist()
  }
}
</script>
<style lang="less">
.audit_index {
}
</style>