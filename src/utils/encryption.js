import md5 from 'js-md5'
import store from '../store'
import { apilist } from './apilist'
import { server } from '../api/index'
// import JSEncrypt from 'jsencrypt/bin/jsencrypt'
document.write('<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>');
document.write('<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>');

function getAgentId () {
  let $this = this
  let url = window.location.href
  let corpid = this.$store.state.corpid
  this.corpid = corpid
  let payload = {
    url: url,
    corpid: corpid,
  }
  console.log(payload)
  let createvalue = $this.$createObj(payload);
  var keyvalue = createvalue['keyvalue'];
  let posturl = $this.$apilist['getjssdksign'] + '?signature=' + keyvalue;
  // return false;
  $this.$server.post(posturl, createvalue['fd']).then((data) => {
    wx.config({
      beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.data.Corpid, // 必填，企业微信的corpID
      timestamp: data.signdata.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.signdata.noncestr, // 必填，生成签名的随机串
      signature: data.signdata.sign,// 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: ['selectExternalContact', 'shareToExternalContact', 'agentConfig'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    });
    wx.checkJsApi({
      jsApiList: ['agentConfig'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function (res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        // alert(JSON.stringify(res))
        // alert('1')
        wx.ready(function () {
          wx.agentConfig({
            corpid: data.data.Corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: data.data.Agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: data.agensindata.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.agensindata.noncestr, // 必填，生成签名的随机串
            signature: data.agensindata.sign,// 必填，签名，见附录1
            jsApiList: ['selectExternalContact', 'shareToExternalContact'], //必填
            success: function (res) {
              // 回调
              // console.log('sdfsdf')
              // console.log(this.$el)
              // WWOpenData.bind(document.querySelector('ww-open-data'))
              // alert('success')
              // $this.openid = 8
              // alert($this.openid)
              // alert('2')

            },
            fail: function (res) {
              console.log(res)
              $this.checkauditmission()
              $this.getAllType()
              if (res.errMsg.indexOf('function not exist') > -1) {
                alert('版本过低请升级')
              }
            }
          });
        });
      }
    });

  })
}

const { JSEncrypt } = require('encryptlong')
function createObj (strvalue) {
  let newkey = Object.keys(strvalue).sort();
  // console.log(newkey)
  let fd = new FormData();
  for (let i in newkey) {
    fd.append(newkey[i], strvalue[newkey[i]])
  }
  let keyvalue = md5_post(strvalue);
  // console.log(keyvalue)
  return { "keyvalue": keyvalue, 'fd': fd }
}

function md5_post (strvalue) {
  // console.log(strvalue)
  let list = '';
  let newkey = Object.keys(strvalue).sort();
  // console.log(newkey)
  for (let i in newkey) {
    if (funcChina(strvalue[newkey[i]]))
      list += newkey[i] + '=' + strvalue[newkey[i]] + '&'
  }
  var value = 'APP_SECRET=bZwB7kklR4mymfb5zLsBi8rGUokhzRVr';
  list += value;
  // console.log(list)

  var keyvalue = md5(list).toUpperCase()
  // console.log(k)
  return keyvalue;
}
//检查是否包含中文
function funcChina (str) {
  var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(str);
  if (patrn) {
    //包含中文
    return false;
  }
  //不包含中文
  return true;
}
//这个方法不会影响原来的对象，而是返回一个新对象 对象obj去空值
function filterParams (obj) {
  // console.log('123123123')
  var _newPar = {};
  for (var key in obj) {
    //如果对象属性的值不为空，就保存该属性（这里我做了限制，如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。）
    if ((obj[key] === 0 || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      //记录属性
      _newPar[key] = obj[key];
    }
  }
  //返回对象
  return _newPar;
}

function uploadfile (inputDOM) {
  return new Promise((resolve) => {

    let filsepath = inputDOM.files[0];
    let payload = {
      userid: store.state.userid,
      // corpid: this.$store.state.corpid
      file: filsepath
    }
    let createvalue = createObj(payload);
    // var keyvalue = createvalue['keyvalue'];
    let posturl = apilist['uploadfiles'];
    server.post(posturl, createvalue['fd']).then(data => {

      // let dd = data
      // let Msize = (filsepath.size / (1024 * 1024)).toFixed(2)
      // let Ksize = (filsepath.size / (1024 * 1024)).toFixed(2)
      // if (Msize >= 1) {
      //   dd['doc_size'] = Msize + 'MB'
      // } else {
      //   dd['doc_size'] = Ksize + 'KB'
      // }
      // _this.filelist.push(dd)
      // _this.$refs.inputfile.value = null
      // console.log(_this.filelist)
      resolve(data)

    })
  })
}


//公钥
var PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0oWyluDFVa2wCcuMRgRni5JyDfh8PH/gImbpYJlp8Bj2goTkjO6v2+4AsvS0RwNdZIXY5BmvLjkQ1UVgRNQ7Byywnxxa3HRer3/jB0cGzcZuCfAaM/uhfgybAknOjDK8f9TvBhkWV2XWNsnU9PUkZUZ+mu5v2bG7etlydk9pyg/4SFYSHkUxuApXOwAIjCd/N20X3pvFN0Q42Hrn2E7vvowWb8/GOBByIATggVX/vo5SjBMQN261Y1wM74wGh4X4z2FYgKpiv2gSNLlwSm+Hr/v8a0gAokkDoJ4miLTO3VcuNycmRpemFPX9ijke/XFUMPLxi0JT/wFvPLH5I4GFawIDAQAB';
//私钥
var PRIVATE_KEY = 'MIIEogIBAAKCAQEA0oWyluDFVa2wCcuMRgRni5JyDfh8PH/gImbpYJlp8Bj2goTkjO6v2+4AsvS0RwNdZIXY5BmvLjkQ1UVgRNQ7Byywnxxa3HRer3/jB0cGzcZuCfAaM/uhfgybAknOjDK8f9TvBhkWV2XWNsnU9PUkZUZ+mu5v2bG7etlydk9pyg/4SFYSHkUxuApXOwAIjCd/N20X3pvFN0Q42Hrn2E7vvowWb8/GOBByIATggVX/vo5SjBMQN261Y1wM74wGh4X4z2FYgKpiv2gSNLlwSm+Hr/v8a0gAokkDoJ4miLTO3VcuNycmRpemFPX9ijke/XFUMPLxi0JT/wFvPLH5I4GFawIDAQABAoIBAG+9GPJuMS9ttg8s47JSKidxvmnd5wsxkGSSHPLx2sHebhEOukR3eA4SwHo72egLSCnPxTQk0c+F6IJahWNjBkWjmceKBEwY1Bzwky7MqzbTSJqrvyyyNaAyzp+jTyco0tZCze99p1cSLWX9MLQn3X6HsTFIt0Njy6/D9LYJJoxhgGnxLVjE2mvDyeMLiCxTt1MN2eEfOQFMUZEcM3uo9eZHER41d3Wy2RPSzGZW7s8hiIKS9NHubWzcPrPQEBRM0ol2M8Ep4kDXyOHMKbv98teyhbCUAlmHIcwIq/Pc2PeDFeLR+bxoJw3DqpHszuxKC7X3KrTCjHKqs5uBIm+5wdECgYEA1u//uHhZ/Oxt1WFBouUoz35CMMbaZHH4y/wTow6dx18z7NFmkeGd2XXBZKJ+ryNQI3JOJuqrGOUEF6IHNuuiYiDRLa37gjTQFVWfdqS+kKDmzpl8eVxH/ndZJ8+RmsHs97laTm3Q0pYlGEL3d8MxIoDNlG9FleAVCk5ZYHzFTSkCgYEA+r3C8duJ4CJxybW7DAHiq+BAqGmEw6gH6QUS27mI4AT9+9kbIUhhomWSLWNHs1sLJCQ+5FzKkDsBs2fNIEu3JVQww7p+wBSmcaAl5MZJ7vGqBZtDbgim1aPFrufR/ESZJhZ5UO/kxqGv9ZywpnYguZLdCXoAwIaYcymsQImAfHMCgYAFAF6t9zb42LORlIrHdJenhGOb6PSqA7DrZjk6wRtQyVlW+GRvnpViuwe+BL3361VxDbbd1vYWRTX8KswKLh+AMw1LB9JjbEEvTefBBgJdMTFNu2qXFFukgzhy4bScqkiOVyTP0GRckhvY3a4Ofl9FU0P1YUV4QFec/se7pAufSQKBgHfwj7DLeD9bmpyHLqsGt9vJkIQ+vUAuP2Jqh+PM8zldifSPnJemHPXmqi7F38Veloy6Pc9Ux5yIbT7ZN1jsfvX/OLhXnEvbVObjWVz+sNz4goDeDTo0L0Hgbi5FO7/1PGDovS1HI2MUcqwFQMbPmMXMB6mBz5xIheIInBne7DQbAoGAZlxU5AO9lkk8ro7E7meAOqIaIJZpsz/P63Cw2M9VqtbemOsnJzSxIwiYmA2nXJozWAPwdvH3eEmGjcENowwZZtu57TF+FF8zEA8Q3OD1qNozhFG42G+vBg1J9BU1AmO4vYAlXQuso05+PS4b4eGlJccdJtnHR8a6HdElgZ/BdIs=';

function beforeEncrypt (data) {
  //使用公钥加密

  let encrypt = new JSEncrypt();

  //encrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----'+PRIVATE_KEY+'-----END RSA PRIVATE KEY-----');

  encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');

  let encrypted = encrypt.encrypt(data);

  return encrypted
}
function afterEncrypt (data) {
  //      //使用私钥解密
  //
  let decrypt = new JSEncrypt();
  //
  // //decrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
  //
  decrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + PRIVATE_KEY + '-----END RSA PRIVATE KEY-----');
  //
  let uncrypted = decrypt.decrypt(data);
  //
  return uncrypted
}


function debounce (func, delay) {

  let timer

  return function (...args) {

    if (timer) {

      clearTimeout(timer)

    }

    timer = setTimeout(() => {

      func.apply(this, args)

    }, delay)

  }

}
function getDate () {
  var myDate = new Date();
  //获取当前年
  var year = myDate.getFullYear();
  //获取当前月
  var month = myDate.getMonth() + 1;
  //获取当前日
  var date = myDate.getDate();
  var h = myDate.getHours(); //获取当前小时数(0-23)
  var m = myDate.getMinutes(); //获取当前分钟数(0-59)
  var s = myDate.getSeconds();
  //获取当前时间
  var now = year + '_' + conver(month) + "_" + conver(date) + "_" + conver(h) + '_' + conver(m) + "_" + conver(s);
  return now;
}
function conver (s) {
  return s < 10 ? '0' + s : s;
}

export {
  createObj,
  filterParams,
  uploadfile,
  afterEncrypt,
  beforeEncrypt,
  debounce,
  getAgentId,
  getDate

}