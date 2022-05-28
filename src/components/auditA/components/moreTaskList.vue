<template>
  <div class="form_list_more" v-if="my_is_more">
    <div class="top_form">
      <span class="name_span">{{ typename }}</span>
      <span class="right">
        <el-input
          placeholder="搜索任务"
          size="middle"
          v-model="searchval"
          style="width: 240px"
        ></el-input>
        <router-link
          :to="{ name: 'NewForm', query: { k: Date.now() } }"
          class="margin_l_15"
        >
          <el-button icon="el-icon-plus" type="primary" size="small"
            >新建任务</el-button
          >
        </router-link>
        <el-button
          size="small"
          icon="iconfont icon-cancel"
          class="margin_l_15"
          @click="close()"
          >返回</el-button
        >
      </span>
    </div>
    <!-- <el-alert title="不可关闭的 alert" type="success" :closable="false">
    </el-alert> -->
    <!-- <div class="el-alert el-alert--success is-light">sdfsdfsdf</div> -->
    <div class="type_div">
      <div class="bg_task" v-loading="loading">
        <div v-if="tasklist.length == 0" class="text_center">
          <img src="@/assets/img/none.png" alt="" />
          <p>暂无数据</p>
        </div>
        <div class="line_tr" v-for="items in tasklist" :key="items">
          <el-col :span="8" class="tem_row1">
            <img class="icon_left" :src="weburl + items.Icons.icon" alt="" />
            <div>
              <span class="flow-title p_over" :title="items.Title">{{
                items.Title
              }}</span>
              <br />
              <span class="flow-subtitle">
                {{
                  new Date(
                    +new Date(new Date(items.StartDate * 1000).toJSON()) +
                      8 * 3600 * 1000
                  )
                    .toISOString()
                    .replace(/T/g, " ")
                    .replace(/\.[\d]{3}Z/, "")
                    .slice(0, -3)
                    .split(" ")[0]
                }}至{{
                  new Date(
                    +new Date(new Date(items.EndDate * 1000).toJSON()) +
                      8 * 3600 * 1000
                  )
                    .toISOString()
                    .replace(/T/g, " ")
                    .replace(/\.[\d]{3}Z/, "")
                    .slice(0, -3)
                    .split(" ")[0]
                }}
              </span>
            </div>
            <div class="flow-line"></div>
          </el-col>

          <el-col :span="6" class="tem_row1">
            <div class="flow-permisson-row">
              <span class="flow-text">填报对象</span>
            </div>
            <div class="flow-permisson-row">
              <p class="p_over display_inline_block" style="max-width: 150px">
                <span v-for="(d, index) in items.ScopeInfo" :key="d">
                  <span class="flow_per">
                    {{ d.Department }}
                    <span v-if="index < items.ScopeInfo.length - 1">,</span>
                  </span>
                </span>
              </p>
              <p class="display_inline_block p_over">
                <!-- <span class="flow_per">
                    修改
                  </span> -->

                <el-link
                  :underline="false"
                  type="primary"
                  class="margin_l_5"
                  @click="editorDepartClick(items)"
                  style="font-size: 12px"
                  >修改</el-link
                >
              </p>
            </div>
          </el-col>
          <el-col :span="3" class="tem_row1">
            <div class="flow-permisson-row">
              <span class="flow-text">创建人</span>
            </div>
            <div class="flow-permisson-row">
              <span class="flow_per">
                {{ items.CreateUserName }}
                <GetTreeNameM :openid="items.CreateUserId"></GetTreeNameM>
              </span>
            </div>
          </el-col>
          <el-col :span="2" class="tem_row1">
            <div class="flow-permisson-row">
              <span class="flow-text">状态</span>
            </div>
            <div class="flow-permisson-row">
              <span>
                <span class="success flow_per" v-if="items.State == 0"
                  >进行中</span
                >
                <span class="flow_per warning" v-if="items.State == 1"
                  >未开始</span
                >
                <span class="flow_per danger" v-if="items.State == 2"
                  >关闭</span
                >
              </span>
            </div>
          </el-col>
          <el-col :span="5" class="tem_row1 text_right">
            <div class="form_operate">
              <el-link
                :underline="false"
                type="primary"
                @click="switchClick(items)"
                class="link_font"
              >
                <span
                  v-if="items.State == 1 || items.State == 2"
                  class="success"
                  >启动</span
                >
                <span v-else class="danger">停用</span>
              </el-link>
              <el-link
                :underline="false"
                type="primary"
                class="margin_l_5 link_font"
                @click="editorTaskClick(items.Code)"
                >编辑</el-link
              >
              <el-link
                :underline="false"
                type="primary"
                class="margin_l_5 link_font"
                @click="goTaskGClick(items)"
                >汇总</el-link
              >
              <el-link
                :underline="false"
                class="margin_l_5 link_font"
                type="primary"
                @click="delTaskClick(items)"
                >删除</el-link
              >
            </div>
          </el-col>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="pagination_div" v-if="!search_falg">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getUser } from '../../../utils/auth'
import { beforeEncrypt, debounce } from '../../../utils/encryption'
import DepartAlertA from '@/components/public/departAlertA.vue'
export default {
  name: 'form_list',
  props: {
    is_more: Boolean,
    typeid: Number,
    typename: String,
  },
  data () {
    return {
      loading: false,
      weburl: this.$store.state.weburl,
      my_is_more: false,
      active: [],
      num: [],
      is_add: false,
      tasklist: [],
      is_type_editor: false,
      conent_type: '',
      typeid: '',
      is_type_editor_item: false,
      conent_type_item: '',
      typeid_item: '',
      typelist: [],
      is_form_editor: false,
      form_code: '',
      form_title: '',
      departlist: [],
      is_depart: false,
      count: 0,
      pagesize: 10,
      currentPage: 1, //初始页
      searchval: '',
      search_falg: false,
      departlist_a: '',
      is_depart_a: false,
      depart_a_detail: {},
    }
  },
  methods: {
    goTaskGClick (item) {
      this.$router.push({ name: 'gatherTask', query: { id: beforeEncrypt(item.Code), name: item.Title } })
    },
    switchClick (items) {
      let $this = this
      let payload = {
        task_code: items.Code,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      if (items.State == 0) {
        payload['state'] = 2
      } else {
        payload['state'] = 0
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['switchtaskstate'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getalltemplateform(this.pagesize, this.currentPage)

      }).catch(err => {
        console.log(err)
      })
    },
    editorDepartClick (items) {
      this.departlist_a = items.ScopeInfo
      console.log(this.departlist_a)
      this.depart_a_detail = items
      this.is_depart_a = !this.is_depart_a
    },



    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
      this.getalltemplateform(this.pagesize, this.currentPage)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
      this.getalltemplateform(this.pagesize, this.currentPage)
    },
    delTaskClick (items) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          task_code: items.Code,
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid
        }

        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['deltask'] + '?signature=' + keyvalue;
        // return false;
        console.log(payload)
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getalltaskbyuserid()


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

    authorizationFormClick (item) {
      console.log(item)
      this.is_depart = true
      this.form_code = item.Code
      this.departlist = item.CooperationInfo
    },
    departBack (val) {
      this.is_depart = val
    },
    departSub (val) {
      console.log(val)
      console.log(this.form_code)
      let userids = []
      let $this = this
      for (let i in val) {
        delete val[i].Children
        delete val[i].ParentId
        // userids.push({ id: val[i].id, depart_id: val[i].depart_id })
      }
      let payload = {
        cooper: JSON.stringify(val),
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['updatecooper'] + '?signature=' + keyvalue;
      console.log(payload)
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '授权成功!'
        });
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    editorTaskClick (code) {
      this.$router.push({ name: 'EditorTask', query: { id: beforeEncrypt(code) } })
    },
    formEditorClick (item) {
      console.log(item)
      this.is_form_editor = true
      this.form_title = item.Title
      this.form_code = item.Code
    },
    typeItemEditorClick (item) {
      this.is_type_editor_item = true
      this.typeid_item = item.TypeId
      this.conent_type_item = item.Code
    },
    typeItemEditorSub () {
      let $this = this
      let payload = {
        type_id: this.typeid_item,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        code: this.conent_type_item
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edittype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_type_editor_item = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    typeEditorClick (item, content) {
      this.is_type_editor = true
      this.typeid = item
      this.conent_type = content
    },
    typeEditorSub () {
      let $this = this
      let payload = {
        id: this.typeid,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        content: this.conent_type
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editone'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_type_editor = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    delTypeClick (item) {
      console.log(item)
      let $this = this
      this.$confirm('删除分类后，给分类的表单会自动归类到【其他】中, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          id: item,
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          content: this.content
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['delone'] + '?signature=' + keyvalue;
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          // $this.is_additem = true
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getalltemplateform()

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



    getalltemplateform (pagesize, num) {
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        type_id: this.typeid,
        page_size: pagesize,
        page_index: num
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      this.loading = true
      let posturl = $this.$apilist['getalltaskbytypeid'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        this.loading = false
        console.log(data)
        this.tasklist = data.data.tasks
        this.count = data.data.count

      }).catch(err => {
        console.log(err)
      })
    },
    getallbytype () {
      let $this = this
      let payload = {
        typedesc: '规则类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallbytype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.typelist = data.data



      }).catch(err => {
        console.log(err)
      })
    },
    close () {
      this.my_is_more = false
    },
    searchClick (val) {
      let $this = this
      let payload = {
        title: val,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['selfcreatesearch'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.tasklist = data.data
        this.search_falg = true


      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    // this.getalltemplateform()
    // this.getallbytype()
  },
  created () {
    this.$watch('searchval', debounce((newQuery) => {
      if (newQuery == '') {
        this.search_falg = false
        this.getalltemplateform(this.pagesize, this.currentPage)
      } else {
        this.searchClick(newQuery)
      }

    }, 200))
  },
  watch: {
    is_more (val) {
      this.my_is_more = val
      this.searchval = ''
      if (val) {
        this.getalltemplateform(this.pagesize, this.currentPage)

      }
    },
    my_is_more (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style lang="less">
.form_list_more {
  .pagination_div {
    text-align: center;
  }
  .type_div {
    min-height: 300px;
  }
  .name_span {
    font-size: @font_16;
    font-weight: bold;
  }
  .display_none {
    display: none;
  }
  .display_block {
    display: inline-block;
  }
  .title_form:hover {
    border-bottom: @border;
  }
  .type_div {
    margin-top: 20px;
    // cursor: pointer;
    .type_num_span {
      // display: inline-block;
      font-size: 14px;
      color: #999;
    }
    .type_editor_text {
      margin-left: 10px;
    }
    .del_span {
      color: #f56c6c;
    }
  }

  .title_form {
    border-bottom: 1px solid transparent;
    font-size: @font_16;
    margin-left: 10px;
    padding-bottom: 10px;
  }
  .operation {
    width: 140px;
    display: none;
    border: @border;
    margin-bottom: 0;
    margin-top: 40px;
    border-radius: 5px;
    font-size: @font_12;
    // padding: 3px 5px;
    > li {
      cursor: pointer;
      border-right: @border;
      padding: 5px 15px;
    }
    > li:hover {
      span {
        color: @color;
      }
    }
    > li:last-of-type {
      border-right: none;
    }
    .dropdown_div_active {
      display: block;
      position: relative;
      width: 50px;
    }
    .dropdown_div {
      display: none;
      position: relative;
      width: 50px;
    }
    .dropdown_ul {
      left: -14px;
      position: absolute;
      z-index: 100;
      background: @white;

      width: 100px;
      -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      li {
        padding: 5px 15px;
        line-height: 25px;
      }
      li:hover {
        background: #ecf5ff;
        color: @color;
      }
    }
  }
}
</style>