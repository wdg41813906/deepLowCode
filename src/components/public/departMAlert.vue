<template>
  <div class="depart_alert_m">
    <el-dialog
      title="请选择人员"
      :visible.sync="my_is_add"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      @close="close"
      class="depart_alert_m"
      :append-to-body="true"
    >
      <div class="member_container_depart">
        <div class="left member_colLeft_depart">
          <ElementTree
            :getdata="alldepart"
            :departlist="my_select_id_list"
            :exend="exend"
            :is_colse="is_colse"
            @getTreelist="getTreelist"
          ></ElementTree>
        </div>
        <div class="left member_colRight_depart">
          <ul>
            <li
              class="step_right_li"
              v-for="(item, index) in my_selectlist"
              :key="index"
            >
              <span class="">
                {{ item.Department }}
              </span>
              <i class="el-icon-close del_select" @click="delClick(index)"></i>
              <div class="clearfix"></div>
            </li>
          </ul>
          {{ item }}
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
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import ElementTree from './elementTreeM'
// import GetTreeNameM from './getTreeNameM'
export default {
  name: 'depart_alert',
  components: { ElementTree },
  props: {
    is_add: Boolean,
    departlist: Array,
    auditnum: Number,
    alldepart: Array,
  },
  data () {
    return {
      // alldepart: [],
      departlist: [],
      my_is_add: false,
      my_selectlist: [],
      my_select_id_list: [],
      exend: ['1', 1],
      is_colse: false
    }
  },
  methods: {
    departSub () {
      if (this.my_selectlist.length == 0) {
        this.$alert('未选择人员！', '提示', {
          confirmButtonText: '确定',

        });

        return false;
      }
      this.$emit('departSub', { list: this.my_selectlist, auditnum: this.auditnum })
      this.close()
    },
    delClick (index) {
      this.is_colse = !this.is_colse
      console.log(index)
      console.log()
      this.$delete(this.my_selectlist, index)
      this.$delete(this.my_select_id_list, index)
      let otherlist = JSON.stringify(this.my_selectlist)
      this.my_selectlist = []
      let $this = this
      setTimeout(function () {
        $this.my_selectlist = JSON.parse(otherlist)
      }, 100)
    },
    close () {
      this.is_colse = !this.is_colse
      this.my_is_add = false
    },
    getTreelist (val) {
      console.log(val)
      this.my_selectlist = val.label
      this.my_select_id_list = []
      this.exend = ['1', 1]
      for (let i in this.my_selectlist) {
        this.my_select_id_list.push(this.my_selectlist[i].depart_id)
        this.exend.push(this.my_selectlist[i].ParentId)
      }
    },
    getalldepartmenttree () {
      let $this = this
      let corpid = this.$store.state.corpid
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalldepartmentanduser'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        $this.loading = false
        $this.alldepart = data.data
      }).catch(err => {
        console.log(err)
      })
    },
  },
  created () {
    this.getalldepartmenttree()
  },
  watch: {
    is_add (val) {
      this.getalldepartmenttree()
      console.log(this.alldepart)
      // console.log(this.is_add)
      // console.log(val)
      console.log(this.departlist)
      // console.log(this.my_is_add)
      if (val) {
        // if (this.alldepart.length == 0) {
        //   this.getalldepartmenttree()
        // }
        this.is_colse = !this.is_colse
        this.my_is_add = val
        // this.getAgentId()
        // console.log(this.departlist)
        if (this.departlist != undefined) {
          this.my_selectlist = JSON.parse(JSON.stringify(this.departlist))
          this.my_select_id_list = []
          this.exend = ['1', 1]

          for (let i in this.my_selectlist) {
            this.my_select_id_list.push(this.my_selectlist[i].depart_id)
            if (this.my_selectlist[i].ParentId != undefined) {
              this.exend.push(this.my_selectlist[i].ParentId)
            }
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
.depart_alert_m {
  .is-leaf + .el-checkbox {
    display: block !important;
  }

  .el-tree {
    background: transparent;
  }
  .el-tree-node__content > .el-checkbox {
    position: absolute;
    right: 10px;
  }
  .el-tree {
    background: transparent;
  }
  .el-tree-node__content > .el-checkbox {
    position: absolute;
    right: 10px;
  }

  .member_container_depart {
    width: 541px;
    margin: auto;
  }
  .member_colLeft_depart {
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
  .member_colRight_depart {
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