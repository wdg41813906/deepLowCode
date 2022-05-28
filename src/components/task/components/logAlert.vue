<template>
  <div class="log_detail">
    <el-dialog
      title="日志"
      :visible.sync="my_is_add"
      width="600px"
      :close-on-click-modal="false"
    >
      <data-tables
        v-loading="loading"
        :data="loglist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        ref="table"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        :table-props="tableProps"
      >
        <el-table-column label="操作人">
          <template slot-scope="props">
            <!-- <GetTreeNameM :openid="props.row.UserId"></GetTreeNameM> -->
            {{ props.row.UserName }}
            /{{ props.row.UserId }}
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="props">
            {{
              new Date(
                +new Date(new Date(props.row.CreateTime).toJSON()) +
                  8 * 3600 * 1000
              )
                .toISOString()
                .replace(/T/g, " ")
                .replace(/\.[\d]{3}Z/, "")
                .slice(0, -3)
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <p v-if="props.row.TypeId == 7" class="danger_span">
              #{{ props.row.TypeDesc }}#
            </p>
            <p v-else class="success_span">#{{ props.row.TypeDesc }}#</p>
            <p>{{ props.row.Remark }}</p>
          </template>
        </el-table-column>
      </data-tables>
    </el-dialog>
  </div>
</template>
<script>
// import GetTreeNameM from '../../publicLibrary/getTreeNameM.vue'
export default {
  name: 'log_detail',
  props: {
    is_add: Boolean,
    code: String
  },
  components: {},
  data () {
    return {
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      my_is_add: false,
      loglist: [],
      loading: false
    }
  },
  methods: {
    getallloginfobydatacode () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        data_code: this.code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallloginfobydatacode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {

        console.log(data)
        this.loglist = data.data

        // else {
        //   // this.num=this.assignlist[0].ToValues
        //   // for(let i in this.assignlist[0].ToValues){
        //   //   this.num.push({})
        //   // }
        // }
        // for (let i in this.assignlist) {

        // }

      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
      if (val) {
        this.getallloginfobydatacode()
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.log_detail {
  .el-dialog__body {
    height: 400px;
    overflow: auto;
  }
  .success_span {
    color: #67c23a;
  }
  .danger_span {
    color: #f56c6c;
  }
}
</style>