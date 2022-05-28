<template>
  <div class="fill_index">
    <div class="fill_top flex">
      <div class="flex_item">
        <div class="left_fill_top_content" v-if="task_detail.Code != ''">
          <div class="left_content_top">
            <p class="p_over task_name_p" :title="task_detail.Title">
              {{ task_detail.Title }}
            </p>
            <p class="flow_per flow_time">
              {{
                new Date(
                  +new Date(new Date(task_detail.StartDate).toJSON()) +
                    8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
                  .split(" ")[0]
              }}至{{
                new Date(
                  +new Date(new Date(task_detail.EndDate).toJSON()) +
                    8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
                  .split(" ")[0]
              }}
            </p>
            <p class="flow_per p_over_2 remark_p">
              {{ task_detail.TRemark }}
            </p>
          </div>
          <div class="left_user">
            <el-row>
              <el-col :span="12">
                <span class="user_title">填报人信息</span>
              </el-col>
              <el-col :span="12" class="text_right">
                <i class="el-icon-edit" @click="editorUserClick()"></i>
              </el-col>
              <el-col :span="12">
                <span class="other_span">工号：</span>
                {{ task_detail.UserId }}
              </el-col>
              <el-col :span="12">
                <span class="other_span">姓名：</span>{{ task_detail.Name }}
              </el-col>
              <el-col :span="12">
                <span class="other_span">职位：</span>
                <span v-if="task_detail.Position == 0">无</span>
                <span v-else>
                  {{ task_detail.PositionInfo }}
                </span>
              </el-col>
              <el-col :span="12">
                <span class="other_span">职称：</span
                >{{ task_detail.UserState }}
                <span v-if="task_detail.Career == 0">无</span>
                <span v-else>
                  {{ task_detail.CareerInfo }}
                </span>
              </el-col>
              <!-- <el-col :span="12">
                <span class="other_span">状态：</span>
                <span v-if="task_detail.State == 0">普通填报</span>
                <span v-else>首次填报</span>
              </el-col> -->
              <el-col :span="12">
                <span class="other_span">学院：</span>
                <span
                  v-if="
                    task_detail.Department == '' ||
                    task_detail.Department == null
                  "
                  >未设置</span
                >
                <span v-else>{{ task_detail.Department }}</span>
              </el-col>
              <!-- <el-col :span="12">
                <span>邮箱：</span>{{ task_detail.Email }}
              </el-col>
              <el-col :span="12">
                <span>手机号：</span>{{ task_detail.Mobile }}
              </el-col> -->
            </el-row>
          </div>
          <div class="left_btn text_center">
            <el-button type="primary" @click="gourl(task_detail.Code)"
              >查看详情</el-button
            >
          </div>
        </div>
        <div class="left_fill_top_content text_center" v-else>
          <img src="@/assets/img/other_none.png" width="130px" alt="" />
          <p>当前暂无申报任务</p>
        </div>
      </div>
      <div class="flex_item">
        <div class="right_fill_top_content">
          <p class="audit_name_p">工作量数据审核情况</p>
          <div class="flex audit_content">
            <div class="flex_item">
              <p class="audit_num">{{ main_data.DenyCount }}</p>
              <p class="audit_font">
                已退回<span
                  class="other_font cursor"
                  @click="gourlTwo()"
                  v-if="task_detail.Code != ''"
                  >(查看)</span
                >
              </p>
            </div>
            <div class="flex_item">
              <p class="audit_num">{{ main_data.PassedCount }}</p>
              <p class="audit_font">已通过</p>
            </div>
            <div class="flex_item">
              <p class="audit_num">{{ main_data.ReviewingCount }}</p>
              <p class="audit_font">
                审核中<span
                  class="other_font cursor"
                  @click="gourlTwo()"
                  v-if="task_detail.Code != ''"
                  >(查看)</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fill_middle">
      <p class="title_fill_middle">工作量申报历史</p>

      <div class="history_div">
        <!-- v-if="historylist.length == 0" -->
        <div class="text_center" v-if="historylist.length == 0">
          <img src="@/assets/img/none.png" alt="" />
          <p>暂无数据</p>
        </div>
        <ul class="history_list">
          <li v-for="item in historylist" :key="item.Code">
            <i class="el-icon-guide"></i>
            <a @click="gourlEnd(item)"
              >{{ item.Title }}(
              {{
                new Date(
                  +new Date(new Date(item.StartDate).toJSON()) + 8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
                  .split(" ")[0]
              }}至
              {{
                new Date(
                  +new Date(new Date(item.EndDate).toJSON()) + 8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
                  .split(" ")[0]
              }})</a
            >
            <span>
              {{
                new Date(
                  +new Date(new Date(item.CreateTime).toJSON()) +
                    8 * 3600 * 1000
                )
                  .toISOString()
                  .replace(/T/g, " ")
                  .replace(/\.[\d]{3}Z/, "")
                  .slice(0, -3)
                  .split(" ")[0]
              }}
            </span>
          </li>
        </ul>
        <div class="pagination_div text_center" v-if="historylist.length > 0">
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
    </div>
    <EditorUserDetail
      :is_add="is_add"
      :detail="task_detail"
      @back="editorUserBack"
      @sub="editorUserSub"
    ></EditorUserDetail>
  </div>
</template>
<script>
import EditorUserDetail from './components/editorUserDetail'
// import { getUser, setUser, removeUser } from '@/utils/auth_user';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
export default {
  name: 'fill_index',
  components: { EditorUserDetail },
  data () {
    return {
      count: 0,
      pagesize: 10,
      currentPage: 1, //初始页
      historylist: [],
      task_detail: {},
      is_add: false,
      main_data: {},
      task_code: '',
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      filters: [
        {
          prop: 'user_name',
          value: ''
        }
      ]
    }
  },
  methods: {

    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
      this.historytask(this.pagesize, this.currentPage)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
      this.historytask(this.pagesize, this.currentPage)
    },
    gourl (code) {
      this.$router.push({ name: 'formlistFill', query: { id: beforeEncrypt(this.task_detail.Code) } })
    },
    gourlTwo () {
      this.$router.push({ name: 'formlistFill', query: { id: beforeEncrypt(this.task_detail.Code), other: 1 } })
    },
    gourlEnd (item) {
      console.log(item)
      let other = JSON.parse(JSON.stringify(item))

      console.log(other.Title)
      // console.log(item.Title)
      this.$router.push({ name: 'endlistFill', query: { id: beforeEncrypt(other.Code), name: beforeEncrypt(other.Title) } })
    },
    editorUserClick () {
      this.is_add = true
    },
    editorUserBack (val) {
      this.is_add = val
    },
    editorUserSub () {
      this.getactivetask()
    },
    getactivetask () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getactivetask'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.task_detail = data.data
        this.task_code = data.data.Code
        this.maincountinfo()
      }).catch(err => {
        console.log(err)
      })
    },
    historytask (pagesize, num) {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,

        page_size: pagesize,
        page_index: num
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['historytask'] + '?signature=' + keyvalue;
      // return false;
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        this.historylist = data.data.data
        this.count = data.data.count

        // if (data.data != null) {
        //   this.tasklist = data.data
        //   this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
        //   console.log(Object.keys(data.data))
        // } else {
        //   this.tasklist = {}
        //   this.task_type_list = []
        // }


      }).catch(err => {
        console.log(err)
      })
    },
    maincountinfo () {
      let $this = this
      let code = this.$route.query.id
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: this.task_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['maincountinfo'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.main_data = data.data

      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.getactivetask()
    this.historytask()

  }
}
</script>
<style lang="less">
.fill_index {
  min-width: 1300px;
  // border: 1px solid @color;
  // height: 98%;
  .fill_top {
    height: 450px;
    padding: 60px 30px;
    background: url("../../assets/img/background_4_1.jpg") center center
      no-repeat;
    background-size: cover;
    .left_fill_top_content {
      width: 600px;
      height: 340px;
      background: @white;
      margin: auto;
      padding: 30px;
      .left_content_top {
        // height: 110px;
        margin-bottom: 15px;
      }
      .left_user {
        border: @border;
        padding: 10px;
        .el-col {
          height: 20px;
          line-height: 20px;
          span.other_span {
            font-weight: bold;
            display: inline-block;
            width: 50px;
            text-align: right;
          }
          .user_title {
            font-weight: bold;
            display: inline-block;
            width: 50px;
            text-align: left;
            width: 80px;
          }
          .el-icon-edit {
            color: @color;
            cursor: pointer;
            font-size: @font_16 !important;
          }
        }
        margin-bottom: 20px;
      }
      .task_name_p {
        font-size: @font_16;
        font-weight: bold;
        padding-left: 5px;
        border-left: 3px solid @color;
      }
      .flow_per {
        color: #858585;
        margin-left: 8px;
      }
      .remark_p {
        height: 32px;
      }
      .flow_time {
        height: 15px;
        line-height: 15px;
        margin-top: 20px;
        margin-bottom: 10px !important;
      }
    }
    .right_fill_top_content {
      width: 600px;
      height: 200px;
      background: @white;
      margin: auto;
      padding: 30px 20px;
      .audit_name_p {
        font-size: @font_16;
        font-weight: bold;
        padding-left: 5px;
        border-left: 3px solid @color;
      }
      .audit_content {
        width: 100%;
        justify-content: center;
        align-items: center;
        background: #d9ecff;
        height: 80px;
        margin-top: 20px;
        div {
          // flex: 1;
        }
        .flex_item {
          text-align: center;
          width: 33%;
          // background: @color;
          border-right: 2px solid @color;
          // box-shadow: -5px 0px 0 0 deeppink;
        }

        .flex_item:last-of-type {
          border-right: none;
        }
        .audit_num {
          color: @color;
          font-size: @font_16;
          font-weight: bold;
        }
        .audit_font {
          margin-top: 5px;
          .other_font {
            color: #c498e4;
          }
        }
      }
    }
  }
  .flex {
    display: flex;
  }
  .flex_item {
    width: 50%;
  }
  .fill_middle {
    min-height: 300px;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: @white;
    .title_fill_middle {
      font-size: @font_16;
      // height: 16px;
      // line-height: 16px;
      font-weight: bold;
      padding-left: 5px;
      border-left: 3px solid @color;
      margin-bottom: 30px !important;
    }
  }
  .history_list {
    background: @white;
    li {
      height: 25px;
      line-height: 25px;
      display: flex;
      justify-items: center;
      align-items: center;
      padding-bottom: 9px;
      color: #555;
      border-bottom: 1px dashed #ededed;
      margin-bottom: 9px;
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    li a {
      width: calc(100% - 100px);
      display: inline-block;
      padding-left: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 100;
      cursor: pointer;
    }
    a:hover {
      color: @color;
      text-decoration: underline;
    }
  }
}
</style>