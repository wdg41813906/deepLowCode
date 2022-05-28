<template>
  <div class="three_setting">
    <!-- <div class="little_nav" @click="closeNavClick()" v-if="!is_nav">
      <div class="title_nav">
        <span class="title_icon">
          <i class="el-icon-menu"></i>
        </span>
        <span>流程模板</span>
        <span
          class="display_inline_block"
          style="line-height: 4px; width: 20px; height: 16px"
        >
          <i class="el-icon-arrow-right"></i
        ></span>
      </div>
    </div>
    <div class="left_nav" v-if="is_nav">
      <div class="title_nav">
        <span class="title_icon">
          <i class="el-icon-menu"></i>
        </span>
        <span>流程模板</span>
        <span class="right icon_nav" @click="closeNavClick()">
          <i class="el-icon-close"></i>
        </span>
        <div class="clearfix"></div>
      </div>
      <div class="content_nav">
        <div class="quick-design-item" @click="switchClick(1)">
          <div>
            <div class="quick-design-item-name">简单流程</div>
            <div class="quick-design-item-tip">所有人的审批人一样</div>
          </div>
        </div>
        <div class="quick-design-item" @click="switchClick(2)">
          <div>
            <div class="quick-design-item-name">分条件流程</div>
            <div class="quick-design-item-tip">所有人的审批人一样</div>
          </div>
        </div>
        <div class="other_quick">
          <div class="quick-design-item" @click="switchClick(3)">
            <div>
              <div class="quick-design-item-name">部门标签流程</div>
              <div class="quick-design-item-tip">所有人的审批人一样</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div>
      <!-- <Simple
        v-if="show_num == 1"
        :sumval.sync="sumval"
        :departlist_str="departlist"
        :mycode="mycode"
        :worktype="worktype"
        :show_click="show_click"
      ></Simple>
      <Subcondition
        v-else-if="show_num == 2"
        :sumval.sync="sumval"
        :departlist_str="departlist"
        :mycode="mycode"
        :worktype="worktype"
        :show_click="show_click"
      ></Subcondition> -->
      <Conditions
        :sumval.sync="sumval"
        :departlist_str="departlist"
        :mycode="mycode"
        :worktype="worktype"
        :show_click="show_click"
      ></Conditions>
    </div>
  </div>
</template>
<script>
// import Simple from './approval/simple'
// import Subcondition from './approval/subcondition'
import Conditions from './approval/conditions'
export default {
  name: 'threee_setting',
  props: {
    sumval: Object,
    departlist: String,
    key: Number,
    mycode: String
  },
  components: { Conditions },
  data () {
    return {
      show_num: 3,
      is_nav: true,
      myid: undefined,
      worktype: 3,
      show_click: 2,
    }
  },
  methods: {
    switchClick (item) {
      this.show_click = 1
      this.show_num = item
      console.log(item)
    },
    closeNavClick () {
      this.is_nav = !this.is_nav
    },
  },
  created () {
    console.log(this.sumval)

  },
  mounted () {
    console.log(this.sumval)
  },
  watch: {
    key (val) {
      console.log('sdsdf')
      console.log(this.sumval)
      console.log(typeof this.mycode)
      if (this.mycode != '123') {
        this.show_click = 2
        console.log('000000000000')
        console.log(this.sumval.threeval)
        this.worktype = 3
        this.show_num = 3

      } else {
        this.show_click = 1
        if (this.show_num == 0) {
          this.show_num = 1
        }


      }
    },
    departlist (val) {
      console.log('llllllll')
    }
  }
}
</script>
<style lang="less">
.three_setting {
  .little_nav {
    cursor: pointer;
    position: fixed;
    display: flex;
    align-items: center;
    padding: 7px 10px;
    top: 74px;
    left: 0;
    z-index: 100;
    background: #fff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 0 18px 18px 0;
    .title_icon {
      color: @color;
      display: inline-block;
      margin-right: 5px;
    }
    .little_right {
      margin-left: 7px;
    }
  }
  .left_nav {
    position: fixed;
    top: 60px;
    z-index: 100;
    bottom: 0;
    width: 286px;
    background: @white;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    -webkit-animation: slideInRight 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    animation: slideInRight 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    .title_nav {
      margin-top: 10px;
      padding: 10px;
    }
    .title_icon {
      color: @color;
      display: inline-block;
      margin-right: 5px;
    }
    .icon_nav {
      cursor: pointer;
    }
    .content_nav {
      padding: 10px 12px;
    }
    .quick-design-item:hover {
      border: 1px solid #3998f7;
    }
    .other_quick {
      margin-top: 15px;
      border-top: 1px solid #e3e4e4;
      padding-top: 15px;
    }
    .quick-design-item {
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 2px;
      border: 1px solid #e3e4e4;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      .quick-design-item-name {
        font-size: 14px;
        color: #191f25;
        line-height: 20px;
      }
      .quick-design-item-tip {
        font-size: 12px;
        color: rgba(25, 31, 37, 0.56);
      }
    }
  }
}
</style>