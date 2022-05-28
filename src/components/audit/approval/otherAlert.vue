<template>
  <div class="depart_alert">
    <el-dialog
      title="条件分支"
      :visible.sync="my_is_add"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      @close="close"
      class="depart_alert"
      :append-to-body="true"
    >
      <div class="member_container">
        <div>
          <el-form @submit.native.prevent>
            <el-form-item label="分支条件">
              <el-input v-model.trim="inputval"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="clearfix"></div>
        <div class="footer">
          <el-button size="small" @click="close()">取消</el-button>
          <el-button type="primary" size="small" @click="departSub()"
            >确定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'depart_alert',
  components: {},
  props: {
    is_add: Boolean,
    title_condition: String,
  },
  data () {
    return {
      alldepart: [],
      // departlist: [],
      my_is_add: false,
      my_selectlist: [],
      my_select_id_list: [],
      is_colse: false,
      inputval: '',
    }
  },
  methods: {
    departSub () {
      if (this.inputval == '') {
        this.$alert('请填写分支条件！', '提示', {
          confirmButtonText: '确定',

        });

        return false;
      }
      console.log(this.my_selectlist)
      this.$emit('departSub', this.inputval)
      this.close()
    },
    delClick (index) {
      this.is_colse = !this.is_colse
      this.$delete(this.my_selectlist, index)
      this.$delete(this.my_select_id_list, index)
    },
    close () {
      this.is_colse = true
      this.my_is_add = false
    },
    getTreelist (val) {
      this.my_selectlist = val.depart
      // this.departlist = val.depart
      console.log(this.my_selectlist)
      this.my_select_id_list = []
      for (let i in this.my_selectlist) {
        this.my_select_id_list.push(this.my_selectlist[i].id)
      }


    },
    getalldepartmenttree () {
      let corpid = this.$store.state.corpid
      let _this = this
      let $this = this
      this.loading = true
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalluserinfotree'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        // console.log(data)
        _this.loading = false
        _this.alldepart = data.data
      }).catch(err => {
        console.log(err)
      })


    },

  },
  mounted () {
    this.getalldepartmenttree()
  },
  watch: {
    is_add (val) {
      // console.log(this.is_add)
      // console.log(val)

      // console.log(this.my_is_add)
      if (val) {
        this.is_colse = false
        this.my_is_add = val
        console.log(this.title_condition)
        this.inputval = this.title_condition
        // this.getAgentId()
        console.log(this.departlist)
        if (this.departlist != undefined) {
          this.my_selectlist = JSON.parse(JSON.stringify(this.departlist))
          this.my_select_id_list = []
          for (let i in this.my_selectlist) {
            this.my_select_id_list.push(this.my_selectlist[i].id)
          }
        }
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.depart_alert {
  .member_container {
    width: 541px;
    margin: auto;
  }
  .member_colLeft {
    display: table-cell;
    vertical-align: top;
    // background-color: #f9fafc;
    border-right: 1px dotted #dce1e6;
    width: 260px;
    height: 432px;
    border: @border;
    border-radius: 5px;
    background: rgba(244, 246, 248, 0.2);

    overflow: auto;
  }
  .member_colRight {
    display: table-cell;
    width: 260px;
    height: 434px !important;
    padding: 16px 16px 24px;
    vertical-align: top;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: @border;
    margin-left: 10px;
    border-radius: 5px;
    background: rgba(244, 246, 248, 0.2);
    overflow: auto;
  }
  .step_right_li {
    line-height: 25px;
    display: flex;
    align-items: center;
    justify-items: center;
    span {
      width: 250px;
    }
  }
  .del_select {
    cursor: pointer;
    font-weight: bold;
  }
  .del_select:hover {
    color: @color;
  }
  .el-dialog.depart_aldert_dialog {
    .el-dialog__body {
      height: 520px;
      padding: 0px 20px;
      overflow: auto;
    }
    .el-tree {
      background: transparent;
    }
    .el-tree-node__content {
      position: relative;
    }
    .el-tree-node__content > .el-checkbox {
      position: absolute;
      right: 10px;
      top: 3px;
    }
  }
  .footer {
    text-align: right;
    margin-top: 20px;
  }
}
</style>