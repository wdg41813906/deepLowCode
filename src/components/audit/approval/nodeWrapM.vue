<template>
  <div>
    <div class="node-wrap" v-if="nodeConfig.type != 4 && nodeConfig.type != 5">
      <div
        class="node-wrap-box"
        :class="
          (nodeConfig.type == 0 ? 'start-node ' : '') +
          (isTried && nodeConfig.error ? 'active error' : '')
        "
      >
        <div>
          <div
            class="title"
            :style="
              'background: rgb(' +
              ['87, 106, 149', '255, 148, 62', '50, 150, 250'][
                nodeConfig.type
              ] +
              ');'
            "
          >
            <span class="iconfont" v-show="nodeConfig.type == 1"></span>
            <span class="iconfont" v-show="nodeConfig.type == 2"></span>
            <span v-if="nodeConfig.type == 0">{{ nodeConfig.nodeName }}</span>
            <input
              type="text"
              class="ant-input editable-title-input"
              v-if="nodeConfig.type != 0 && isInput"
              @blur="blurEvent()"
              @focus="$event.currentTarget.select()"
              v-focus
              v-model="nodeConfig.nodeName"
              :placeholder="placeholderList[nodeConfig.type]"
            />
            <span
              class="editable-title"
              @click="clickEvent()"
              v-if="nodeConfig.type != 0 && !isInput"
              >{{ nodeConfig.nodeName }}</span
            >
            <i
              class="anticon anticon-close close"
              v-if="nodeConfig.type != 0"
              @click="delNode(nodeConfig)"
            ></i>
          </div>
          <div class="content">
            <div class="text" v-if="nodeConfig.type == 0">
              <!-- {{ flowPermission }} -->
              <span v-if="flowPermission.length == 0">所有人</span>
              <span v-for="(item, index) in flowPermission" :key="item">
                {{ item.department }}
                <!-- <get-tree-name
                  :openid="item.targetId"
                  v-if="item.type == 3"
                ></get-tree-name>

                <get-tree-name-m
                  :openid="item.targetId"
                  v-else
                ></get-tree-name-m> -->
                <span v-if="index < flowPermission.length - 1">,</span>
              </span>
            </div>
            <div class="text" v-if="nodeConfig.type == 1" @click="setPerson">
              <span
                class="placeholder"
                v-if="nodeConfig.nodeUserList.length == 0"
                >请选择{{ placeholderList[nodeConfig.type] }}</span
              >
              <span
                v-for="(item, index) in nodeConfig.nodeUserList"
                :key="item"
              >
                {{ item.department }}
                <!-- <get-tree-name
                  :openid="item.targetId"
                  v-if="item.type == 3"
                ></get-tree-name>
                <get-tree-name-m
                  :openid="item.targetId"
                  v-else
                ></get-tree-name-m> -->
                <span v-if="index < nodeConfig.nodeUserList.length - 1">,</span>
              </span>
            </div>
            <div class="text" v-if="nodeConfig.type == 2" @click="setPerson">
              <span class="placeholder" v-if="!copyerStr(nodeConfig)"
                >请选择{{ placeholderList[nodeConfig.type] }}</span
              >
              {{ copyerStr(nodeConfig) }}
            </div>
            <i
              class="anticon anticon-right arrow"
              v-if="nodeConfig.type != 0"
            ></i>
          </div>
          <div class="error_tip" v-if="isTried && nodeConfig.error">
            <i
              class="anticon anticon-exclamation-circle"
              style="color: rgb(242, 86, 67)"
            ></i>
          </div>
        </div>
      </div>
      <div style="height: 50px; width: 2px; background: #cacaca"></div>
      <div v-if="nodeConfig.type !== 0">
        <addNodeM :childNodeP.sync="nodeConfig.childNode"></addNodeM>
      </div>
    </div>
    <div class="branch-wrap" v-if="nodeConfig.type == 4">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button class="add-branch" @click="addTerm">添加条件</button>
          <div
            class="col-box"
            v-for="(item, index) in nodeConfig.conditionNodes"
            :key="index"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  class="auto-judge"
                  :class="isTried && item.error ? 'error active' : ''"
                >
                  <div
                    class="sort-left"
                    v-if="index != 0"
                    @click="arrTransfer(index, -1)"
                  >
                    &lt;
                  </div>
                  <div class="title-wrapper">
                    <input
                      type="text"
                      class="ant-input editable-title-input"
                      v-if="isInputList[index]"
                      @blur="blurEvent(index)"
                      @focus="$event.currentTarget.select()"
                      v-focus
                      v-model="item.nodeName"
                    />
                    <span
                      class="editable-title"
                      @click="clickEvent(index)"
                      v-if="!isInputList[index]"
                      >{{ item.nodeName }}</span
                    >
                    <!-- <span
                      class="priority-title"
                      @click="setPerson(item.priorityLevel)"
                      >优先级{{ item.priorityLevel }}</span
                    > -->
                    <i
                      class="anticon anticon-close close"
                      @click="delTerm(index)"
                      v-if="index > 0"
                    ></i>
                  </div>
                  <div
                    class="sort-right"
                    v-if="index != nodeConfig.conditionNodes.length - 1"
                    @click="arrTransfer(index)"
                  >
                    &gt;
                  </div>
                  <!-- <div class="content" @click="setPerson(item.priorityLevel)">
                    <span v-if="item.nodeUserList.length == 0">{{
                      conditionStr(item, index)
                    }}</span>
                    <span v-if="item.nodeUserList.length > 0"
                      >发起人选择：
                      <span>{{ item.nodeUserList[0].targetId }}</span>
                      
                    </span>
                  </div> -->
                  <div class="error_tip" v-if="isTried && item.error">
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67)"
                    ></i>
                  </div>
                </div>
                <addNodeM :childNodeP.sync="item.childNode"></addNodeM>
              </div>
            </div>
            <nodeWrapM
              v-if="item.childNode && item.childNode"
              :nodeConfig.sync="item.childNode"
              :tableId="tableId"
              :isTried.sync="isTried"
              :directorMaxLevel="directorMaxLevel"
              :alldepart="alldepart"
            ></nodeWrapM>
            <div class="top-left-cover-line" v-if="index == 0"></div>
            <div class="bottom-left-cover-line" v-if="index == 0"></div>
            <div
              class="top-right-cover-line"
              v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
            <div
              class="bottom-right-cover-line"
              v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
          </div>
        </div>
        <addNodeN :childNodeP.sync="nodeConfig.childNode"></addNodeN>
      </div>
    </div>
    <div class="branch-wrap" v-if="nodeConfig.type == 5">
      <div class="branch-box-wrap">
        <div class="branch-box branch-box_1">
          <button class="add-branch add-branch_1" style="width: 58px"></button>
          <div
            class="col-box"
            v-for="(item, index) in nodeConfig.conditionNodes"
            :key="index"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  class="auto-judge"
                  :class="isTried && item.error ? 'error active' : ''"
                >
                  <div
                    class="sort-left"
                    v-if="index != 0"
                    @click="arrTransfer(index, -1)"
                  >
                    &lt;
                  </div>
                  <div class="title-wrapper">
                    <span class="editable-title" v-if="!isInputList[index]">{{
                      item.nodeName
                    }}</span>
                    <!-- <span
                      class="priority-title"
                      @click="setPerson(item.priorityLevel)"
                      >优先级{{ item.priorityLevel }}</span
                    > -->
                    <!-- <i
                      class="anticon anticon-close close"
                      @click="delTerm(index)"
                    ></i> -->
                  </div>
                  <div
                    class="sort-right"
                    v-if="index != nodeConfig.conditionNodes.length - 1"
                    @click="arrTransfer(index)"
                  >
                    &gt;
                  </div>
                  <div class="content">
                    <span v-if="item.nodeUserList.length == 0">{{
                      conditionStr(item, index)
                    }}</span>
                    <span v-if="item.nodeUserList.length > 0"
                      >所属部门：{{ item.nodeUserList[0].department }}
                      <!-- <get-tree-name
                        :openid="item.nodeUserList[0].targetId"
                      ></get-tree-name> -->
                      <!-- <span>{{ item.nodeUserList[0].targetId }}</span> -->
                      <!-- <span
                        v-for="(items, index) in item.nodeUserList"
                        :key="items"
                      >
                        <get-tree-name-m
                          :openid="items.targetId"
                        ></get-tree-name-m>
                        {{ items.targetId }}
                        <span v-if="index < item.nodeUserList.length - 1"
                          >或</span
                        >
                      </span> -->
                    </span>
                  </div>
                  <div class="error_tip" v-if="isTried && item.error">
                    <i
                      class="anticon anticon-exclamation-circle"
                      style="color: rgb(242, 86, 67)"
                    ></i>
                  </div>
                </div>
                <addNodeN :childNodeP.sync="item.childNode"></addNodeN>
              </div>
            </div>
            <nodeWrapM
              v-if="item.childNode && item.childNode"
              :nodeConfig.sync="item.childNode"
              :tableId="tableId"
              :isTried.sync="isTried"
              :directorMaxLevel="directorMaxLevel"
              :alldepart="alldepart"
            ></nodeWrapM>
            <div class="top-left-cover-line" v-if="index == 0"></div>
            <div class="bottom-left-cover-line" v-if="index == 0"></div>
            <div
              class="top-right-cover-line"
              v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
            <div
              class="bottom-right-cover-line"
              v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
          </div>
        </div>
        <addNodeN :childNodeP.sync="nodeConfig.childNode"></addNodeN>
      </div>
    </div>

    <nodeWrapM
      v-if="nodeConfig.childNode && nodeConfig.childNode"
      :nodeConfig.sync="nodeConfig.childNode"
      :tableId="tableId"
      :isTried.sync="isTried"
      :directorMaxLevel="directorMaxLevel"
      :alldepart="alldepart"
    ></nodeWrapM>

    <!-- 新添  by bule -->
    <!-- <OriginatorAlert
      :is_add="promoterDrawer"
      :flowPermission1="flowPermission1"
      @back="originatorBack"
    ></OriginatorAlert> -->
    <DepartAlertA
      :is_add="promoterDrawer"
      :departlist="departlist_look"
      :alldepart="alldepart"
      :title="'填报对象'"
      @back="originatorBack"
      @departSub="departLookSub"
    ></DepartAlertA>
    <DepartMAlert
      :is_add="approverDrawer"
      :departlist="departlist_m"
      :auditnum="auditnum"
      :alldepart="alldepart"
      :title="'请选择人员'"
      @back="departBackM"
      @departSub="departSubM"
    ></DepartMAlert>
    <DepartAlertC
      :is_add="conditionDrawer"
      :title_condition="title_condition"
      :departlist="departlist_lookC"
      :alldepart="alldepart"
      :title="'条件选择'"
      @back="conditionBack"
      @departSub="departCSub"
    ></DepartAlertC>
  </div>
</template>
<script>
import OriginatorAlert from './originatorAlert'
// import DepartAlertA from '../../../public/departAlertA.vue'
// import DepartAlertC from './otherAlert'
// import DepartMAlert from '../../../public/departMAlert.vue'
import DepartAlertA from '../../public/departAlertA.vue'
import DepartAlertC from '../../public/departAlertA.vue'
import DepartMAlert from '../../public/departAlertF.vue'
// import GetTreeName from '../../../public/getTreeName.vue'
// import GetTreeNameM from '../../../public/getTreeNameM.vue'
export default {
  props: ["nodeConfig", "flowPermission", "directorMaxLevel", "isTried", "tableId", "sumval", 'departlist_look', 'alldepart'],
  components: { OriginatorAlert, DepartAlertA, DepartMAlert, DepartAlertC },
  data () {
    return {
      placeholderList: ["填报对象", "审核人", "抄送人"],
      isInputList: [],
      isInput: false,
      promoterVisible: false,
      promoterDrawer: false,
      departments: {},
      checkedDepartmentList: [],
      checkedEmployessList: [],
      promoterSearchName: "",
      flowPermission1: this.flowPermission,
      approverDrawer: false,
      approverVisible: false,
      approverRoleVisible: false,
      approverConfig: {},
      approverEmplyessList: [],
      approverSearchName: "",
      roles: [],
      roleList: [],
      approverRoleSearchName: "",
      copyerDrawer: false,
      copyerVisible: false,
      copyerConfig: {},
      copyerSearchName: "",
      activeName: "1",
      copyerEmployessList: [],
      copyerRoleList: [],
      ccSelfSelectFlag: [],
      conditionDrawer: false,
      conditionVisible: false,
      conditionConfig: {},
      conditionsConfig: {
        conditionNodes: [],
      },
      bPriorityLevel: "",
      conditions: [],
      conditionList: [],
      conditionRoleVisible: false,
      conditionRoleSearchName: "",
      conditionDepartmentList: [],
      conditionEmployessList: [],
      conditionRoleList: [],
      originator_departlist: [],
      title_condition: '',
      departlist_m: [],
      departlist_lookC: [],
      // departlist_look: [],
    }
  },
  mounted () {
    // this.getAgentId()
    if (this.nodeConfig.type == 1) {
      this.nodeConfig.error = this.nodeConfig.nodeUserList.length > 0 ? false : true
    } else if (this.nodeConfig.type == 2) {
      this.nodeConfig.error = !this.copyerStr(this.nodeConfig)
    } else if (this.nodeConfig.type == 4) {
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
      }
    }
  },
  methods: {

    /*   ----------add-------------*/
    conditionBack (val) {
      this.conditionDrawer = val

    },
    sureConditionRole () {
      this.conditionConfig.nodeUserList = [];
      this.conditionRoleList.map(item => {
        this.conditionConfig.nodeUserList.push({
          type: 2,
          targetId: item.roleId,
          name: item.roleName
        })
      });
      this.conditionDepartmentList.map(item => {
        this.conditionConfig.nodeUserList.push({
          type: 3,
          targetId: item.id,
          name: item.departmentName
        })
      });
      this.conditionEmployessList.map(item => {
        this.conditionConfig.nodeUserList.push({
          type: 1,
          targetId: item.id,
          name: item.employeeName
        })
      });
      this.conditionRoleVisible = false;
    },
    departCSub (val) {
      console.log('sdfsdfsdfsdf')
      console.log(val)
      this.conditionConfig.nodeUserList = [];
      this.conditionConfig.nodeUserList.push({
        type: 5,
        targetId: val,
        // IsDepart: val
      })
      console.log(this.conditionConfig.nodeUserList)
      this.title_condition = val
      this.toChecked(this.conditionList, { columnId: 0 }, 'columnId')

    },
    saveCondition () {
      this.conditionDrawer = false;
      var a = this.conditionsConfig.conditionNodes.splice(this.bPriorityLevel - 1, 1)//截取旧下标
      this.conditionsConfig.conditionNodes.splice(this.conditionConfig.priorityLevel - 1, 0, a[0])//填充新下标
      this.conditionsConfig.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1
      });
      for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
        this.conditionsConfig.conditionNodes[i].error = this.conditionStr(this.conditionsConfig.conditionNodes[i], i) == "请设置条件" && i != this.conditionsConfig.conditionNodes.length - 1
      }
      console.log('----------------')
      this.$emit("update:nodeConfig", this.conditionsConfig);
    },
    departBackM (val) {
      this.approverDrawer = val
    },
    departSubM (val) {
      console.log(val)
      console.log(this.approverConfig)
      this.approverConfig.nodeUserList = [];
      let userlist = val
      userlist.map(item => {
        this.approverConfig.nodeUserList.push({
          type: 1,
          targetId: item.id,
          name: item.depart_id,
          department: item.Department
          // IsDepart: item.IsDepart,
          // departid: item.depart_id
        })
      });
      this.saveApprover()
    },
    saveApprover () {
      this.approverConfig.error = this.approverConfig.nodeUserList.length > 0 ? false : true
      this.$emit("update:nodeConfig", this.approverConfig);
      this.approverDrawer = false;
    },
    departLookSub (val) {
      console.log(val)
      this.originator_departlist = val
      this.flowPermission1 = [];
      val.map(item => {
        if (item.IsDepart) {
          this.flowPermission1.push({
            type: 3,
            targetId: item.id,
            name: item.depart_id
            // IsDepart: item.IsDepart
          })
        } else {
          this.flowPermission1.push({
            type: 1,
            targetId: item.id,
            name: item.depart_id
            // IsDepart: item.IsDepart
          })
        }
        delete item.Children
      });
      this.$emit('update:departlist_look', val)
      this.savePromoter()
    },
    originatorBack (val) {
      this.promoterDrawer = val
    },
    savePromoter () {
      this.$emit("update:flowPermission", this.flowPermission1);
      // this.promoterDrawer = false;
    },
    toggleClass (arr, elem, key = 'id') {
      return arr.some(item => { return item[key] == elem[key] });
    },
    toChecked (arr, elem, key = 'id') {
      var isIncludes = this.toggleClass(arr, elem, key);
      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
      this.sureCondition()
    },
    removeEle (arr, elem, key = 'id') {
      var includesIndex;
      arr.map((item, index) => {
        if (item[key] == elem[key]) {
          includesIndex = index
        }
      });
      arr.splice(includesIndex, 1);
    },

    sureCondition () {
      console.log('--------------')
      console.log(this.conditionList)
      //1.弹窗有，外面无+
      //2.弹窗有，外面有不变
      for (var i = 0; i < this.conditionList.length; i++) {
        var { columnId, showName, columnName, showType, columnName, columnType, fixedDownBoxValue } = this.conditionList[i];
        if (this.toggleClass(this.conditionConfig.conditionList, this.conditionList[i], "columnId")) {
          continue;
        }
        if (columnId == 0) {
          this.conditionConfig.nodeUserList == [];
          this.conditionConfig.conditionList.push({
            "type": 1,
            "columnId": columnId,
            "showName": '填报对象'
          });
        } else {
          if (columnType == "Double") {
            this.conditionConfig.conditionList.push({
              "showType": showType,
              "columnId": columnId,
              "type": 2,
              "showName": showName,
              "optType": "1",
              "zdy1": "2",
              "opt1": "<",
              "zdy2": "",
              "opt2": "<",
              "columnDbname": columnName,
              "columnType": columnType,
            })
          } else if (columnType == "String" && showType == "3") {
            this.conditionConfig.conditionList.push({
              "showType": showType,
              "columnId": columnId,
              "type": 2,
              "showName": showName,
              "zdy1": "",
              "columnDbname": columnName,
              "columnType": columnType,
              "fixedDownBoxValue": fixedDownBoxValue
            })
          }
        }
      }
      ////3.弹窗无，外面有-
      for (var i = this.conditionConfig.conditionList.length - 1; i >= 0; i--) {
        if (!this.toggleClass(this.conditionList, this.conditionConfig.conditionList[i], "columnId")) {
          this.conditionConfig.conditionList.splice(i, 1);
        }
      }
      this.conditionConfig.conditionList.sort(function (a, b) { return a.columnId - b.columnId; });
      this.conditionVisible = false;

      this.saveCondition()

    },

    /*   ----------end-------------*/
    clickEvent (index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, true)
      } else {
        this.isInput = true;
      }
    },
    blurEvent (index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, false)
        this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index].nodeName ? this.nodeConfig.conditionNodes[index].nodeName : "条件"
      } else {
        this.isInput = false;
        this.nodeConfig.nodeName = this.nodeConfig.nodeName ? this.nodeConfig.nodeName : this.placeholderList[this.nodeConfig.type]
      }
    },
    conditionStr (item, index) {
      var { conditionList, nodeUserList } = item;
      console.log(item)
      if (conditionList.length == 0) {
        console.log(this.nodeConfig.conditionNodes.length)
        console.log(this.nodeConfig.conditionNodes[0].conditionList.length)
        return (index == this.nodeConfig.conditionNodes.length - 1) && this.nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件'
      } else {
        let str = ""
        for (var i = 0; i < conditionList.length; i++) {
          var { columnId, columnType, showType, showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } = conditionList[i];
          if (columnId == 0) {
            if (nodeUserList.length != 0) {
              str += '发起人属于：'
              str += nodeUserList.map(item => { return item.name }).join("或") + " 并且 "
            }
          }
          if (columnType == "String" && showType == "3") {
            if (zdy1) {
              str += showName + '属于：' + this.dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + " 并且 "
            }
          }
          if (columnType == "Double") {
            if (optType != 6 && zdy1) {
              var optTypeStr = ["", "<", ">", "≤", "=", "≥"][optType]
              str += `${showName} ${optTypeStr} ${zdy1} 并且 `
            } else if (optType == 6 && zdy1 && zdy2) {
              str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
            }
          }
        }
        return str ? str.substring(0, str.length - 4) : '请设置条件'
      }
    },
    dealStr (str, obj) {
      let arr = [];
      let list = str.split(",");
      for (var elem in obj) {
        list.map(item => {
          if (item == elem) {
            arr.push(obj[elem].value)
          }
        })
      }
      return arr.join("或")
    },
    addConditionRole () {
      this.conditionRoleSearchName = "";
      this.conditionRoleVisible = true;
      this.activeName = "1";
      this.getDepartmentList();
      this.conditionDepartmentList = [];
      this.conditionEmployessList = [];
      this.conditionRoleList = [];
      for (var i = 0; i < this.conditionConfig.nodeUserList.length; i++) {
        var { type, name, targetId } = this.conditionConfig.nodeUserList[i];
        if (type == 1) {
          this.conditionEmployessList.push({
            employeeName: name,
            id: targetId
          });
        } else if (type == 2) {
          this.conditionRoleList.push({
            roleName: name,
            roleId: targetId
          });
        } else if (type == 3) {
          this.conditionDepartmentList.push({
            departmentName: name,
            id: targetId
          });
        }
      }
    },


    changeOptType (item) {
      if (item.optType == 1) {
        item.zdy1 = 2;
      } else {
        item.zdy1 = 1;
        item.zdy2 = 2;
      }
    },


    getDebounceData (event, type = 1) {
      this.$func.debounce(function () {
        if (event.target.value) {
          if (type == 1) {
            this.departments.childDepartments = [];
            this.$axios.get(`/employees.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
              this.departments.employees = res.data.list
            })
          } else {
            this.$axios.get(`/roles.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
              this.roles = res.data.list
            })
          }
        } else {
          type == 1 ? this.getDepartmentList() : this.getRoleList();
        }
      }.bind(this))()
    },
    handleClick () {
      this.copyerSearchName = "";
      this.conditionRoleSearchName = "";
      if (this.activeName == 1) {
        this.getDepartmentList();
      } else {
        this.getRoleList();
      }
    },
    addCopyer () {
      this.copyerSearchName = "";
      this.copyerVisible = true;
      this.activeName = "1";
      this.getDepartmentList();
      this.copyerEmployessList = [];
      this.copyerRoleList = [];
      for (var i = 0; i < this.copyerConfig.nodeUserList.length; i++) {
        var { type, name, targetId } = this.copyerConfig.nodeUserList[i];
        if (type == 1) {
          this.copyerEmployessList.push({
            employeeName: name,
            id: targetId
          });
        } else if (type == 2) {
          this.copyerRoleList.push({
            roleName: name,
            roleId: targetId
          });
        }
      }
    },
    sureCopyer () {
      this.copyerConfig.nodeUserList = [];
      this.copyerEmployessList.map(item => {
        this.copyerConfig.nodeUserList.push({
          type: 1,
          targetId: item.id,
          name: item.employeeName
        })
      });
      this.copyerRoleList.map(item => {
        this.copyerConfig.nodeUserList.push({
          type: 2,
          targetId: item.roleId,
          name: item.roleName
        })
      });
      this.copyerVisible = false;
    },
    saveCopyer () {
      this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1;
      this.copyerConfig.error = !this.copyerStr(this.copyerConfig);
      this.$emit("update:nodeConfig", this.copyerConfig);
      this.copyerDrawer = false;
    },
    copyerStr (nodeConfig) {
      if (nodeConfig.nodeUserList.length != 0) {
        return this.arrToStr(nodeConfig.nodeUserList)
      } else {
        if (nodeConfig.ccSelfSelectFlag == 1) {
          return "发起人自选"
        }
      }
    },
    changeRange (val) {
      this.approverConfig.nodeUserList = [];
    },
    changeType (val) {
      this.approverConfig.nodeUserList = [];
      this.approverConfig.examineMode = 1;
      this.approverConfig.noHanderAction = 2;
      if (val == 2) {
        this.approverConfig.directorLevel = 1;
      } else if (val == 4) {
        this.approverConfig.selectMode = 1;
        this.approverConfig.selectRange = 1;
      } else if (val == 7) {
        this.approverConfig.examineEndDirectorLevel = 1
      }
    },
    addApprover () {
      this.approverVisible = true;
      this.approverSearchName = "";
      this.getDepartmentList();
      this.approverEmplyessList = [];
      for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
        var { name, targetId } = this.approverConfig.nodeUserList[i];
        this.approverEmplyessList.push({
          employeeName: name,
          id: targetId
        });
      }
    },
    addRoleApprover () {
      this.approverRoleVisible = true;
      this.approverRoleSearchName = "";
      this.getRoleList();
      this.roleList = [];
      for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
        var { name, targetId } = this.approverConfig.nodeUserList[i];
        this.roleList.push({
          roleName: name,
          roleId: targetId
        });
      }
    },

    setApproverStr (nodeConfig) {
      if (nodeConfig.settype == 1) {
        if (nodeConfig.nodeUserList.length == 1) {
          return nodeConfig.nodeUserList[0].name
        } else if (nodeConfig.nodeUserList.length > 1) {
          if (nodeConfig.examineMode == 1) {
            return this.arrToStr(nodeConfig.nodeUserList)
          } else if (nodeConfig.examineMode == 2) {
            return nodeConfig.nodeUserList.length + "人会签"
          }
        }
      } else if (nodeConfig.settype == 2) {
        let level = nodeConfig.directorLevel == 1 ? '直接主管' : '第' + nodeConfig.directorLevel + '级主管'
        if (nodeConfig.examineMode == 1) {
          return level
        } else if (nodeConfig.examineMode == 2) {
          return level + "会签"
        }
      } else if (nodeConfig.settype == 4) {
        if (nodeConfig.selectRange == 1) {
          return "发起人自选"
        } else {
          if (nodeConfig.nodeUserList.length > 0) {
            if (nodeConfig.selectRange == 2) {
              return "发起人自选"
            } else {
              return '发起人从' + nodeConfig.nodeUserList[0].name + '中自选'
            }
          } else {
            return "";
          }
        }
      } else if (nodeConfig.settype == 5) {
        return "发起人自己"
      } else if (nodeConfig.settype == 7) {
        return '从直接主管到通讯录中级别最高的第' + nodeConfig.examineEndDirectorLevel + '个层级主管'
      }
    },

    addPromoter () {
      this.promoterVisible = true;
      this.getDepartmentList();
      this.promoterSearchName = "";
      this.checkedEmployessList = [];
      this.checkedDepartmentList = [];
      for (var i = 0; i < this.flowPermission1.length; i++) {
        var { type, name, targetId } = this.flowPermission1[i];
        if (type == 1) {
          this.checkedEmployessList.push({
            employeeName: name,
            id: targetId
          });
        } else if (type == 3) {
          this.checkedDepartmentList.push({
            departmentName: name,
            id: targetId
          });
        }
      }
    },

    arrToStr (arr) {
      if (arr) {
        return arr.map(item => { return item.name }).toString()
      }
    },
    toggleStrClass (item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : []
      return a.some(item => { return item == key });
    },
    toStrChecked (item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : []
      var isIncludes = this.toggleStrClass(item, key);
      if (!isIncludes) {
        a.push(key)
        item.zdy1 = a.toString()
      } else {
        this.removeStrEle(item, key);
      }
    },
    removeStrEle (item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : []
      var includesIndex;
      a.map((item, index) => {
        if (item == key) {
          includesIndex = index
        }
      });
      a.splice(includesIndex, 1);
      item.zdy1 = a.toString()
    },

    getRoleList () {
      this.$axios.get("/roles.json").then(res => {
        this.roles = res.data.list;
      })
    },
    getDepartmentList (parentId = 0) {
      this.$axios.get("/departments.json?parentId=" + parentId).then(res => {
        this.departments = res.data;
      })
    },
    delNode (nodeConfig) {
      console.log('sdfsdfsdfsdf')
      console.log(nodeConfig)
      this.$emit("update:nodeConfig", this.nodeConfig.childNode);
    },
    addTerm () {
      let len = this.nodeConfig.conditionNodes.length + 1
      this.nodeConfig.conditionNodes.push({
        "nodeName": "标签" + len + '(可改)',
        "type": 3,
        "priorityLevel": len,
        "conditionList": [],
        "nodeUserList": [{ targetId: 0, type: 0 }],
        "error": false,
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
      });
      console.log('sdfsdfsdfsdfsdfsdfsdfsdfsdf')
      // for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
      //   this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
      // }
      this.$emit("update:nodeConfig", this.nodeConfig);
    },
    delTerm (index) {
      this.nodeConfig.conditionNodes.splice(index, 1)
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
      }
      this.$emit("update:nodeConfig", this.nodeConfig);
      // if (this.nodeConfig.conditionNodes.length == 1) {
      //   if (this.nodeConfig.childNode) {
      //     if (this.nodeConfig.conditionNodes[0].childNode) {
      //       this.reData(this.nodeConfig.conditionNodes[0].childNode, this.nodeConfig.childNode)
      //     } else {
      //       this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
      //     }
      //   }
      //   this.$emit("update:nodeConfig", this.nodeConfig.conditionNodes[0].childNode);
      // }
    },
    reData (data, addData) {
      if (!data.childNode) {
        data.childNode = addData
      } else {
        this.reData(data.childNode, addData)
      }
    },
    setPerson (priorityLevel) {
      var { type } = this.nodeConfig;
      console.log(type)
      if (type == 0) {
        this.departlist_look = []
        for (let i in this.nodeConfig.nodeUserList) {
          this.departlist_look.push({ id: this.nodeConfig.nodeUserList[i].targetId, depart_id: this.nodeConfig.nodeUserList[i].name, Department: this.nodeConfig.nodeUserList[i].department })
        }
        console.log(this.departlist_look)
        this.promoterDrawer = true;
        this.flowPermission1 = this.flowPermission;
      } else if (type == 1) {
        console.log(this.nodeConfig)
        this.departlist_m = []
        console.log(this.nodeConfig.nodeUserList)
        for (let i in this.nodeConfig.nodeUserList) {
          this.departlist_m.push({ id: this.nodeConfig.nodeUserList[i].targetId, depart_id: this.nodeConfig.nodeUserList[i].name, Department: this.nodeConfig.nodeUserList[i].department })
        }
        console.log(this.departlist_m)
        this.approverDrawer = true;
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
        this.approverConfig.settype = this.approverConfig.settype ? this.approverConfig.settype : 1
      } else if (type == 2) {
        this.copyerDrawer = true;
        this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
        this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
      } else {
        console.log(this.nodeConfig)
        this.departlist_lookC = []
        for (let i in this.nodeConfig.nodeUserList) {
          this.departlist_lookC.push({ id: this.nodeConfig.nodeUserList[i].targetId, depart_id: this.nodeConfig.nodeUserList[i].name, Department: this.nodeConfig.nodeUserList[i].department })
        }
        this.conditionDrawer = true
        this.bPriorityLevel = priorityLevel;
        this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig))
        this.conditionConfig = this.conditionsConfig.conditionNodes[priorityLevel - 1]
        console.log(this.conditionConfig.nodeUserList)
        if (this.conditionConfig.nodeUserList.length > 0) {
          this.title_condition = this.conditionConfig.nodeUserList[0].targetId
        } else {
          this.title_condition = ''
        }
      }
    },
    arrTransfer (index, type = 1) {//向左-1,向右1
      this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
      this.nodeConfig.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1
      })
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
      }
      this.$emit("update:nodeConfig", this.nodeConfig);
    }
  }
}
</script>
<style lang="less">
.branch-box_1 {
  margin-top: 0px !important;
  .add-branch_1 {
    display: none !important;
  }
}
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}
.add-node-popover-body {
  display: flex;
}
.promoter_content {
  padding: 0 20px;
}
.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
  margin-bottom: 20px;
}
.promoter_content p {
  padding: 18px 0;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
}
.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}
.person_body {
  border: 1px solid #f5f5f5;
  height: 500px;
}
.person_tree {
  padding: 10px 12px 0 8px;
  width: 280px;
  height: 100%;
  border-right: 1px solid #f5f5f5;
}
.person_tree input {
  padding-left: 22px;
  width: 210px;
  height: 30px;
  font-size: 12px;
  border-radius: 2px;
  border: 1px solid #d5dadf;
  background: url(~@/assets/images/list_search.png) no-repeat 10px center;
  background-size: 14px 14px;
  margin-bottom: 14px;
}
.tree_nav span {
  display: inline-block;
  padding-right: 10px;
  margin-right: 5px;
  max-width: 6em;
  color: #38adff;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/jiaojiao.png) no-repeat right center;
}
.tree_nav span:last-of-type {
  background: none;
}
.person_tree ul,
.has_selected ul {
  height: 420px;
  overflow-y: auto;
}
.person_tree li {
  padding: 5px 0;
}
.person_tree li i {
  float: right;
  padding-left: 24px;
  padding-right: 10px;
  color: #3195f8;
  font-size: 12px;
  cursor: pointer;
  background: url(~@/assets/images/next_level_active.png) no-repeat 10px center;
  border-left: 1px solid rgb(238, 238, 238);
}
.person_tree li a.active + i {
  color: rgb(197, 197, 197);
  background-image: url(~@/assets/images/next_level.png);
  pointer-events: none;
}
.person_tree img {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
.has_selected {
  width: 276px;
  height: 100%;
  font-size: 12px;
}
.has_selected ul {
  height: 460px;
}
.has_selected p {
  padding-left: 19px;
  padding-right: 20px;
  line-height: 37px;
  border-bottom: 1px solid #f2f2f2;
}
.has_selected p a {
  float: right;
}
.has_selected ul li {
  margin: 11px 26px 13px 19px;
  line-height: 17px;
}
.has_selected li span {
  vertical-align: middle;
}
.has_selected li img:first-of-type {
  width: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
.has_selected li img:last-of-type {
  float: right;
  margin-top: 2px;
  width: 14px;
}
el-radio-group {
  padding: 20px 0;
}
.approver_content {
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f2f2;
}
.approver_content .el-radio,
.approver_some .el-radio,
.approver_self_select .el-radio {
  width: 27%;
  margin-bottom: 20px;
}
.copyer_content .el-checkbox {
  margin-bottom: 20px;
}
.el-checkbox__label {
  font-size: 12px;
}
.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_content,
.approver_some {
  padding: 20px 20px 0;
}
.approver_manager p:first-of-type,
.approver_some p {
  line-height: 19px;
  font-size: 14px;
  margin-bottom: 14px;
}

.approver_manager p {
  line-height: 32px;
}
.approver_manager select {
  width: 420px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.approver_manager p.tip {
  margin: 10px 0 22px 0;
  font-size: 12px;
  line-height: 16px;
  color: #f8642d;
}
.approver_self {
  padding: 28px 20px;
}
.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}
.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}
.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}
.approver_self_select h3 {
  margin: 5px 0 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
}
.condition_copyer .el-drawer__body select {
  position: absolute;
  top: 11px;
  right: 30px;
  width: 100px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content p.tip {
  margin: 20px 0;
  width: 510px;
  text-indent: 17px;
  line-height: 45px;
  background: rgba(241, 249, 255, 1);
  border: 1px solid rgba(64, 163, 247, 1);
  color: #46a6fe;
  font-size: 14px;
}
.condition_content ul {
  max-height: 500px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.condition_content li > span {
  float: left;
  margin-right: 8px;
  width: 70px;
  line-height: 32px;
  text-align: right;
}
.condition_content li > div {
  display: inline-block;
  width: 370px;
}
.condition_content li:not(:last-child) > div > p {
  margin-bottom: 20px;
}
.condition_content li > div > p:not(:last-child) {
  margin-bottom: 10px;
}
.condition_content li > a {
  float: right;
  margin-right: 10px;
  margin-top: 7px;
}
.condition_content li select,
.condition_content li input {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li select + input {
  width: 260px;
}
.condition_content li select {
  margin-right: 10px;
  width: 100px;
}
.condition_content li p.selected_list {
  padding-left: 10px;
  border-radius: 4px;
  min-height: 32px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li p.check_box {
  line-height: 32px;
}
.condition_list .el-dialog__body {
  padding: 16px 26px;
}
.condition_list p {
  color: #666666;
  margin-bottom: 10px;
}
.condition_list p.check_box {
  margin-bottom: 0;
  line-height: 36px;
}
</style>