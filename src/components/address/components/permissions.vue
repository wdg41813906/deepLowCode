<template>
  <div class="permissions">
    <div class="text_right top_form">
      <el-button size="small" @click="addClick()">添加</el-button>
    </div>
    <div class="member_colRight">
      <data-tables
        v-loading="loading"
        :data="tasklist"
        :pagination-props="{ pageSizes: [5, 10, 15] }"
        :row-key="row_key"
        :expand-row-keys="expandRowKeys"
        @selection-change="handleSelectionChange"
        :table-props="tableProps"
      >
        <!-- <el-table-column type="selection" width="65"></el-table-column> -->
        <el-table-column label="工号" prop="UserId"> </el-table-column>
        <el-table-column label="用户名" prop="Name"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="props">
            <div class="form_operate" v-if="myuserid != props.row.UserId">
              <el-link
                :underline="false"
                type="danger"
                @click="delClick(props.row)"
              >
                <span>删除</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
      </data-tables>
    </div>
    <el-dialog
      title="权限添加"
      :visible.sync="dialogTableVisible"
      width="600px"
      class="audit_dialog"
      :close-on-click-modal="false"
    >
      <el-form class="auditform" label-width="120px" @submit.native.prevent>
        <el-form-item label="管理员">
          <div class="el-input el-input--medium width_260 ww_groupSelBtn">
            <div class="el-input__inner" @click="departClick()">
              <div
                class="ww_groupSelBtn_item"
                v-for="item in departlist"
                :key="item.id"
              >
                <span class="ww_img"></span>
                <span class="ww_groupSelBtn_item_text">{{
                  item.Department
                }}</span>
                <!-- <i class="el-icon-close img_icon" @click="deldepart(item)"></i> -->
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="管理角色">
          <el-select
            v-model="select_per"
            placeholder="请选择"
            size="medium"
            style="height: 50px"
          >
            <el-option
              v-for="item in permisionlist"
              :key="item.val"
              :label="item.label"
              :value="item.val"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="管理范围"
          v-if="select_per == 2 || select_pere == '2'"
          style="margin-top: 8px"
        >
          <div class="el-input el-input--medium width_260 ww_groupSelBtn">
            <div class="el-input__inner" @click="departDClick()">
              <div
                class="ww_groupSelBtn_item"
                v-for="item in departlist_d"
                :key="item.id"
              >
                <span class="ww_img"></span>
                <span class="ww_groupSelBtn_item_text">{{
                  item.Department
                }}</span>
                <!-- <i class="el-icon-close img_icon" @click="deldepart(item)"></i> -->
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="perSubClick()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <DepartAlert
      :is_add="is_depart"
      :departlist="departlist"
      :title="'权限添加'"
      :alldepart="alldepart"
      @back="departBack"
      @departSub="departSub"
    ></DepartAlert>
    <DepartAlertA
      :is_add="is_depart_d"
      :departlist="departlist_d"
      :title="'设置管理范围'"
      :alldepart="alldepart_d"
      @back="departDBack"
      @departSub="departDSub"
    ></DepartAlertA>
  </div>
</template>
<script>
import DepartAlert from '../../public/departAlertMS'
import DepartAlertA from '../../public/departAlertP'
export default {
  name: 'permisiions',
  data () {
    return {
      myuserid: this.$store.state.userid,
      dialogTableVisible: false,
      tableProps: { border: true, 'header-cell-style': { background: '#eef1f6', color: '#606266' } },
      tasklist: [],
      loading: false,
      is_depart: false,
      departlist: [],
      alldepart: [],
      alldepart_d: [],
      permisionlist: [{ label: '管理员一级', val: 1 }, { label: '管理员二级', val: 2 }],
      select_per: '',
      departlist_d: [],
      is_depart_d: false,
    }
  },
  components: { DepartAlert, DepartAlertA },
  methods: {
    addClick () {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    departDClick () {
      this.is_depart_d = !this.is_depart_d
    },
    departDBack (val) {
      this.is_depart_d = val
    },
    departDSub (val) {
      console.log(val)
      this.departlist_d = val
    },
    departClick () {
      this.is_depart = !this.is_depart
    },
    departBack (val) {
      this.is_depart = val
    },
    departSub (val) {
      console.log(val)
      this.departlist = val
    },
    perSubClick () {
      let userids = []
      let departids = []
      if (this.departlist.length == 0) {
        this.$alert('请选择管理员！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      // for (let i in this.departlist) {
      //   userids.push(this.departlist[i].id)
      // }
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.departlist[0].id,
        level: this.select_per
      }
      if (this.select_per == 2) {
        if (this.departlist_d.length == 0) {
          this.$alert('请选择管理范围！', '提示', {
            confirmButtonText: '确定',

          });
          return false
        }
        for (let i in this.departlist_d) {
          departids.push(parseInt(this.departlist_d[i].id))
        }
        payload['departids'] = JSON.stringify(departids)
      }


      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['addoneadmin'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.$message({
          type: 'success',
          message: '添加成功!'
        });
        _this.dialogTableVisible = false
        _this.select_per = ''
        _this.departlist_d = []
        _this.departlist = []
        _this.getalladmin()
        // _this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    delClick (item) {
      this.$confirm('是否移除该管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let payload = {
          corpid: this.$store.state.corpid,
          self: this.$store.state.userid,
          userid: item.UserId
        }
        console.log(payload)
        let createvalue = this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['deloneadmin'] + '?signature=' + keyvalue;
        let _this = this
        this.$server.post(posturl, createvalue['fd']).then(() => {
          _this.getalladmin()
          _this.$message({
            type: 'success',
            message: '移除成功!'
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
    handleSelectionChange () { },
    getalladmin () {
      let payload = {
        corpid: this.$store.state.corpid
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['alladmin'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.tasklist = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    getalldepartmentanduseridtree () {
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
    getalldepartmenttree () {
      let corpid = this.$store.state.corpid
      // let posturl = this.$apilist['getalluserinfotree'] + '?corpid=' + corpid + '&userid=' + this.$store.state.userid;
      let _this = this
      let $this = this
      this.loading = true
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalldepartment'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.loading = false
        _this.alldepart_d = data.data
      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    this.getalladmin()
    this.getalldepartmenttree()
    this.getalldepartmentanduseridtree()
  }
}
</script>
<style lang="less">
.permissions {
  // padding: 16px;
  .el-form-item {
    margin-bottom: 0;
  }
  .member_colRight {
    display: table;
    width: 100%;
  }
  .operation_member {
    padding-top: 20px;
    padding-left: 20px;
  }
  .ww_groupSelBtn {
    .el-input__inner {
      overflow: auto;
    }
  }
  .ww_groupSelBtn_item {
    float: left;
    max-width: 231px;
    line-height: 1.5;
    margin: 3px 10px 3px 0;
    padding: 3px 11px 3px 7px;
    background-color: #fff;
    border: 1px solid #e4e6e9;
    border-radius: 2px;
  }
  .ww_img {
    display: inline-block;
    background: url(../../../assets/img/icon_folder_blue.png);
    width: 14px;
    height: 12px;
    margin: 2px 5px 0 0;
  }
  .ww_groupSelBtn_item_text {
    /* float: left; */
    max-width: 174px;
    padding-right: 11px;
    overflow: hidden;
    line-height: 18px;
    cursor: default;
  }
}
</style>