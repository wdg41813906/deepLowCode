<template>
  <div class="type_alert">
    <el-dialog
      title="新建分类"
      :visible.sync="my_is_add"
      :close-on-click-modal="false"
      :custom-class="'depart_aldert_dialog'"
      width="600px"
      height="700px"
      :before-close="handleClose"
      @close="close"
    >
      <el-form @submit.native.prevent>
        <el-form-item label="表单分类名称">
          <el-input v-model="content" placeholder="请填写"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="my_is_add = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="addType()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'type_alert',
  props: {
    is_add: Boolean
  },
  data () {
    return {
      my_is_add: false,
      content: '',
    }
  },
  methods: {
    close () {
      this.my_is_add = false
    },
    addType () {
      let $this = this
      if (this.content == '') {
        this.$alert('请填写分类名！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      let payload = {
        type_desc: '规则类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        content: this.content
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['addonetype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // $this.is_additem = true
        this.$message({
          type: 'success',
          message: '新建表单分类成功!'
        });
        this.content = ''
        this.close()
        this.$emit('subBack')

      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    is_add (val) {
      this.my_is_add = val
    },
    my_is_add (val) {
      this.$emit('back', val)
    }
  }
}
</script>