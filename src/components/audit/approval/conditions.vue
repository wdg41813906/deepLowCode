<template>
  <div class="three_setting">
    <!-- <div class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="toReturn">
          <i class="anticon anticon-left"></i>
        </div>
        <div class="fd-nav-title">{{ workFlowDef.name }}123</div>
      </div>

      <div class="fd-nav-right">
        <button type="button" class="ant-btn button-preview">
          <span>预 览</span>
        </button>
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          <span>发 布</span>
        </button>
      </div>
    </div> -->
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom_div">
          <div class="text_right">
            <el-button size="small" @click="reload()">重置</el-button>
            <el-button type="primary" size="small" @click="submit()"
              >保存</el-button
            >
          </div>
          <div class="zoom">
            <div
              :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')"
              @click="zoomSize(1)"
            ></div>
            <span>{{ nowVal }}%</span>
            <div
              :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')"
              @click="zoomSize(2)"
            ></div>
          </div>
        </div>
        <div
          class="box-scale"
          id="box-scale"
          :style="
            'transform: scale(' +
            nowVal / 100 +
            '); transform-origin: 50% 0px 0px;'
          "
        >
          <nodeWrapM
            :nodeConfig.sync="nodeConfig"
            :flowPermission.sync="flowPermission"
            :isTried.sync="isTried"
            :directorMaxLevel="directorMaxLevel"
            :tableId="tableId"
            :departlist_look.sync="depart_list_all"
            :alldepart="alldepart"
          ></nodeWrapM>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <!-- <el-dialog title="提示" :visible.sync="tipVisible">
      <div class="ant-confirm-body">
        <i class="anticon anticon-close-circle" style="color: #f00;"></i>
        <span class="ant-confirm-title">当前无法发布</span>
        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
            <div class="error-modal-list">
              <div
                class="error-modal-item"
                v-for="(item, index) in tipList"
                :key="index"
              >
                <div class="error-modal-item-label">流程设计</div>
                <div class="error-modal-item-content">
                  {{ item.name }} 未选择{{ item.type }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipVisible = false">我知道了</el-button>
        <el-button type="primary" @click="tipVisible = false"
          >前往修改</el-button
        >
      </span>
    </el-dialog> -->
    <el-dialog
      title="提示"
      :visible.sync="tipVisible"
      width="700px"
      :close-on-click-modal="false"
      class="audit_other_alert"
    >
      <div class="ant-confirm-body">
        <!-- <div class="anticon_top">
          <i class="anticon anticon-close-circle" style="color: #f00"></i>
          <span class="ant-confirm-title">当前无法发布</span>
        </div> -->

        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
            <div class="error-modal-list">
              <div
                class="error-modal-item"
                v-for="(item, index) in tipList"
                :key="index"
              >
                <div class="error-modal-item-label">{{ item.name }}</div>
                <div class="error-modal-item-content">
                  <span v-if="item.type != '添加审核人'">
                    {{ item.name }}下存在未选择的{{ item.type }}
                  </span>
                  <span v-else> {{ item.name }}未{{ item.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="tipVisible = false">我知道了</el-button> -->
        <el-button type="primary" size="small" @click="tipVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'three_setting',
  props: {
    sumval: Object,
    departlist_str: String,
    mycode: String,
    worktype: Number,
    show_click: Number,
  },
  data () {
    return {
      tipVisible: false,
      alldepart: [],
      isTried: true,
      tipList: [],
      nowVal: 100,
      processConfig: {},
      nodeConfig: {},
      // workFlowDef: {},
      flowPermission: [],
      directorMaxLevel: 0,
      dialogVisible: true,
      tableId: "",
      depart_list_all: [],
      depart_list_children: [],
      node: {
        "nodeName": "部门1",
        "type": 3,
        "priorityLevel": 1,

        "conditionList": [
          {
            "columnId": 0,
            "type": 1,
          }
        ],
        "nodeUserList": [],
        "childNode": {
          "nodeName": "路由",
          "type": 4,
          "priorityLevel": 1,

          "conditionList": [],
          "nodeUserList": [],
          "conditionNodes": [
            {
              "nodeName": "标签1(可改)",
              "type": 3,
              "priorityLevel": 1,

              "conditionList": [
                {
                  "columnId": 0,
                  "type": 1,

                }
              ],
              "nodeUserList": [{ targetId: 0, type: 0 }],
              "childNode": {
                "nodeName": "审核人",
                "type": 1,
                "priorityLevel": 1,

                "conditionList": [],
                "nodeUserList": [],
                "childNode": null,
                "conditionNodes": [],
                "error": true
              },
              "conditionNodes": [],
              "error": false
            },
            {
              "nodeName": "标签2(可改)",
              "type": 3,
              "priorityLevel": 2,

              "conditionList": [],
              "nodeUserList": [],
              "childNode": {
                "nodeName": "审核人",
                "type": 1,
                "priorityLevel": 1,

                "conditionList": [],
                "nodeUserList": [],
                "childNode": null,
                "conditionNodes": [],
                "error": true
              },
              "conditionNodes": [],
              "error": false
            }
          ]
        },
        "conditionNodes": [],
        "error": false
      },
    };
  },
  watch: {
    departlist_str (val) {
      console.log(val)
      console.log('bbbbbbbb')
      let nodelist = []
      let departlist = []
      let conditionlist = []
      let num = 0
      if (this.sumval.firstval.departlist != undefined) {
        for (let i in this.sumval.firstval.departlist) {

          nodelist.push({
            type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
            targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
            // is_depart: this.sumval.firstval.departlist[i].IsDepart
            name: this.sumval.firstval.departlist[i].depart_id,
            department: this.sumval.firstval.departlist[i].Department
          })
          departlist.push({
            id: this.sumval.firstval.departlist[i].id,
            IsDepart: this.sumval.firstval.departlist[i].IsDepart,
            type: 3,
            depart_id: this.sumval.firstval.departlist[i].depart_id,
            Department: this.sumval.firstval.departlist[i].Department
          })
          console.log(i)
          if (this.sumval.firstval.departlist[i].IsDepart) {
            num = num + 1
            let node = JSON.parse(JSON.stringify(this.node))
            console.log(num)
            node.nodeName = this.sumval.firstval.departlist[i].Department
            node.nodeUserList = [{
              type: this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
              targetId: this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
              // is_depart: this.sumval.firstval.departlist[i].IsDepart
              name: this.sumval.firstval.departlist[i].depart_id,
              department: this.sumval.firstval.departlist[i].Department
            }]
            conditionlist.push(node)
          }
        }
      }
      this.sumval.threeval.nodeConfig.childNode.conditionNodes = conditionlist
      this.nodeConfig = this.sumval.threeval.nodeConfig;
      this.nodeConfig.nodeUserList = nodelist
      this.sumval.threeval.flowPermission = nodelist
      this.flowPermission = this.sumval.threeval.flowPermission;
      this.$emit('update:sumval', this.sumval)
    },

  },
  mounted () {
    this.getalldepartmenttree()
    this.gettemplateworkflow()
    // if (this.mycode != '123') {
    //   console.log(this.sumval)

    //   if (this.worktype == 3 && this.show_click == 2) {

    //     let nodelist = []
    //     let departlist = []
    //     let conditionlist = []
    //     if (this.sumval.firstval.departlist != undefined) {
    //       for (let i in this.sumval.firstval.departlist) {

    //         nodelist.push({

    //           "targetId": this.sumval.firstval.departlist[i].IsDepart == true ? parseInt(this.sumval.firstval.departlist[i].id) : this.sumval.firstval.departlist[i].id,
    //           "type": this.sumval.firstval.departlist[i].IsDepart == true ? 3 : 1,
    //           name: parseInt(this.sumval.firstval.departlist[i].id),
    //           department: this.sumval.firstval.departlist[i].Department
    //           // is_depart: this.sumval.firstval.departlist[i].IsDepart
    //         })
    //         departlist.push({
    //           id: this.sumval.firstval.departlist[i].id,
    //           IsDepart: this.sumval.firstval.departlist[i].IsDepart,
    //           type: 3,
    //           depart_id: this.sumval.firstval.departlist[i].depart_id,
    //           Department: this.sumval.firstval.departlist[i].Department
    //         })
    //         console.log(JSON.stringify(nodelist))

    //         let string = '"targetId":' + this.sumval.firstval.departlist[i].id
    //         console.log(string)
    //         console.log(this.sumval.threeval.nodeConfig.UserList)
    //         // let nn = this.sumval.threeval.nodeConfig.UserList.indexOf(string)

    //         console.log(JSON.stringify(nodelist))
    //         console.log(this.sumval.threeval.nodeConfig.UserList)
    //         console.log(this.sumval.threeval.nodeConfig.UserList == JSON.stringify(nodelist))
    //       }

    //     }
    //     // this.sumval.threeval.nodeConfig.childNode.conditionNodes = conditionlist
    //     this.nodeConfig = this.sumval.threeval.nodeConfig
    //     this.nodeConfig.nodeUserList = nodelist
    //     this.flowPermission = nodelist

    //   } else {
    //     this.axiosMethod()
    //   }
    // } else {
    //   this.axiosMethod()
    // }

  },
  methods: {
    gettemplateworkflow () {
      let $this = this
      let corpid = this.$store.state.corpid
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        WorkflowCode: 'iyxLbcV3rHAaMmj4s8bbBr0OmXhyhbDm'
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettemplateworkflow'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        if (data.data.childNode == null && data.data.conditionnodes == null) {
          // this.axiosMethod()
          this.getalldepartment()
        } else {
          console.log('----------------------00000')
          data.data['conditionList'] = []
          this.nodeConfig = data.data
          this.processConfig.nodeConfig = data.data
          this.nodeConfig.nodeUserList = data.data.nodeUserList
          this.flowPermission = data.data.nodeUserList
          console.log(this.nodeConfig)



        }

      }).catch(err => {
        console.log(err)
      })
    },
    axiosMethod () {
      let weburl = this.$store.state.weburl
      axios.get(weburl + "/condition.json", {
        workFlowDefId: this.$route.params.workFlowDefId
      }).then(res => {
        console.log(res)
        this.processConfig = res.data.data;
        console.log(this.processConfig)
        let nodelist = []
        let departlist = []
        let conditionlist = []
        console.log(this.depart_list_children)
        if (this.depart_list_children != undefined) {
          for (let i in this.depart_list_children) {

            nodelist.push({
              type: this.depart_list_children[i].IsDepart == true ? 3 : 1,
              targetId: this.depart_list_children[i].IsDepart == true ? parseInt(this.depart_list_children[i].id) : this.depart_list_children[i].id,
              // is_depart: this.sumval.firstval.departlist[i].IsDepart
              name: this.depart_list_children[i].depart_id,
              department: this.depart_list_children[i].Department
            })
            departlist.push({
              id: this.depart_list_children[i].id,
              IsDepart: this.depart_list_children[i].IsDepart,
              type: 3,
              depart_id: this.depart_list_children[i].depart_id,
              Department: this.depart_list_children[i].Department
            })
            console.log(i)
            if (this.depart_list_children[i].IsDepart) {
              let num = parseInt(i) + 1
              let node = JSON.parse(JSON.stringify(this.node))
              console.log(num)
              node.nodeName = this.depart_list_children[i].Department
              node.nodeUserList = [{
                type: this.depart_list_children[i].IsDepart == true ? 3 : 1,
                targetId: this.depart_list_children[i].IsDepart == true ? parseInt(this.depart_list_children[i].id) : this.depart_list_children[i].id,
                // is_depart: this.depart_list_children[i].IsDepart
                name: this.depart_list_children[i].depart_id,
                department: this.depart_list_children[i].Department
              }]
              conditionlist.push(node)
            }
          }
          console.log(this.processConfig.nodeConfig.childNode.conditionNodes)
          this.processConfig.nodeConfig.childNode.conditionNodes = conditionlist
          this.departlist = departlist
          this.nodeConfig = this.processConfig.nodeConfig;
          this.nodeConfig.nodeUserList = [{
            type: this.depart_list_all[0].IsDepart == true ? 3 : 1,
            targetId: this.depart_list_all[0].IsDepart == true ? parseInt(this.depart_list_all[0].id) : this.depart_list_all[0].id,
            // is_depart: this.sumval.firstval.departlist[i].IsDepart
            name: this.depart_list_all[0].depart_id,
            department: this.depart_list_all[0].Department
          }]
          this.processConfig.flowPermission = [{
            type: this.depart_list_all[0].IsDepart == true ? 3 : 1,
            targetId: this.depart_list_all[0].IsDepart == true ? parseInt(this.depart_list_all[0].id) : this.depart_list_all[0].id,
            // is_depart: this.sumval.firstval.departlist[i].IsDepart
            name: this.depart_list_all[0].depart_id,
            department: this.depart_list_all[0].Department
          }]
          this.flowPermission = this.processConfig.flowPermission;
          this.directorMaxLevel = this.processConfig.directorMaxLevel;
          // this.workFlowDef = this.processConfig.workFlowDef
          this.tableId = this.processConfig.tableId
          // this.sumval.threeval = this.processConfig
          // this.$emit('update:sumval', this.sumval)
          console.log(this.processConfig)
        } else {
          console.log('9999999999999999999')
          this.$alert('请先在基础设置中设置填报对象！', '提示', {
            confirmButtonText: '确定',
          });
          // this.sumval.threeval = {}
          // this.$emit('update:sumval', this.sumval)
          return false;

        }

      })
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
        // console.log(data)
        $this.loading = false
        $this.alldepart = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    getalldepartment () {
      let $this = this
      let corpid = this.$store.state.corpid
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.depart_list_all = data.data
        this.depart_list_children = data.data[0].Children
        this.processConfig = data.data
        this.axiosMethod()

      }).catch(err => {
        console.log(err)
      })
    },
    toReturn () {
      //window.location.href = ""
    },
    reErr (data) {
      if (data.childNode) {
        if (data.childNode.type == 1) {//审批人
          if (data.childNode.error) {
            this.tipList.push({ name: data.childNode.nodeName, type: "审核人" })
          }
          this.reErr(data.childNode)
        } else if (data.childNode.type == 2) {
          if (data.childNode.error) {
            this.tipList.push({ name: data.childNode.nodeName, type: "抄送人" })
          }
          this.reErr(data.childNode)
        } else if (data.childNode.type == 3) {
          this.reErr(data.childNode.childNode)
        } else if (data.childNode.type == 4) {
          this.reErr(data.childNode)
          for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
            if (data.childNode.conditionNodes[i].error) {
              this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
            }
            this.reErr(data.childNode.conditionNodes[i])
          }
        }
      } else {
        data.childNode = null
      }
    },
    saveSet () {
      this.isTried = true;
      this.tipList = [];
      this.reErr(this.nodeConfig);
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        return;
      }
      this.processConfig.flowPermission = this.flowPermission
      console.log(JSON.stringify(this.processConfig))
      console.log(this.processConfig)
      // this.$axios.post("", this.processConfig).then(res => {
      //     if (res.code == 200) {
      //         this.$message.success("设置成功");
      //         setTimeout(function () {
      //             window.location.href = ""
      //         }, 200)
      //     }
      // })
    },
    zoomSize (type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return;
        }
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) {
          return;
        }
        this.nowVal += 10;
      }
    },
    reload () {
      this.$confirm(' 是否重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getalldepartment()
        this.$message({
          type: 'info',
          message: '重置成功'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });
    },
    submit () {
      this.tipList = []
      console.log(this.processConfig)


      this.reErr(this.processConfig.nodeConfig);

      if (this.processConfig.nodeConfig.childNode == null && this.tipList.length == 0) {

        this.tipList.push({ name: '审核人', type: "审核人" })
        // return false
      }
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        return;
      }
      let $this = this
      let corpid = this.$store.state.corpid
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        workflow_info: JSON.stringify(this.processConfig)
      }
      console.log(this.processConfig)
      // return false
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addtemplateworkflow'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '保存成功！'
        });

      }).catch(err => {
        console.log(err)
      })
    },
    reErr (data) {
      console.log(data)
      if (data == undefined) {
        this.tipList.push({ name: '', })
      } else {
        if (data.childNode) {
          if (data.childNode.type == 1) {//审批人
            if (data.childNode.error) {
              this.tipList.push({ name: data.nodeName, type: "审核人" })
            }
            this.reErr(data.childNode)
          } else if (data.childNode.type == 2) {
            if (data.childNode.error) {
              this.tipList.push({ name: data.childNode.nodeName, type: "抄送人" })
            }
            this.reErr(data.childNode)
          } else if (data.childNode.type == 3) {
            this.reErr(data.childNode.childNode)
          } else if (data.childNode.type == 4) {
            this.reErr(data.childNode)
            for (var i = 0; i < data.childNode.conditionNodes.length; i++) {

              if (data.childNode.conditionNodes[i].error) {
                this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
              }
              this.reErr(data.childNode.conditionNodes[i])
            }
          }
          else if (data.childNode.type == 5) {
            this.reErr(data.childNode)

            for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
              this.reErrTwo(data.childNode.conditionNodes[i].childNode.conditionNodes)
              if (data.childNode.conditionNodes[i].error) {
                this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
              }
              this.reErr(data.childNode.conditionNodes[i])
            }
          }
        } else {
          data.childNode = null
        }
      }

    },
    reErrTwo (data) {
      for (let i in data) {

        if (data[i].childNode == null) {
          console.log(data[i])
          this.tipList.push({ name: data[i].nodeName, type: "添加审核人" })
        }
      }
    },
  }

}
</script>
<style lang="less" >
@import "../../../assets/less/workflow_2.css";
@import "../../../assets/less/workflow_1.less";

// @import "../../../../assets/less/workflow_2.css";
.three_setting {
  // @import "../../../assets/less/workflow.css";
  .error-modal-list {
    width: 655px;
  }
  .zoom_div {
    position: fixed;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    width: 200px;
    right: 40px;
    margin-top: 30px;
    z-index: 10;
  }
  .audit_other_alert .el-dialog {
    margin: auto;
    margin-top: 15vh;

    .el-dialog__footer {
      margin-right: 25px;
      padding-bottom: 20px;
    }
  }
}
.add-node-popover-item .item-wrapper {
  user-select: none;
  display: inline-block;
  width: 70px;
  height: 70px;
  margin-bottom: 5px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.add-node-popover-item {
  margin-right: 10px;
  cursor: pointer;
  text-align: center;
  flex: 1;
  color: #191f25 !important;
}
.add-node-popover-item .iconfont {
  font-size: 30px !important;
  line-height: 70px;
  margin-right: 0px;
}

.add-node-popover-item.approver .item-wrapper {
  color: #ff943e;
}
</style>