<template>
  <div id="loading-failure">
    <div class="banner-wrapper">
      <div class="banner-content"><div class="banner-logo"></div></div>
    </div>
    <div class="result-content">
      <h1 class="title">浏览器不兼容</h1>
      <h2 class="title">是什么原因导致我看到这个页面?</h2>
      <div class="description">
        1.
        您使用的浏览器与本站存在部分兼容性问题，推荐您使用以下几款浏览器的最新版本，以便获得较好的使用体验
      </div>
      <div class="browsers">
        <div
          title="chrome浏览器，或其他使用webkit内核的双核浏览器"
          class="browser"
        >
          <img src="@/assets/img/chrome.jpg" alt="" width="120px" />
          <a href="https://www.google.cn/intl/en/chrome/" target="_blank"
            >谷歌浏览器</a
          >
        </div>

        <div title="Firefox" class="browser">
          <img src="@/assets/img/firefox.jpg" alt="" width="120px" />
          <a href="https://www.mozilla.org/zh-CN/firefox/new/" target="_blank"
            >火狐浏览器</a
          >
        </div>
      </div>
      <div class="description">
        2.
        点击社交软件中的链接直接跳转过来时也可能会使您看到本提示页，请尝试复制链接地址到浏览器后直接访问本站。
      </div>

      <div class="notification">
        上述方法均无效的情况，请联系工作人员，我们将尽快处理！
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getnavigator () {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      console.log(userAgent)
      var isOpera = userAgent.indexOf("Opera") > -1;
      if (isOpera) {
        return "Opera"
      } //判断是否Opera浏览器
      if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
      } //判断是否Firefox浏览器
      if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
      }
      if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
      } //判断是否Safari浏览器
      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
      } //判断是否IE浏览器

    },
    isTrue () {
      let string = this.getnavigator()

      if (string == 'Chrome') {
        this.$router.push({ name: 'login' })
      }
    }
  },
  mounted () {
    // this.isTrue()
  }
}
</script>

<style lang="less">
#loading-failure {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #444;
  background: #fff;
  overflow: auto;

  .banner-wrapper {
    height: 166px;
    width: 100%;
    background: @color;
    color: #fff;
    display: flex;
    align-items: Center;
  }

  .banner-logo {
    width: 72px;
    height: 72px;
    margin: 26px;
  }

  .result-content {
    padding: 56px 8px;
    margin: 0 auto;
    max-width: 866px;
    overflow-y: visible;
  }

  .browsers {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 18px 0;
  }

  .browser {
    flex: 0 0 128px;
    width: 128px;
    height: 128px;
    // border: 1px solid;
    margin: 18px;
    a {
      display: block;
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
    }
    a:hover {
      color: @color;
    }
  }

  .description,
  .notification {
    display: inline-block;
    margin: 8px 0;
    padding: 2px 5px;
    border-radius: 3px;
    color: #444;
    background: rgb(181, 202, 255);
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
