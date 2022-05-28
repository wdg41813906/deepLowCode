<template>
  <div>
    <el-dialog
      title="编辑表单名"
      :visible.sync="is_form_editor"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-input v-model="form_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_form_editor = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="formEditorSub()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类名"
      :visible.sync="is_type_editor"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-input v-model="conent_type"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_type_editor = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="typeEditorSub()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="is_type_editor_item"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-select v-model="typeid_item" style="width: 100%">
            <el-option
              v-for="item in typelist"
              :key="item"
              :label="item.Content"
              :value="item.Id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="is_type_editor_item = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="typeItemEditorSub()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <type-alert
      :is_add="is_add"
      @back="typeBack"
      @subBack="subTypeBack"
    ></type-alert>
    <DepartAlert
      :is_add="is_depart"
      :departlist="departlist"
      :title="'表单授权'"
      @back="departBack"
      @departSub="departSub"
    ></DepartAlert>
    <MoreFormList
      :is_more="is_more"
      :typeid="typeid"
      :typename="typename"
      @back="moreBack"
    ></MoreFormList>
  </div>
</template>
<script>
import { getUser } from '../../utils/auth'
import { beforeEncrypt } from '../../utils/encryption'
import TypeAlert from './components/typeAlert'
export default {
  name: 'formlist',
  components: { TypeAlert },
  data () {
    return {
      active: [],
      num: [],
      is_add: false,
      formlist: [],
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
      is_more: false,
      typename: ''
    }
  },
  methods: {
    sortFun (lists) {
      let list_h = []
      let list_s = []
      let objs = Object.keys(lists)
      for (let i in objs) {
        if (typeof lists[objs[i]] == 'string') {
          list_s.push(objs[i])
        } else {
          list_h.push(objs[i])
        }
      }
      return list_h.concat(list_s.reverse())
    },
    gorFormClick (code) {
      let routedata = this.$router.resolve({ name: 'lookForm', query: { id: beforeEncrypt(code) } })
      window.open(routedata.href, '_blank');
    },
    moreClick (typeid, typename) {
      console.log('000000')
      this.is_more = !this.is_more
      this.typeid = typeid
      this.typename = typename

    },
    moreBack (val) {
      this.is_more = val
    },
    delClick (item) {
      this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let $this = this
        let payload = {
          corpid: this.$store.state.corpid,
          userid: this.$store.state.userid,
          form_code: item.Code
        }
        let createvalue = $this.$createObj(payload);
        var keyvalue = createvalue['keyvalue'];
        let posturl = $this.$apilist['deltemplateform'] + '?signature=' + keyvalue;
        console.log(payload)
        // return false;
        $this.$server.post(posturl, createvalue['fd']).then((data) => {
          console.log(data)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getalltemplateform()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      })
    },
    authorizationFormClick (item) {
      console.log(item)
      this.is_depart = true
      this.form_code = item.Code
      if (item.CooperationInfo == null) {
        this.departlist = []
      } else {
        this.departlist = item.CooperationInfo
      }

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
        this.departlist = []
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
    },
    eidtorFormClick (code) {
      let val = beforeEncrypt(code)
      this.$router.push({ name: 'editorForm', query: { k: val } })
    },
    gorCopyClick (code) {
      let val = beforeEncrypt(code)
      this.$router.push({ name: 'copyForm', query: { k: val } })
    },
    formEditorClick (item) {
      console.log(item)
      this.is_form_editor = true
      this.form_title = item.Title
      this.form_code = item.Code
    },
    formEditorSub () {
      let $this = this
      if (this.form_title.trim() == '') {
        this.$alert('请填写表单名！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      let payload = {
        title: this.form_title,
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        form_code: this.form_code
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edittemplateformtitle'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.is_form_editor = false
        this.getalltemplateform()

      }).catch(err => {
        console.log(err)
      })
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
        form_code: this.conent_type_item
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['edittemplateformtype'] + '?signature=' + keyvalue;
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
      console.log(content)
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
    typeClick () {
      this.is_add = !this.is_add
    },
    typeBack (val) {
      this.is_add = val
    },
    subTypeBack () {
      //运行全部
      this.getalltemplateform()
    },
    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },
    mouseOverTwo ($event) {
      console.log($event.currentTarget.nextElementSibling)
      $event.currentTarget.nextElementSibling.className = 'dropdown_div_active'
    },
    mouseLeaveTwo ($event) {
      $event.currentTarget.nextElementSibling.className = "dropdown_div";
    },
    mouseOverThree ($event) {
      $event.currentTarget.className = "  dropdown_div_active";
    },
    mouseLeaveThree ($event) {
      $event.currentTarget.className = "dropdown_div";
    },
    mouseOverFour ($event) {
      console.log($event.currentTarget.lastElementChild.className)
      $event.currentTarget.lastElementChild.className = " type_num_span type_editor_text display_block";
      console.log($event.currentTarget.lastElementChild)
    },
    mouseLeaveFour ($event) {
      $event.currentTarget.lastElementChild.className = "display_none";
    },
    getalltemplateform () {
      let $this = this

      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettemplateforminfo'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formlist = data.data

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
  },
  mounted () {
    this.getalltemplateform()
    this.getallbytype()
  }
}
</script>
<style lang="less">
.form_list {
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
    width: 142px;
    > li {
      width: 70px;
      text-align: center;
      li {
        text-align: left;
      }
    }
  }
}
</style>