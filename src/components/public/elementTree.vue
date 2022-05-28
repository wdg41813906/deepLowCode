<template>
  <div class="element_tree">
    <div class="member_coolLeft_top element_left">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        class="search_tree"
      ></el-input>
    </div>
    <el-tree
      :data="datalist"
      show-checkbox
      node-key="depart_id"
      :props="defaultProps"
      @check-change="handleCheckChange"
      :filter-node-method="filterNode"
      :default-expanded-keys="['1']"
      :default-checked-keys="departlist"
      :check-strictly="true"
      ref="tree"
    >
      >
      <span class="custom-tree-node" slot-scope="{ node }">
        <span
          ><img
            v-if="node.data.IsDepart == true || node.data.IsDepart == 'true'"
            src="@/assets/img/icon_folder_blue.png"
            alt="" />
          <img v-else src="@/assets/img/touxiang.png" alt=""
        /></span>
        {{ node.label }}
        <!-- <span v-if="node.data.IsDepart" class="tree_name">
          <GetTreeTree
            :openid="node.data.id"
            :isdepart="node.data.IsDepart"
          ></GetTreeTree>
        </span>
        <span v-else class="tree_name">
          <GetTreeTreeM
            :openid="node.data.id"
            :isdepart="node.data.IsDepart"
          ></GetTreeTreeM>
        </span> -->
      </span>
    </el-tree>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import { debounce } from '@/utils/encryption'
export default {
  name: 'element_tree',
  props: {
    getdata: Array,
    departlist: Array,
    key: Number,
    is_colse: Boolean
  },
  data () {
    return {
      datalist: [],
      defaultProps: {
        // Children: 'children',
        // Department: 'label',
        // DepartmentId: 'id'
        id: 'id',
        label: 'Department',
        children: 'Children',
        parent_id: 'ParentId',
        depart_id: 'depart_id',
        IsDepart: 'IsDepart',
        disabled: 'IsDepart'
      },
      filterText: '',
      selectlist: [],
      list_select: []
    }
  },
  methods: {

    handleCheckChange (data, checked, indeterminate) {
      // console.log(data)
      console.log(data, checked, indeterminate);
      this.getCheckedNodes()
      // if (checked) {

      //   let arr = [data.id];
      //   this.$refs.tree.setCheckedKeys(arr);
      //   // this.$emit('getTreelist', { label: [data] })
      //   this.getCheckedNodes()
      // } else {
      //   // this.$emit('getTreelist', { label: [] })
      //   this.getCheckedNodes()
      // }
    },
    getCheckedNodes () {
      // console.log(this.departlist)
      let list = this.$refs.tree.getCheckedNodes()
      console.log(list)
      console.log(this.list_select)
      if (this.filterText != '') {
        list = list.concat(this.list_select)

      }
      let selectlist = []
      let selectlabellist = []
      let pidlist = []
      console.log(list)
      for (let i in list) {
        if (pidlist.indexOf(parseInt(list[i].ParentId)) == -1) {
          if (list[i].IsDepart == true) {
            selectlist.push(list[i])
          } else {
            selectlabellist.push((list[i]))
          }
        }
        pidlist.push(parseInt(list[i].DepartId))

      }
      let list1 = this.unique(list)
      console.log(list1)
      this.$emit('getTreelist', { depart: list, label: selectlabellist })
    },
    unique (arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].depart_id == arr[j].depart_id) {         //第一个等同于第二个，splice方法删除第二个
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },
    getHalfCheckedNodes () {
      console.log(this.$refs.tree.getHalfCheckedNodes())
    },


    getTreeData () {
      // console.log(this.getdata)
      this.datalist = JSON.parse(JSON.stringify(this.getdata))

    },
    filterNode (value, data) {
      if (!value) return true;
      return data.Department.indexOf(value) !== -1 || data.depart_id.indexOf(value) !== -1;
    },
    searchid () {
      let payload = {
        corpid: this.$store.state.corpid,
        query_word: this.filterText,
        // query_type: 2
      }
      let $this = this
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['searchcontact'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        // $this.code = data.data
        console.log(data)

        // this.$router.push({ name: 'list_fill', query: { k: Date.now() } })
        let datas = []
        let data_user = []
        console.log(Object.keys(data.query_result).indexOf('user'))
        console.log(Object.keys(data.query_result).indexOf('party'))
        if (Object.keys(data.query_result).length != 0 && Object.keys(data.query_result).indexOf('party') != -1) {
          for (let i in data.query_result.party.department_id) {
            datas.push({ id: data.query_result.party.department_id[i].toString(), depart_id: data.query_result.party.department_id[i].toString(), IsDepart: true })
          }
          // this.datalist = datas
        }
        if (Object.keys(data.query_result).length != 0 && Object.keys(data.query_result).indexOf('user') != -1) {
          for (let i in data.query_result.user.userid) {
            data_user.push({ id: data.query_result.user.userid[i], IsDepart: false, depart_id: data.query_result.usermap[data.query_result.user.userid[i]][0] + '-' + data.query_result.user.userid[i] })
          }
          // this.datalist = datas
          // } else {
          //   this.datalist = []
          // }

          // if(this.datalist.length==0){
          //   this.
        }
        this.datalist = data_user.concat(datas)
        let c = JSON.stringify(this.list_select);
        console.log(c)
        for (var i = 0; i < datas.length; i++) {
          if (c.indexOf(this.datalist[i].toString()) > -1) {
            for (var j = 0; j < this.list_select.length; j++) {
              if (this.datalist[i].depart_id == this.list_select[j].depart_id) {
                // this.datalist.push(attendUid[i]);
                this.$delete(this.list_select, j)
                break;
              }
            }
          }
        }

      }).catch(err => {
        console.log(err)
      })
    }

  },
  mounted () {
    // this.$watch('filterText', debounce((newQuery) => {

    //   console.log(newQuery)
    //   if (newQuery != '') {
    //     this.searchid()
    //   } else {
    //     this.getTreeData()
    //   }

    // }, 200))
    console.log(this.getdata)
    this.datalist = JSON.parse(JSON.stringify(this.getdata))
    console.log(this.departlist)
    this.list_select = []
    for (let i in this.departlist) {
      this.list_select.push({ depart_id: this.departlist[i].toString(), IsDepart: this.departlist[i].split('-').length > 1 ? false : true })
    }
  },
  watch: {
    is_colse (val) {
      // if (val) {
      this.list_select = []
      for (let i in this.departlist) {
        this.list_select.push({ depart_id: this.departlist[i].toString(), IsDepart: this.departlist[i].split('-').length > 1 ? false : true })
      }
      // }
    },
    getdata () {
      console.log('sdf')
      this.getTreeData()
      console.log(this.departlist)
      for (let i in this.departlist) {
        this.selectlist.push(this.departlist[i].depart_id)
        console.log(this.selectlist)
      }
      let _this = this
      console.log('------------------------111')
      setTimeout(function () {
        if (_this.departlist.length > 0) {
          // _this.getCheckedNodes()
          console.log('------------------------333')
          this.$refs.tree.setCheckedKeys(_this.departlist);
        }
      }, 500)

    },
    filterText (val) {
      this.$refs.tree.filter(val);
    },
    departlist (val) {
      // this.selectlist = []
      // for (let i in val) {
      //   this.selectlist.push(val[i].id)
      // }
      // console.log(this.selectlist)
      console.log(val)
      console.log(this.departlist)
      console.log('------------------------')
      this.$refs.tree.setCheckedKeys(this.departlist);
      console.log(this.departlist)
      if (this.filterText == '') {
        this.list_select = []
        for (let i in this.departlist) {
          this.list_select.push({ depart_id: this.departlist[i].toString(), IsDepart: this.departlist[i].split('-').length > 1 ? false : true })
        }
      }
    }
  },
}
</script>
<style lang="less">
.element_tree {
  .tree_name {
    display: inline-block;
    margin-left: 10px;
  }
  .element_left {
    .el-input {
      width: 100%;
    }
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
  .el-icon-caret-right + .el-checkbox {
    display: none;
  }
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
}
</style>