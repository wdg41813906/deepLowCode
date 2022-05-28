<template>
  <div class="memberLift">
    <div class="member_coolLeft_top" @click="hidePanel">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        class="left_input"
        @input="searchClick()"
      >
      </el-input>
    </div>

    <!-- <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      node-key="id"
      :filter-node-method="filterNode"
      :default-expanded-keys="expanded"

      ref="tree"
      ><span class="custom-tree-node" style="width:100%" slot-scope="{ node }">
        <span @click="addressclick(node)"
          ><span class="icon_tree" style="width:18px;height:18px;"></span
          >{{ node.label }}
        </span>
        <span
          class="icon jstree-contextmenu"
          style="width:18px;height:18px;"
          @click.stop="menuClick(node)"
        ></span>
      </span>
    </el-tree> -->
    <!-- @node-drag-end="handleDragEnd"
      draggable -->
    <el-tree
      v-if="isSearch == false"
      class="filter-tree"
      style="max-height: 752px; overflow: auto"
      :data="data"
      :props="defaultProps"
      node-key="id"
      :filter-node-method="filterNode"
      :default-expanded-keys="expanded"
      :expand-on-click-node="false"
      ref="tree"
      ><span class="custom-tree-node" style="width: 100%" slot-scope="{ node }">
        <div @click="addressclick(node)">
          <span
            :title="node.label"
            style="
              width: 130px;
              overflow: hidden;
              whie-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
              word-wrap: normal;
              display: inline-block;
            "
            ><span class="icon_tree" style="width: 18px; height: 18px"></span
            >{{ node.label }}
          </span>
          <span
            class="icon jstree-contextmenu"
            style="width: 18px; height: 18px"
            @click.stop="menuClick(node)"
          ></span>
        </div>
      </span>
    </el-tree>
    <div v-if="isSearch == true">
      <div>
        <p class="ww_searchResult_title">部门</p>
        <el-tree
          v-if="isSearch == true"
          class="filter-tree"
          style="max-height: 752px; overflow: auto"
          :data="searchlist.depart"
          :props="defaultProps"
        >
          <span
            class="custom-tree-node"
            style="width: 100%"
            slot-scope="{ node }"
          >
            <div @click="addressclick(node)">
              <span
                :title="node.label"
                style="
                  width: 130px;
                  overflow: hidden;
                  whie-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  word-wrap: normal;
                  display: inline-block;
                "
                ><span
                  class="icon_tree"
                  style="width: 18px; height: 18px"
                ></span
                >{{ node.label }}
              </span>
              <span
                class="icon jstree-contextmenu"
                style="width: 18px; height: 18px"
                @click.stop="menuClick(node)"
              ></span>
            </div>
          </span>
        </el-tree>
      </div>
      <div>
        <p class="ww_searchResult_title">人员</p>

        <el-tree
          v-if="isSearch == true"
          class="filter-tree"
          style="max-height: 752px; overflow: auto"
          :data="searchlist.user"
          :props="defaultPropsUser"
        >
          <span
            class="custom-tree-node"
            style="width: 100%"
            slot-scope="{ node }"
          >
            <div @click="userClick(node)">
              <span
                :title="node.data.Name"
                style="
                  width: 130px;
                  overflow: hidden;
                  whie-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  word-wrap: normal;
                  display: inline-block;
                "
                ><span
                  class="icon_tree"
                  style="width: 18px; height: 18px"
                ></span
                >{{ node.data.Name }}
              </span>
              <span
                class="p_over"
                style="
                  width: 95px;
                  display: inline-block;
                  color: #7e7e7e;
                  font-size: 13px;
                "
              >
                <span class="p_over" v-for="item in node.data.des" :key="item"
                  >{{ item }};</span
                ></span
              >
              <!-- <span
                class="icon jstree-contextmenu"
                style="width: 18px; height: 18px;"
                @click.stop="menuClick(node)"
              ></span> -->
            </div>
          </span>
        </el-tree>
      </div>
    </div>
    <div
      class="operation-option"
      :style="{ left: clientX, top: clientY }"
      v-if="showlist"
    >
      <ul>
        <li
          class="option"
          @click.stop="addDepart"
          v-if="this.selectnode.data.id == 1 || this.selectnode.data.id == '1'"
        >
          添加子部门
        </li>

        <li class="option" @click="editorDepart">修改名称</li>
        <li
          class="option"
          @click="delDepart"
          v-if="this.selectnode.data.id != 1 && this.selectnode.data.id != '1'"
        >
          删除
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'memberLift',
  props: {
    departlist: Array
  },
  data () {
    return {
      searchlist: {},
      isSearch: false,
      showlist: false,
      clientX: '',
      clientY: '',
      filterText: '',
      data: this.departlist,
      selectFile: {},
      defaultProps: {
        children: 'Children',
        label: 'Department',
        icon: 'icon'
      },
      defaultPropsUser: {
        children: 'Children',
        label: 'n',
        icon: 'icon'
      },
      selectnode: {},
      expanded: [1]

    }
  },
  methods: {
    searchClick () {
      console.log(this.filterText)
      if (this.filterText.trim() == '') {
        console.log('sss')
        this.isSearch = false
        console.log(this.selectFile)

        this.getalldepartAfter()
        console.log('------------------')
        // this.selectFile = { data: { depaart_id: 1, id: 1, ParentId: 0, } }

        return false;
      }
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        query_data: this.filterText,

      }
      console.log(payload)
      this.loading = true
      let createvalue = this.$createObj(payload);
      let posturl = this.$apilist['searchuser'];
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.isSearch = true
        $this.loading = false
        this.searchlist = data.data
        console.log(data)
        // return false

      })
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log(ev)
      console.log(draggingNode)
      console.log(dropNode)
      let _this = this
      if (dropType == 'none') {
        return false;
      }
      if (dropType == 'before' || dropType == 'after') {
        if (dropNode.id == 1) {
          _this.getalldepart()
          return false
        }
      }
      let payload = {
        corpid: this.$store.state.corpid,
        department_id: draggingNode.data.depart_id,
        parent_id: dropNode.data.depart_id
      }

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['editdepartment'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        // _this.departlist = data.data
        // _this.getalldepart()

      }).catch(err => {
        console.log(err)
      })

    },
    // allowDrop (draggingNode, dropNode, type) {
    //   if (dropNode.data.label === '二级 3-1') {
    //     return type !== 'inner';
    //   } else {
    //     return true;
    //   }
    // },
    // allowDrag (draggingNode) {
    //   console.log(draggingNode)
    //   return 1;
    // },
    delDepart () {
      console.log(this.selectnode)
      if (this.selectnode.id == 1) {
        this.$message({
          type: 'error',
          message: '不允许删除根部门'
        });
      }
      this.$confirm('是否删除 ' + this.selectnode.label + ' 部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          corpid: this.$store.state.corpid,
          department_id: this.selectnode.data.depart_id
        }

        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['deldepartment'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(data => {
          console.log(data)
          // _this.departlist = data.data
          _this.getalldepart([this.selectnode.data.ParentId])
          _this.$message({
            type: 'success',
            message: '删除部门成功！'
          });
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    editorDepart () {
      console.log(this.selectnode)
      this.$prompt('部门名称', '修改名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.selectnode.label,
        beforeClose (action, instance, done) {
          if (action == 'cancel') {
            done()
            return false
          }
          if (instance.$data.inputValue == null || instance.$data.inputValue.trim() == '') {
            this.$message({
              type: 'error',
              message: '请输入部门名称'
            });
          } else {
            console.log(done)
            done()
          }

          // done();
        },

      }).then(({ value }) => {
        let payload = {
          corpid: this.$store.state.corpid,
          department: value,
          department_id: this.selectnode.data.depart_id,
          parent_id: this.selectnode.data.ParentId,
        }

        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['editdepartment'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(data => {
          console.log(data)
          // _this.departlist = data.data
          _this.$message({
            type: 'success',
            message: '修改成功！'
          });
          _this.getalldepart([this.selectnode.data.ParentId])
        }).catch(err => {
          console.log(err)
        })

      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // });
      });

      this.hidePanel()
    },
    addDepart () {
      console.log(this.selectnode)
      this.$prompt('部门名称', '新建部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose (action, instance, done) {
          if (action == 'cancel') {
            done()
            return false
          }
          if (instance.$data.inputValue == null || instance.$data.inputValue.trim() == '') {
            this.$message({
              type: 'error',
              message: '请输入部门名称'
            });
          } else {
            console.log(done)
            done()
          }

          // done();
        },

      }).then(({ value }) => {
        let payload = {
          corpid: this.$store.state.corpid,
          department: value,
          parentid: this.selectnode.data.depart_id
        }

        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['adddepartment'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(data => {
          console.log(data)
          // _this.departlist = data.data
          _this.$message({
            type: 'success',
            message: '添加成功！'
          });
          _this.getalldepart([this.selectnode.data.ParentId, this.selectnode.data.depart_id])
        }).catch(err => {
          console.log(err)
        })

      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // });
      });

      this.hidePanel()
    },
    hidePanel () {
      console.log(111)
      this.showlist = false
    },
    menuClick (node) {
      console.log('1')
      var e = event || window.event;
      console.log(e)
      this.selectnode = node
      this.showlist = true
      this.clientX = e.clientX + 10 + 'px'
      this.clientY = e.clientY - 50 + 'px'
      // return { 'x': e.clientX, 'y': e.clientY }
    },
    filterNode (value, data) {
      console.log(data)
      console.log(value)
      if (!value) return true;
      return data.Department.indexOf(value) !== -1;
    },
    addressclick (node) {
      console.log(node)
      this.selectFile = node
      this.$emit('selectdepart', node)
    },
    userClick (node) {
      console.log(node)
      // this.selectFile = node
      this.$emit('selectuser', node)
    },
    getalldepartAfter () {
      console.log("sdf")
      let payload = {
        corpid: this.$store.state.corpid
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      let _this = this
      console.log('0000000000000')
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.data = data.data
        _this.$nextTick(function () {
          _this.expanded = [1]
          _this.selectFile = { data: { id: data.data[0].id, Department: data.data[0].Department, depart_id: data.data[0].depart_id } }
          _this.$emit('selectdepart', this.selectFile)
        })
      }).catch(err => {
        console.log(err)
      })

    },
    getalldepart () {
      console.log("sdf")
      let payload = {
        corpid: this.$store.state.corpid
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      let _this = this
      console.log('0000000000000')
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.data = data.data
        _this.$nextTick(function () {
          _this.expanded = [1]
          _this.selectFile = { data: { id: data.data[0].id, Department: data.data[0].Department, depart_id: data.data[0].depart_id } }
          _this.$emit('selectdepart', this.selectFile)
        })
      }).catch(err => {
        console.log(err)
      })

    },
    getalldepart (expanded) {
      let payload = {
        corpid: this.$store.state.corpid
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {

        _this.data = data.data
        _this.$nextTick(function () {
          _this.expanded = [1].concat(expanded)
        })
      }).catch(err => {
        console.log(err)
      })

    }

  },
  watch: {
    departlist (val) {
      this.data = val
      let _this = this
      this.$nextTick(function () {
        _this.expanded = [1]
      })

    },
    filterText (val) {
      // this.$refs.tree.filter(val);
    }

  },
  mounted () {
    this.$nextTick(() => {
      document.querySelector('body').addEventListener('click', this.hidePanel);
    })
  }
}
</script>

<style scoped>
.ww_searchResult_title {
  color: #787878;
  height: 30px;
  line-height: 30px;
  margin-left: 20px;
  padding-top: 5px;
}

.icon {
  background: url(~@/assets/img/righticon.png) no-repeat;
  width: 18px;
  /* height: 18px; */
  display: inline-block;
  vertical-align: top;
  float: right;
}
.operation-option {
  position: absolute;
  z-index: 1000;
  line-height: 30px;
  border: 1px solid #ccc;
  background-color: #fff;
  -webkit-box-shadow: 0 0 10px #ccc;
  box-shadow: 0 0 10px #ccc;
  padding: 2px 0;
  /* right: 80%; */
  /* top: 50%; */
  /* width: 50px; */
  /* margin-top: -30px; */
}
.operation-option .option {
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  padding: 0 20px 0 20px;
  cursor: pointer;
  white-space: nowrap;
  display: block;
  padding: 4px 9px;
  min-width: 80px;
  text-decoration: none;
  width: auto;
  color: #000;
}
.option:hover {
  background: #4a77ac;
  color: #fff;
}
.member_coolLeft_top {
  border-bottom: 1px solid #e4e6e9;
  padding: 10px;
}
.el-input__inner {
  font-size: 14px !important;
}
.el-input__inner {
  font-size: 1rem;
  height: 30px;
  border: 1px solid #b4bec8;
  border-radius: 0;
  /* padding: 3px 28px 3px 26px; */
}
.el-tree-node:focus > .el-tree-node__content {
  background: #4a77ac;
  color: #fff;
}
.el-tree {
  margin-top: 10px;
  padding-left: 8px;
  font-size: 15px;
}
.icon_tree {
  background: url(../../../assets/img/icon_folder_blue.png) no-repeat;
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
</style>
