<template>
  <div class="assign_detail">
    <el-dialog
      title="分配"
      :visible.sync="my_is_add"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="is_show">
        <el-form @submit.native.prevent>
          <el-form-item label="分配人员">
            <div class="el-input__inner" @click="departClick()">
              <span v-if="select_depart.length == 0"> 点击选择 </span>
              <span v-else>
                <GetTreeNameM :openid="select_depart[0].id"></GetTreeNameM>/{{
                  select_depart[0].id
                }}
              </span>
            </div>
          </el-form-item>
          <el-form-item
            :label="item.field_label"
            v-for="item in leftlist"
            :key="item"
          >
            <p class="right_title">
              （原始值：{{ item.orgin }}，<span style="color: #f56c6c"
                >剩余值：{{ item.left }}</span
              >，<span style="color: #67c23a">已分配值：{{ item.used }}</span
              >）
            </p>
            <el-input v-model="item.value" type="number"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <div v-if="assignlist.length == 0" class="text_center">
          <img src="@/assets/img/none.png" />
          <p>暂无分配数据</p>
        </div>
        <data-tables
          v-loading="loading"
          :data="assignlist"
          :pagination-props="{ pageSizes: [5, 10, 15] }"
          ref="table"
          :row-key="row_key"
          :expand-row-keys="expandRowKeys"
          :table-props="tableProps"
          v-if="assignlist.length > 0"
        >
          <!-- <el-table-column
            v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"
          >
          </el-table-column> -->

          <!-- <div> -->
          <el-table-column label="用户名/工号">
            <template slot-scope="props">
              props.row.ToUserId /{{ props.row.ToUserId }}
            </template>
          </el-table-column>
          <!-- </div> -->
          <!-- <div v-for="(item, index) in assignlist[0].ToValues" :key="item"> -->
          <el-table-column
            :label="item.field_label"
            v-for="(item, index) in assignlist[0].ToValues"
            :key="item"
          >
            <template slot-scope="props">
              {{ props.row.ToValues[index].value }}
            </template>
          </el-table-column>
          <!-- </div> -->
          <!-- <div> -->
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-link
                :underline="false"
                type="primary"
                @click="editorClick(props.row)"
              >
                <span>编辑</span>
              </el-link>
              <el-link
                :underline="false"
                type="primary"
                class="margin_l_5"
                @click="delClick(props.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
          <!-- </div> -->
        </data-tables>
      </div>

      <span slot="footer" class="dialog-footer" v-if="is_show">
        <el-button @click="is_show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="assignSubClick()" size="small"
          >确 定</el-button
        >
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="assignClick()" size="small"
          >分配</el-button
        >
      </span>
    </el-dialog>
    <DepartAlertMS
      :is_add="is_depart"
      :departlist="select_depart"
      @back="departBackM"
      @departSub="departSubM"
    ></DepartAlertMS>
  </div>
</template>
<script>
import DepartAlertMS from '../../public/departAlertMS'
export default {
  name: 'assign_detail',
  components: { DepartAlertMS },
  props: {
    is_add: Boolean,
    detail: Object,
    task_code: String
  },
  data () {
    return {
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      my_is_add: false,
      leftlist: [],
      assignlist: [],
      is_show: false,
      is_depart: false,
      select_depart: [],
      departlist_m: [],
      departlist_select: [],
      is_editor: false,
      editor_detail_as_id: '',
      num: 0,
      titles: [
        {
          prop: "name",
          label: "名字"
        }, {
          prop: "orgin",
          label: "原始值"
        }, {
          prop: "used",
          label: "已分配值"
        }, {
          prop: "left",
          label: "剩余值"
        },
      ]
    }
  },
  methods: {
    assignClick () {
      this.select_depart = []
      for (let i in this.leftlist) {
        this.leftlist[i].value = ''
      }
      this.is_editor = false
      this.is_show = true
    },
    delClick (item) {
      this.$confirm('删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          data_code: this.detail.Code,
          as_id: item.Id
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['deloneassigndata'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then(() => {
          this.allassigndata()
          this.leftvalue()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        }).catch(err => {
          console.log(err)
        })
      })
    },
    editorClick (item) {
      this.is_editor = true
      this.is_show = true
      console.log(item)
      this.departlist_m = [{ id: item.ToUserId, depart_id: item.ToDepartId }]
      this.select_depart = this.departlist_m
      this.editor_detail_as_id = item.Id
      // this.leftlist()
      for (let j in item.ToValues) {
        for (let i in this.leftlist) {
          if (this.leftlist[i].field_code == item.ToValues[j].field_code) {
            this.leftlist[i].value = item.ToValues[i].value
          }
        }
      }
    },
    assignSubClick () {
      let $this = this
      console.log(this.leftlist)
      if (this.select_depart.length == 0) {
        this.$alert('请选择人员！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      for (let i in this.leftlist) {
        if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(this.leftlist[i].value)) {
          this.leftlist[i].value = parseFloat(this.leftlist[i].value)
        } else {

          this.$alert(this.leftlist[i].field_label + '请填写数字！', '提示', {
            confirmButtonText: '确定',

          });

          return false;
        }
      }
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        to_userid: this.select_depart[0].id,
        to_departid: this.select_depart[0].depart_id,
        to_value: JSON.stringify(this.leftlist),
        data_code: this.detail.Code
      }

      console.log(payload)
      if (this.is_editor) {
        payload['as_id'] = this.editor_detail_as_id
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addoneassigndata'] + '?signature=' + keyvalue;
      if (this.is_editor) {
        posturl = $this.$apilist['editoneassigndata'] + '?signature=' + keyvalue;
      }
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {

        console.log(data)
        this.is_show = false
        this.allassigndata()
        this.leftvalue()

      }).catch(err => {
        console.log(err)
      })
    },
    departClick () {
      this.is_depart = !this.is_depart
    },
    departBackM (val) {
      this.is_depart = val
    },
    departSubM (val) {
      console.log(val)
      this.select_depart = val.list

    },
    leftvalue () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        data_code: this.detail.Code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['leftvalue'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        let leftlist = []
        for (let i in data.data.left) {
          leftlist.push({ value: '', join_gather: data.data.left[i].join_gather, field_code: data.data.left[i].field_code, field_label: data.data.left[i].field_label, left: data.data.left[i].value, orgin: data.data.orgin[i].value, used: data.data.used[i].value })
        }
        this.leftlist = leftlist
        console.log(data)

      }).catch(err => {
        console.log(err)
      })
    },
    allassigndata () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        data_code: this.detail.Code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {

        console.log(data)
        this.assignlist = data.data
        if (this.assignlist.length == 0) {
          this.is_show = true
        } else {
          this.is_show = false
        }


      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    is_add (val) {
      console.log('9999999999')
      this.my_is_add = val
      console.log(this.detail)
      if (val) {
        this.leftvalue()
        this.allassigndata()
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.assign_detail {
  .right_title {
    color: #797979;
  }
  .el-dialog__body {
    height: 400px;
    overflow: auto;
  }
}
</style>