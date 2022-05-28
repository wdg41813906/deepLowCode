<template>
  <div class="frame_index">
    <div>
      <img src="@/assets/img/jiaoxue.png" alt="" />
    </div>
    <div class="middle_new">
      <div class="content">
        <p class="title">本科教学工作量系统登录入口</p>
        <!-- <router-link :to="{ name: 'login' }" class="submit1">
            <el-button type="primary" class="submit">点击验证</el-button>
          </router-link> -->
        <router-link
          :to="{ name: 'login' }"
          class="submit1 margin_b_10 margin_top_10"
        >
          <el-button type="primary">企业微信扫码</el-button>
        </router-link>
        <router-link
          :to="{ name: 'word' }"
          target="_blank"
          class="word text_center"
        >
          <span>帮助文档</span>
        </router-link>
      </div>
      <div class="clearfix"></div>
      <!-- <div class="footer">版权所有 ©大连民族大学科技处1</div> -->
    </div>
    <!-- <div class="footer">版权所有 ©大连民族大学科技处</div> -->
    <div class="bg">
      <div class="middle">
        <div class="top">
          <!-- <img src="@/assets/img/login_logo.png" height="120" alt="" /> -->
        </div>

        <div class="footer text_center">
          大连民族大学2021 | 教务处 | 技术支持：
          <a href="https://www.deepgrid.cn/" target="_blank"></a>
          大连深度矩阵科技有限公司
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.frame_index {
  .middle_new {
    background: url("../../assets/img/background_4_1.jpg") no-repeat center;
    background-size: cover;
    height: 600px;
    width: 100%;
    min-width: 1000px;
    .content {
      background: rgba(255, 255, 255, 0.9);
      width: 500px;
      padding: 50px 10px;
      border-radius: 5px;
      float: right;
      margin-top: 150px;
      margin-right: 300px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.6);
      // margin: auto;
      // margin-top: 30%;
    }
  }

  .title {
    text-align: center;
    font-size: 25px !important;
    // margin-top: 150px;
    margin-bottom: 50px;
  }
  .submit1 {
    width: 100%;
    display: block;
    text-align: center;
  }
  .submit {
    text-align: center;
    margin: auto;
    width: 200px;
  }

  .footer {
    text-align: center;
  }
  .word {
    margin-top: 10px;
    display: block;
    color: #606606;
  }
}
</style>