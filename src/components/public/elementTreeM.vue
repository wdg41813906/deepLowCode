<template>
  <div class="element_tree_m">
    <div class="member_coolLeft_top element_left">
      <el-input
        placeholder="输入关键字进行搜索"
        v-model="filterText"
        class="search_tree"
      ></el-input>
    </div>
    <!-- node-key="depart_id" -->
    <el-tree
      :data="datalist"
      show-checkbox
      node-key="depart_id"
      :props="defaultProps"
      @check-change="handleCheckChange"
      @node-click="templateClcik"
      :filter-node-method="filterNode"
      :default-expanded-keys="exend"
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
      </span>
    </el-tree>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
// import GetTreeTree from './getTreeName'
// import GetTreeTreeM from './getTreeNameM'
import { debounce } from '@/utils/encryption'
export default {
  name: 'element_tree',
  props: {
    getdata: Array,
    departlist: Array,
    key: Number,
    exend: Array,
    is_colse: Boolean
  },
  // components: { GetTreeTree, GetTreeTreeM },
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
        disabled: 'IsDepart',
        depart_id: 'depart_id'
      },
      filterText: '',
      selectlist: [],
      list_select: [],
    }
  },
  methods: {
    templateClcik (data, checked, child) {

    },
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      // if (checked === true) {

      //   this.checkedId = data.depart_id;

      //   this.$refs.tree.setCheckedKeys([data.depart_id]);


      // } else {

      //   if (this.checkedId == data.depart_id) {

      //     this.$refs.tree.setCheckedKeys([data.depart_id]);

      //   }

      // }
      this.getCheckedNodes()





      // // console.log(data)
      // console.log(data, checked, indeterminate);
      // // this.getCheckedNodes()
      // if (checked) {
      //   console.log(data)
      //   let arr = [data.depart_id];
      //   console.log(arr)
      //   this.$refs.tree.setCheckedKeys(arr);
      //   // this.$emit('getTreelist', { label: [data] })
      //   this.getCheckedNodes()
      // } else {
      //   // this.$emit('getTreelist', { label: [] })
      //   this.getCheckedNodes()
      // }
    },
    getCheckedNodes () {
      let list = this.$refs.tree.getCheckedNodes()
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
      // if (this.filterText != '') {
      //   list = list.concat(this.list_select)
      //   selectlabellist = selectlabellist.concat(this.list_select)
      // }
      // if (this.filterText != '') {
      //   list = list.concat(this.list_select)

      // }
      this.$emit('getTreelist', { depart: list, label: selectlabellist })
    },

    getHalfCheckedNodes () {
      console.log(this.$refs.tree.getHalfCheckedNodes())
    },


    getTreeData () {
      // console.log(this.getdata)
      this.datalist = this.getdata

    },
    filterNode (value, data) {
      if (!value) return true;
      return data.Department.indexOf(value) !== -1;
    },
    searchid () {
      let payload = {
        corpid: this.$store.state.corpid,
        query_word: this.filterText,
        query_type: 1
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
        if (Object.keys(data.query_result).length != 0) {
          for (let i in data.query_result.user.userid) {
            datas.push({ id: data.query_result.user.userid[i], IsDepart: false, depart_id: data.query_result.usermap[data.query_result.user.userid[i]][0] + '-' + data.query_result.user.userid[i] })
          }
          this.datalist = datas
        } else {
          this.datalist = []
        }

        // let c = this.list_select.toString();

        // for (var i = 0; i < datas.length; i++) {
        //   if (c.indexOf(this.datalist[i].toString()) > -1) {
        //     for (var j = 0; j < this.list_select.length; j++) {
        //       if (this.datalist[i].id == this.list_select[j].id) {
        //         // this.datalist.push(attendUid[i]);
        //         this.$delete(this.list_select, j)
        //         break;
        //       }
        //     }
        //   }
        // }

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
    this.datalist = JSON.parse(JSON.stringify(this.getdata))
    console.log(this.departlist)
    // this.list_select = []
    // for (let i in this.departlist) {
    //   this.list_select.push({ id: this.departlist[i].toString(), IsDepart: false })
    // }

  },
  watch: {
    is_colse (val) {
      console.log(this.departlist)
      this.$refs.tree.setCheckedKeys(this.departlist)
      // if (val) {
      // this.list_select = []
      // for (let i in this.departlist) {
      //   this.list_select.push({ id: this.departlist[i].toString(), IsDepart: false })
      // }
      // }
    },
    getdata () {
      console.log('sdf')
      this.getTreeData()
      for (let i in this.departlist) {
        this.selectlist.push(this.departlist[i].depart_id)
        console.log(this.selectlist)
      }
      let _this = this
      setTimeout(function () {
        if (_this.departlist.length > 0) {
          // _this.getCheckedNodes()
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
      // console.log(val)
      // console.log(this.departlist)
      // let $this = this
      // // this.departlist = [...new Set(this.departlist)]
      // console.log(this.departlist)
      // this.$nextTick(function () {
      //   $this.$refs.tree.setCheckedKeys(this.departlist);
      // })
      // if (this.filterText == '') {
      //   this.list_select = []
      //   for (let i in this.departlist) {
      //     this.list_select.push({ id: this.departlist[i].toString(), IsDepart: false })
      //   }
      // }

    },

  },
  mounted () {
    this.$watch('filterText', debounce((newQuery) => {

      console.log(newQuery)
      if (newQuery != '') {
        this.searchid()
      } else {
        this.getTreeData()
      }

    }, 200))
    this.datalist = this.getdata
  }
}
</script>
<style lang="less">
.element_tree_m {
  .tree_name {
    display: inline-block;
    margin-left: 10px;
  }
  .element_left {
    .el-input {
      width: 100%;
    }
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
  .el-tree {
    background: transparent;
  }
  .el-tree-node__content > .el-checkbox {
    position: absolute;
    right: 10px;
  }
}
</style>