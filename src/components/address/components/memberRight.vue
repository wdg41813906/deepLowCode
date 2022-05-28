<template>
  <div class="memberRight">
    <div v-if="!add_show && !editor_show && !look_show">
      <div class="member_colRight_head">
        <span class="member_right_title">{{ fileName }} </span>
      </div>
      <div class="operation_member">
        <el-row>
          <el-col :span="18">
            <el-button size="small" @click="addshow()">添加成员</el-button>

            <el-button class="margin_l_5" size="small" @click="delClick()"
              >删除</el-button
            >
          </el-col>
          <el-col :span="6">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="searchval"
              class="left_input"
              @input="searchUserClick()"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="js_has_member">
        <!-- <div class="ww_operationBar1">
          <a href="javascript:;" class="qui_btn ww_btn" @click="addshow"
            >添加成员</a
          >
          <router-link
            :to="{
              name: 'importlist',
              query: { name: fileName, k: selectFile.data.DepartId },
            }"
            class="qui_btn ww_btn"
            >批量导入</router-link
          >
          <a href="javascript:;" class="qui_btn ww_btn" @click="delClick"
            >删除</a
          >
        </div> -->
        <!-- <div class="ww_fixedTip">
          云版系统仅支持5000人，超过人数系统将运行缓慢，如需支持更多人数，请联系我们
          <b>13898487935</b>！
        </div> -->
        <div class="member_colRight_table">
          <el-table
            style="width: 100%"
            :data="userlist"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          >
            <el-table-column type="selection" width="65"></el-table-column>
            <el-table-column
              v-for="title in titles"
              :prop="title.prop"
              :label="title.label"
              :key="title.label"
            >
            </el-table-column>
            <el-table-column label="部门" prop="Department">
              <!-- <template slot-scope="prop">
                <span v-for="item in prop.row.des" :key="item"
                  >{{ item }};</span
                >
              </template> -->
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="prop">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p @click="editorClick(prop.row)">编辑</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="deloneClick(prop.row)">删除</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curr_page"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            :total="total_sum"
          >
          </el-pagination> -->
        </div>
        <div class="pagination_div">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curr_page"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_sum"
          >
          </el-pagination>
          <!-- <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="current_change"
          >
          </el-pagination> -->
        </div>
      </div>
    </div>

    <add-member
      :selectFile="selectFile"
      :add_show="add_show"
      @backadd="backadd"
      v-if="add_show"
    ></add-member>
    <editor-member
      :selectFile="selectFile"
      :userdetail="userdetail"
      :editor_show="editor_show"
      @backadd="backeditor"
    ></editor-member>
    <!-- <look-member
      :selectFile="selectFile"
      :userdetail="userdetail"
      :editor_show="look_show"
      @backadd="backlook"
    ></look-member> -->
  </div>
</template>

<script>
import AddMember from './addmember'
import EditorMember from './membereditor'
// import LookMember from './Lookeditor'
export default {
  props: {
    selectFile: Object
  },
  components: { AddMember, EditorMember, },
  data () {
    return {
      searchtext: '',
      searchval: '',
      loading: false,
      userdetail: {},
      dellist: [],
      add_show: false,
      editor_show1: false,
      editor_show: false,
      look_show: false,
      look_show1: false,
      userlist: [],
      fileName: '',

      data: [],
      isSearch: false,
      titles: [
        {
          prop: 'UserId',
          label: '工号'
        }, {
          prop: 'Name',
          label: '用户名'
        },
        {
          prop: 'Mobile',
          label: '手机号'
        }
      ],
      titles_search: [
        {
          prop: 'UserId',
          label: '账户'
        }, {
          prop: 'Name',
          label: '用户名'
        },
        {
          prop: 'Mobile',
          label: '手机号'
        }
      ],
      filters: [
        {
          prop: ['UserId', 'Name', 'Mobile', 'm'],
          value: ''
        }
      ],

      typelen: 0,
      total_sum: 0,
      pagesize: 10,
      curr_page: 1,
    }
  },
  methods: {
    searchUserClick () {
      console.log(this.searchval)
      if (this.searchval.trim() == '') {
        this.curr_page = 1
        this.isSearch = false
        this.getuserlist(this.curr_page, this.pagesize)
        return false;
      }
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        query_data: this.searchval,
        depart_id: parseInt(this.selectFile.data.depart_id)
      }
      console.log(payload)
      this.loading = true
      let createvalue = this.$createObj(payload);
      let posturl = this.$apilist['searchuser'];
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        $this.loading = false
        console.log(data)
        this.isSearch = true
        this.userlist = data.data.user
        // return false

      })
    },
    downexcel_depart () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
      }
      // console.log(payload)
      this.downloading = true
      let createvalue = this.$createObj(payload);
      let posturl = this.$apilist['exportalluser'];
      this.$server.post(posturl, createvalue['fd']).then(data => {
        $this.downloading = false
        console.log(data)
        // return false
        window.location.href = $this.$store.state.imgurl + data['data'];

      })
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.getuserlist(this.curr_page, this.pagesize)
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.curr_page = currentPage;
      this.getuserlist(this.curr_page, this.pagesize)
      console.log(this.curr_page)  //点击第几页
    },
    handleUserList () {
      this.$http.get('http://localhost:3000/userList').then(res => {  //这是从本地请求的数据接口，
        this.userList = res.body
      })
    },
    delClick () {
      if (this.dellist.length == 0) {
        this.$alert('请选择要删除的人员！', '提示', {
          confirmButtonText: '确定',

        });

        return false;
      }
      let userlist = []
      for (let i = 0, max = this.dellist.length; i < max; i++) {
        userlist.push(this.dellist[i].UserId)
      }
      this.$confirm('此操作将永久删除选中人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          corpid: this.$store.state.corpid,
          userids: JSON.stringify(userlist),
          self: this.$store.state.userid,
        }

        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['deluserinfos'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(() => {
          _this.curr_page = 1
          _this.getuserlist(1, this.pagesize)
          _this.$message({
            type: 'success',
            message: '删除成功!'
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
    deloneClick (item) {

      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          corpid: this.$store.state.corpid,
          userid: item.UserId,
          self: this.$store.state.userid,
        }
        console.log(payload)
        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['deloneuser'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(() => {
          _this.curr_page = 1
          _this.getuserlist(1, this.pagesize)
          _this.$message({
            type: 'success',
            message: '删除成功!'
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
    lookClick (detail) {
      this.userdetail = detail
      this.look_show1 = true
      this.look_show = !this.look_show
    },
    backlook (val) {
      this.look_show = val
      this.getuserlist(this.curr_page, this.pagesize)
    },
    editorClick (detail) {
      this.userdetail = detail
      this.editor_show1 = true
      this.editor_show = !this.editor_show
    },
    backeditor (val) {
      this.editor_show = val
      this.getuserlist(this.curr_page, this.pagesize)
    },
    backadd (val) {
      console.log('sdfsdfsdfsd----')
      this.add_show = val
      this.getuserlist(this.curr_page, this.pagesize)
    },
    addshow () {
      console.log(this.add_show)
      this.add_show = !this.add_show
    },
    handleSelectionChange (val) {
      console.log(val)
      this.dellist = val
    },
    current_change (val) {
      console.log(val)
      this.curr_page = val
      this.getuserlist(this.curr_page, this.pagesize)
    },
    getCount () {
      this.loading = true
      let _this = this;
      let payload = {
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['admingetmessagecount'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.loading = false
        _this.total_sum = data['Data'].Count
        // _this.grouplist = data['data']
        // _this.column = data['data']
        // _this.selectedcolumn = { text: data['data'][0].typename, value: data['data'][0].type_code }

      })
    },
    searchClick () {
      if (this.searchtext == '') {
        this.$alert('请填写搜索内容！', '提示', {
          confirmButtonText: '确定',

        });

        return false;
      }
      this.curr_page = 1
      this.searchuser(this.curr_page)
    },
    searchuser (page) {
      this.loading = true
      console.log(this.selectFile)
      let payload = {
        corpid: this.$store.state.corpid,
        department_id: parseInt(this.selectFile.data.depart_id),
        content: this.searchtext,
        page_index: page,
        pagesize: 10
      }

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['searchuser'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        this.loading = false
        console.log('------------------')
        console.log(data)
        // _this.departlist = data.data
        this.total_sum = data.data.count
        console.log(data.data.count)
        if (data.data == null && page > 1) {
          _this.getuserlist(page - 1)
        } else {
          console.log('sdfsdfsdfds')
          console.log(data.data)
          console.log(data.data.length)
          _this.userlist = data.data
          _this.typelen = data.data.length
        }

      }).catch(err => {
        console.log(err)
      })

    },
    getuserlist (page, pagesize) {
      this.loading = true
      console.log(this.selectFile)
      let payload = {
        corpid: this.$store.state.corpid,
        department_id: parseInt(this.selectFile.data.depart_id),
        page_index: page,
        page_size: pagesize
      }

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['getalluserinfobydepartid'] + '?signature=' + keyvalue;
      let _this = this
      console.log(payload)
      // return false;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        this.loading = false
        console.log('------------------')
        console.log(data)
        // _this.departlist = data.data
        this.total_sum = data.data.count
        console.log(data.data.count)
        if (data.data.users == null || data.data.users == []) {
          _this.userlist = []
        } else {
          _this.userlist = data.data.users
        }
        console.log(_this.userlist)
        // if (data.data == null && page > 1) {
        //   _this.getuserlist(page - 1)
        // } else {
        //   _this.userlist = data.data
        //   _this.typelen = data.data.length
        // }

      }).catch(err => {
        console.log(err)
      })

    }
  },
  mounted () {
    // console.log(this.curr_page)
    // this.getuserlist(this.curr_page)
    // this.getuserlist()
  },
  watch: {
    selectFile: function (val) {
      this.curr_page = 1
      console.log(val)
      this.fileName = val.data.Department
      console.log(val.data.Department)
      // this.getuserlist(this.curr_page)
      this.add_show = false
      this.editor_show = false
      this.getuserlist(this.curr_page, this.pagesize)
    }
  }
}
</script>

<style lang="less">
.memberRight {
  .operation_member {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: @border;
  }
}
.pagination_div {
  text-align: center;
  margin-top: 20px;
}
.member_colRight_head {
  margin-bottom: 10px;
}
.member_right_title {
  color: #000;
  font-size: 16px !important;
  line-height: 28px;
}
.ww_operationBar1 {
  padding: 6px 10px;
  background: #dfe9f5;
  border-bottom: 1px solid #bdc9d6;
}
.ww_fixedTip {
  padding: 6px 10px;
  background-color: #fffae2;
  color: #000;
  line-height: 30px;
  border-bottom: 1px solid #e4e6e9;
  position: relative;
  margin-bottom: 20px;
  /* text-align: center; */
}
</style>
