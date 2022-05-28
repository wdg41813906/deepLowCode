//整个页面是个弹窗 visible 控制弹窗的显示关闭 默认打开

<template>
  <div class="mask_layer_model" v-show="visible" style="z-index: 9">
    <div class="captcha_model">
      <div class="header">
        <span>请完成安全验证</span>
        <span class="right cursor" @click="close">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="content">
        <div class="sliding-pictures">
          <i class="el-icon-refresh" @click="onRefresh" title="刷新验证码"></i>
          <div id="captcha"></div>
        </div>
      </div>
      <div class="sliderContainer">
        <div class="sliderMask">
          <div class="slider">
            <span class="sliderIcon"></span>
          </div>
        </div>
        <span class="sliderText">向右滑动填充拼图</span>
      </div>
    </div>
  </div>
</template>


<script>

// import './captcha.scss'
import "@/assets/less/captcha.less";
import { md5_post } from '@/utils/encryptions';
import axios from 'axios';
export default {
  props: {
    is_add: Boolean
  },
  data () {
    return {
      keyval: '',
      otherval: '',
      visible: false,
      cv: {
        w: 310,
        h: 155,
      },
      block: {
        l: 42, // 滑块边长
        L: 42 + 9 * 2 + 3,// 滑块实际边长
        r: 9, // 滑块半径
      },
      randomPos: {
        x: 0,
        y: 0,
      },
      canvasCtx: null,
      blockCtx: null,
      blockDom: null,
      sliderDom: null,
      sliderContainerDom: null,
      sliderMaskDom: null,
      el: null,
      img: null,
      trail: null,

    };
  },
  watch: {
    is_add (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('back', val)
    }
  },
  beforeCreate () { },
  created () { },
  beforeMount () { },
  mounted () {
    this.init();
  },
  methods: {
    close () {
      this.visible = false
    },
    init () {
      this.canvasInit();
      this.initImg();
      this.bindEvents();
    },
    onRefresh () {
      this.reset()
    },
    onSuccess () {
      console.log('success')
      this.visible = false
      this.$emit('successback')
      let $this = this
      setTimeout(function () {
        $this.reset()
      }, 500)
      // this.$msg.success("登录成功！");
    },
    onFail () {
      console.log('error')
      // this.$msg.warning("再试一次！");
    },
    bindEvents () {
      this.el.onselectstart = () => false

      let originX, originY, trail = [], isMouseDown = false

      const addClass = function (tag, className) {
        tag.classList.add(className)
      }

      const removeClass = function (tag, className) {
        tag.classList.remove(className)
      }


      const handleDragStart = function (e) {
        originX = e.clientX || e.touches[0].clientX
        originY = e.clientY || e.touches[0].clientY
        isMouseDown = true
        console.log(originX)
      }

      const handleDragMove = (e) => {
        if (!isMouseDown) return false
        const eventX = e.clientX || e.touches[0].clientX
        const eventY = e.clientY || e.touches[0].clientY
        const moveX = eventX - originX
        const moveY = eventY - originY
        if (moveX < 0 || moveX + 38 >= this.cv.w) return false
        this.sliderDom.style.left = moveX + 'px'
        const blockLeft = (this.cv.w - 40 - 20) / (this.cv.w - 40) * moveX
        this.blockDom.style.left = blockLeft + 'px'

        addClass(this.sliderContainerDom, 'sliderContainer_active')
        this.sliderMaskDom.style.width = moveX + 'px'
        trail.push(moveY)
      }

      const handleDragEnd = (e) => {
        if (!isMouseDown) return false
        isMouseDown = false
        const eventX = e.clientX || e.changedTouches[0].clientX
        if (eventX == originX) return false
        removeClass(this.sliderContainerDom, 'sliderContainer_active')
        this.trail = trail
        this.verify()

      }
      this.sliderDom.addEventListener('mousedown', handleDragStart)
      this.sliderDom.addEventListener('touchstart', handleDragStart)
      this.blockDom.addEventListener('mousedown', handleDragStart)
      this.blockDom.addEventListener('touchstart', handleDragStart)
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('touchmove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchend', handleDragEnd)
    },
    verify () {
      const sum = function (x, y) {
        return x + y
      }
      const square = function (x) {
        return x * x
      }

      const arr = this.trail // 拖动时y轴的移动距离
      const average = arr.reduce(sum) / arr.length
      const deviations = arr.map(x => x - average)
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)
      const left = parseInt(this.blockDom.style.left)

      const addClass = function (tag, className) {
        tag.classList.add(className)
      }
      let payload2 = {
        ssid: this.keyval,
        randf: left
      }
      let createvalue = this.$createObj(payload2);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['checkyzm'] + '?signature=' + keyvalue;
      // return false;
      this.$server.post(posturl, createvalue['fd']).then((data) => {

        let spliced = data.data
        let verified = stddev !== 0
        if (spliced) {
          if (verified) {
            addClass(this.sliderContainerDom, 'sliderContainer_success')
            this.onSuccess();
          } else {
            addClass(this.sliderContainerDom, 'sliderContainer_fail')
            this.onFail();
            this.reset()
          }
        } else {
          addClass(this.sliderContainerDom, 'sliderContainer_fail')
          this.onFail();
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      }).catch(err => {
        console.log(err)
      })


      // return {
      //   spliced: Math.abs(left - this.randomPos.x) < 10,
      //   verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
      // }
    },
    reset () {
      this.sliderContainerDom.className = 'sliderContainer'
      this.sliderDom.style.left = 0
      this.blockDom.style.left = 0
      this.sliderMaskDom.style.width = 0
      this.clean()
      this.img.setSrc(this.getRandomImgSrc())
    },
    clean () {
      this.canvasCtx.clearRect(0, 0, this.cv.w, this.cv.h)
      this.blockCtx.clearRect(0, 0, this.cv.w, this.cv.h)
      this.blockDom.width = this.cv.w
    },
    draw () {
      let $this = this

      // 随机创建滑块的位置
      console.log(this.otherval)
      // this.randomPos.x = this.getRandomNumberByRange(this.block.L + 10, this.cv.w - (this.block.L + 10))
      console.log(this.otherval)
      let payload1 = {
        start: this.block.L + 10,
        end: this.cv.w - (this.block.L + 10)
      }
      let createvalue = this.$createObj(payload1);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['ssyzm'] + '?signature=' + keyvalue;
      // return false;
      this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data.data)
        console.log('---------------------')
        // return Math.round(Math.random() * (end - start) + start)
        // this.otherval = data.data
        this.randomPos.x = data.data[(Object.keys(data.data)[0])]
        this.keyval = Object.keys(data.data)
        console.log(this.keyval)
        let payload2 = {
          start: 10 + this.block.r * 2,
          end: this.cv.h - (this.block.L + 10)
        }
        let createvalue1 = this.$createObj(payload2);
        var keyvalue = createvalue['keyvalue'];
        // let posturl1 = this.$apilist['ssyzm'] + '?signature=' + keyvalue;
        // return false;
        this.$server.post(posturl, createvalue1['fd']).then((data1) => {
          console.log(data.data)
          console.log('---------------------')
          // return Math.round(Math.random() * (end - start) + start)
          this.randomPos.y = data1.data[(Object.keys(data1.data)[0])]
          console.log(JSON.stringify(this.randomPos.x))
          console.log(JSON.stringify(this.randomPos.y))
          $this.randomPos.x = 169
          $this.randomPos.y = 49
          this.other(169, 49)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })


    },
    other (x, y) {
      this.drawBlock(this.canvasCtx, x, y, 'fill')
      this.drawBlock(this.blockCtx, x, y, 'clip')
    },
    drawBlock (ctx, x, y, operation) {
      let r = this.block.r,
        l = this.block.l,
        PI = Math.PI;

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
      ctx.lineTo(x + l, y)
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(x + l, y + l)
      ctx.lineTo(x, y + l)
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.stroke()
      ctx[operation]()
      ctx.globalCompositeOperation = 'destination-over'

    },
    initImg () {
      const img = this.createImg(() => {
        // this.draw()
        let $this = this
        // 随机创建滑块的位置

        let payload1 = {
          start: this.block.L + 10,
          end: this.cv.w - (this.block.L + 10)
        }
        let createvalue = this.$createObj(payload1);
        var keyvalue = createvalue['keyvalue'];
        let posturl = this.$apilist['ssyzm'] + '?signature=' + keyvalue;
        // return false;
        this.$server.post(posturl, createvalue['fd']).then((data) => {
          // return Math.round(Math.random() * (end - start) + start)
          // this.otherval = data.data
          this.randomPos.x = data.data[(Object.keys(data.data)[0])]
          this.keyval = Object.keys(data.data)[0]
          let payload2 = {
            start: 10 + this.block.r * 2,
            end: this.cv.h - (this.block.L + 10)
          }
          let createvalue1 = this.$createObj(payload2);
          var keyvalue = createvalue['keyvalue'];
          // let posturl1 = this.$apilist['ssyzm'] + '?signature=' + keyvalue;
          // return false;


          this.randomPos.y = this.getRandomNumberByRange(10 + this.block.r * 2, this.cv.h - (this.block.L + 10))
          this.drawBlock(this.canvasCtx, this.randomPos.x, this.randomPos.y, 'fill')
          this.drawBlock(this.blockCtx, this.randomPos.x, this.randomPos.y, 'clip')
          this.canvasCtx.drawImage(img, 0, 0, this.cv.w, this.cv.h)
          this.blockCtx.drawImage(img, 0, 0, this.cv.w, this.cv.h)
          const y = this.randomPos.y - this.block.r * 2 - 1;
          const ImageData = this.blockCtx.getImageData(this.randomPos.x - 3, y, this.block.L, this.block.L)
          this.blockDom.width = this.block.L
          this.blockCtx.putImageData(ImageData, 0, y)
        }).catch(err => {
          console.log(err)
        })






      })
      this.img = img
    },
    canvasInit () {
      const canvas = this.createCanvas(this.cv.w, this.cv.h) // 画布
      const block = canvas.cloneNode(true) // 滑块

      block.className = 'block'
      const el = this.el = document.getElementById('captcha');
      el.style.position = 'relative'
      el.style.width = this.cv.w + 'px'
      Object.assign(el.style, {
        position: 'relative',
        width: this.cv.w + 'px',
        margin: '0 auto'
      })

      this.el = el
      el.appendChild(canvas)
      el.appendChild(block)

      this.canvasCtx = canvas.getContext("2d");
      this.blockCtx = block.getContext("2d");
      this.blockDom = block;
      this.sliderDom = document.getElementsByClassName('slider')[0];
      this.sliderContainerDom = document.getElementsByClassName('sliderContainer')[0];
      this.sliderMaskDom = document.getElementsByClassName('sliderMask')[0];
      console.log(this.sliderDom)
    },
    createCanvas (width, height) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      return canvas
    },
    createImg (onload) {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.onload = onload
      img.onerror = () => {
        img.setSrc(this.getRandomImgSrc())
      }

      img.setSrc = (src) => {
        if (window.navigator.userAgent.indexOf('Trident') > -1) { // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
          const xhr = new XMLHttpRequest()
          xhr.onloadend = (e) => {
            const file = new FileReader() // FileReader仅支持IE10+
            file.readAsDataURL(e.target.response)
            file.onloadend = function (e) {
              img.src = e.target.result
            }
          }
          xhr.open('GET', src)
          xhr.responseType = 'blob'
          xhr.send()
        }
        else img.src = src
      }
      img.setSrc(this.getRandomImgSrc())
      return img
    },

    getRandomNumberByRange (start, end) {
      let oo = Math.random() * (end - start) + start
      let otherval = Math.round(Math.random() * (end - start) + start)
      return otherval
    },
    getRandomImgSrc () {

      let sss = this.getRandomNumberByRange(0, 1084)
      console.log(sss)

      return this.$store.state.weburl + 'imgv/' + this.getRandomNumberByRange(1, 100) + ".jpg"
      // return 'https://picsum.photos/id/407/300/150'
    },
  }
};
</script>