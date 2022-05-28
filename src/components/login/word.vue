<template>
  <div class="word">
    <div class="top">
      <div class="top_header">
        <div>
          <ul class="ul_header_logo left">
            <li>
              <div class="icon_logo"></div>
            </li>
            <li>
              <span class="font_18">帮助文档 </span>
            </li>
          </ul>
        </div>

        <div class="clearfix"></div>
      </div>
    </div>
    <div class="flex middle_div">
      <div class="left_menu">
        <div ref="left_menu">
          <ul>
            <li
              class="left_li"
              :class="{ wwopen_tree_hot_cur: tabindex == 1 }"
              @click="tabClick(1)"
            >
              1.登录
            </li>
            <li
              class="left_li"
              @click="tabClick(2)"
              :class="{ wwopen_tree_hot_cur: tabindex == 2 }"
            >
              2.如何使用手机登录企业微信
            </li>
            <li
              class="left_li"
              @click="tabClick(3)"
              :class="{ wwopen_tree_hot_cur: tabindex == 3 }"
            >
              3.使用企业微信登录提示“无权限登录”怎么办？
            </li>
            <li
              class="left_li"
              @click="tabClick(4)"
              :class="{ wwopen_tree_hot_cur: tabindex == 4 }"
            >
              4.填报说明
            </li>
          </ul>
        </div>
      </div>
      <div class="right_content other_content">
        <div v-if="tabindex == 1">
          <h1 class="right_title">登录</h1>
          <div class="hot_list">
            <p class="p_title">
              在校内使用校园网填报（在校外使用VPN-科研工作量链接填报）
            </p>
            <p class="content_p">
              打开谷歌浏览器，输入网址：http://kygl.dlnu.edu.cn/，点击【企业微信扫码】按钮，跳转页面后通过手机企业微信扫码登录。
            </p>
            <img class="big_img" src="@/assets/help/help1.png" alt="" />
            <img class="big_img" src="@/assets/help/help2.png" alt="" />
          </div>
        </div>
        <div v-else-if="tabindex == 2">
          <h1 class="right_title">如何使用手机登录企业微信</h1>
          <div class="hot_list">
            <p class="p_title">1.微信扫码加入大连民族大学企业微信</p>

            <div class="small_img text_center">
              <img src="@/assets/help/help3.png" alt="" />
            </div>
            <p class="p_title">2.在应用商店下载企业微信APP并登录</p>
            <div class="small_img text_center">
              <img src="@/assets/help/help4.png" alt="" />
            </div>
          </div>
        </div>
        <div v-else-if="tabindex == 3">
          <h1 class="right_title">使用企业微信登录提示“无权限登录”怎么办？</h1>
          <div class="hot_list">
            <p class="p_title">
              1.查看自己所在企业是否为已认证的“大连民族大学”
            </p>
            <p>
              打开手机企业微信，找到“我”—— “设置”——
              “管理企业”——退出不带有绿色认证标识的“大连民族大学”。
            </p>
            <img class="big_img" src="@/assets/help/help5.png" alt="" />
            <p class="p_title">
              2.切换所在企业——打开手机企业微信，找到“消息”——左上角操作按钮——切换我的企业“大连民族大学”。
            </p>
            <img class="big_img" src="@/assets/help/help20.png" alt="" />
          </div>
        </div>
        <div v-else>
          <h1 class="right_title">填报说明</h1>
          <div class="hot_list">
            <p class="p_title">
              1.进入系统后，请老师首先维护“填报人信息”。点击编辑图标，对个人的职位、职称进行简单维护。
            </p>
            <img class="big_img" src="@/assets/help/help6.png" alt="" />

            <p class="p_title">2.进入填报。点击“查看详情”</p>
            <img class="big_img" src="@/assets/help/help7.png" alt="" />
            <p class="p_title1">对系统已导入数据的操作</p>
            <p class="p_title">
              1.核对教务系统已导入的数据。操作——编辑——进入核对数据。
            </p>
            <img class="big_img" src="@/assets/help/help8.png" alt="" />
            <p class="p_title">
              2.编辑表单内容。根据表单提示，选择对应系数，完善表格，系统将自动计算结果。
            </p>
            <img class="big_img" src="@/assets/help/help9.png" alt="" />
            <p class="p_title">
              3.工作量分配。点击“分配”后，手动输入姓名或工号搜索相关被分配人，并将所有工作量数值分配完尽，如果有分配给自己的工作量，则需要选择自己，并分配相应数值。
            </p>
            <img
              class="big_img"
              src="@/assets/help/help10.png"
              alt=""
              style="margin-top: 40px"
            />
            <p class="p_title">
              4.编辑后提交。批量或逐个提交至审核人员——操作——提交。
            </p>
            <img class="big_img" src="@/assets/help/help11.png" alt="" />
            <p class="p_title1">对未导入的数据执行添加操作</p>
            <p class="p_title">
              1.选择待填报的表单。点击左上角“表单”，选择待添加数据的课程类别，点击进入填报。
            </p>
            <img class="big_img" src="@/assets/help/help12.png" alt="" />
            <p class="p_title">
              2.添加数据。该表单有多条数据时可以编辑一条后多次添加。
            </p>
            <img class="big_img" src="@/assets/help/help13.png" alt="" />
            <p class="p_title">3.填报信息。根据表单提示，填入相关数据。</p>
            <img class="big_img" src="@/assets/help/help14.png" alt="" />
            <p class="p_title">
              4.提交。对于新增的数据，也需要点击“提交”至相关审核人。
            </p>
            <img class="big_img" src="@/assets/help/help15.png" alt="" />
            <p class="p_title1">数据撤回和查看汇总</p>
            <p class="p_title">
              1.已提交数据的撤回。已提交的数据在审核人执行“通过”操作前，填报人可自主撤回重新编辑或提交。
            </p>
            <img class="big_img" src="@/assets/help/help16.png" alt="" />
            <img class="big_img" src="@/assets/help/help17.png" alt="" />
            <p class="p_title">2.查看个人数据汇总情况。</p>

            <img class="big_img" src="@/assets/help/help18.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabindex: 1
    }
  },
  methods: {
    tabClick (num) {
      this.tabindex = num
    }
  }
}
</script>
<style lang="less">
.word {
  margin-bottom: 20px;
  .top {
    z-index: 1500;
    background: @color;
    color: @white;
    position: fixed;
    top: 0;
    width: 100%;
    height: 62px;
    line-height: 62px;

    box-shadow: rgba(39, 54, 78, 0.12) 1px 0px 6px 0px;
    min-width: 1000px;
    .top_header {
      min-width: 1060px;
      margin: auto;
      margin-left: 20px;
    }
    .ul_header_logo {
      display: flex;
      justify-items: center;
      align-items: center;
      height: 100%;
      .icon_logo {
        margin-top: 13px;
        width: 165px;
        height: 55px;
        background: url("../../assets/img/keyan.png") no-repeat;
        background-size: contain;
        margin-right: 10px;
      }
    }
  }
  .flex {
    display: flex;
  }
  .middle_div {
    // position: absolute;
    // left: 10px;
    // right: 0;
    // bottom: 0;
    margin: auto;
    margin-top: 72px;
    width: 1240px;
  }

  .footer_header,
  .footer_header a {
    color: #9e9e9e;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .left_menu {
    width: 240px;
    position: relative;
    top: 0;
    // bottom: 0;
    background: @white;
    // min-height: 845px;
    padding-top: 20px;
    height: 310px;
    // left: 20px;
    // margin-top: 100px;
    // margin-left: 20px;
    .left_li {
      // margin-bottom: 24px;
      cursor: pointer;
      padding: 15px 20px;
      font-size: 14px !important;
      // line-height: 32px;
    }
    .wwopen_tree_hot_cur {
      background-color: #0085dd;
      color: #fff;
    }
  }
  .right_content {
    // position: relative;
    margin-left: 30px;
    margin-top: 20px;
    margin-right: 20px;
    width: 840px;
    // width: 1000px;
    min-height: 600px;
    overflow: auto;
    // background: @white;
    // padding: 10px;
  }
  .other_content {
    .right_title {
      font-size: 20px !important;
      line-height: 40px;
      padding-right: 8px;
      color: #333;
      font-weight: 500;
    }
    .hot_list {
      width: 100%;
      padding-left: 8px;
      padding-top: 20px;
      .content_p {
        // color: red;
        text-indent: 2em;
      }
      .big_img {
        width: 800px;
        text-align: center;
        margin-top: 20px;
      }
      .small_img {
        img {
          width: 240px;
          margin-top: 20px;
        }
      }
      .p_title {
        font-size: 14px !important;
        height: 32px;
        line-height: 32px;
        font-weight: 600;
        margin-top: 20px;
      }
      .p_title1 {
        font-size: 18px !important;
        height: 32px;
        line-height: 32px;
        font-weight: 600;
        margin-top: 20px;
      }
    }
  }
}
</style>