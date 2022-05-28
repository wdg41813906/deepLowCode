<template>
  <div class="originator_alert">
    <el-dialog
      title="发起人或部门"
      :visible.sync="my_is_add"
      width="600px"
      height="700px"
      :before-close="handleClose"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <!-- <div class="demo-drawer__content">
        <div class="promoter_content drawer_content">
          <p>
            {{
              arrToStr(flowPermission1) ? arrToStr(flowPermission1) : "所有人"
            }}
          </p>
          <el-button type="primary" @click="addPromoter"
            >添加/修改发起人</el-button
          >
        </div>
        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="savePromoter">确 定</el-button>
          <el-button @click="promoterDrawer = false">取 消</el-button>
        </div>
        
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="my_is_add = false">取 消</el-button>
        <el-button type="primary" @click="my_is_add = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'originator_alert',
  props: {
    flowPermission1: Object,
    is_add: Boolean,
  },
  data () {
    return {
      my_is_add: false
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
<style lang="less">
.originator_alert {
}
</style>