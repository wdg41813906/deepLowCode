<template>
  <div class="form_list_fill public_form">
    <div v-if="!is_more">
      <div class="top_form">
        <span class="name_span">{{ name }}任务中公示数据</span>
        <span class="right">
          <!-- <router-link
            :to="{ name: 'publicFormFill', query: { k: Date.now() } }"
          > -->
          <el-button icon="iconfont icon-cancel" size="small" @click="goback()"
            >返回</el-button
          >
          <!-- </router-link> -->
        </span>
      </div>
      <!-- <el-alert title="不可关闭的 alert" type="success" :closable="false">
    </el-alert> -->
      <!-- <div class="el-alert el-alert--success is-light">sdfsdfsdf</div> -->
      <div>
        <div v-for="item in sortFun(formlist)" :key="item" class="type_div">
          <p class="title_form">
            <span @click="typeEditorClick(item, formlist[item][0].TypeContent)">
              {{ formlist[item][0].TypeContent }}
            </span>
          </p>
          <div class="clearfix"></div>
          <ul class="eform-list clearfix" v-if="isStr(formlist[item]) == 1">
            <li
              v-for="items in formlist[item]"
              :key="items"
              @mouseover="mouseOver($event)"
              @mouseleave="mouseLeave($event)"
            >
              <div class="list_box">
                <div class="content_list_item">
                  <p class="p_over left width_150" slot="reference">
                    {{ items.Title }}
                  </p>
                  <!-- <p class="right other_count" v-if="items.DenyCount > 0">
                    {{ items.DenyCount }}
                  </p> -->
                  <div class="clearfix"></div>
                </div>

                <div>
                  <div class="left other_left">
                    包含
                    <span class="other_span">{{ items.PassCount }}</span> 条数据
                  </div>
                  <ul class="operation flex right">
                    <li @click="goClick(items)">
                      <span>进入</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUser } from '../../utils/auth'
import { afterEncrypt, beforeEncrypt } from '../../utils/encryption'
export default {
  name: 'form_list',
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
      typename: '',

    }
  },
  methods: {
    isStr (val) {
      if (typeof val != 'string') {
        return 1
      } else {
        return 234
      }
    },
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
    goback () {
      this.$router.push({ name: 'publicTaskFill', query: { k: Date.now() } })
    },
    mouseOver ($event) {
      $event.currentTarget.className = "  active";
    },
    mouseLeave ($event) {
      $event.currentTarget.className = "";
    },
    goClick (item) {
      console.log(item)
      this.$router.push({ name: 'publicListFill', params: { other: this.$route.params.other }, query: { name: item.Title, taskname: this.$route.query.name, id: beforeEncrypt(item.Code), taskcode: this.$route.query.id } })
    },

    getalltemplateform () {
      let $this = this
      let code = this.$route.query.id
      this.name = this.$route.query.name
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getformlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.formlist = data.data

      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    console.log('000000')
    this.getalltemplateform()
  }
}
</script>
<style lang="less">
.public_form {
  .eform-list > li {
    border-top: 3px solid #f56c6c;
  }
}
.form_list_fill {
  .other_span {
    font-size: @font_16;
    font-weight: 400;
  }
  .other_count {
    background: #f56c6c;
    display: inline-block;
    font-size: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    color: #fff;
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
    width: 70px;
    border: @border;
    margin-bottom: 0;
    margin-top: 40px;
    border-radius: 5px;
    font-size: @font_12;
    // padding: 3px 5px;
    > li {
      text-align: center;
      cursor: pointer;
      border-right: none !important;
      padding: 5px 15px;
    }
    > li:hover {
      span {
        color: @color;
      }
    }
  }
  .operation:hover {
    border: 1px solid @color;
  }
  .other_left {
    margin-top: 25px;
    line-height: 20px;
    font-size: @font_12;
    color: @other;
  }
}
</style>