import axios from 'axios';
//import { Modal } from 'ant-design-vue'
// import qs from 'qs';
axios.defaults.retry = 3;                 //请求次数
axios.defaults.timeout = 15000;
axios.defaults.baseURL = ''; //填写域名
// axios.defaults.baseURL = '/api/'
axios.defaults.retryDelay = 1000;         //请求间隙

// axios.defaults.baseURL = 'http://localhost'
console.log(axios.defaults.baseURL)
// axios.defaults.baseURL = 'https://api.apiopen.top'; //填写域名
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN; 
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';




const instance = axios.create({
  withCredentials: true,
  retry: 3
})
import axiosRetry from 'axios-retry';
//配置axios 
var one = 3
var two = 1
axiosRetry(axios, {
  retries: 3,  //设置自动发送请求次数
  retryCondition: () => {
    //true为打开自动发送请求，false为关闭自动发送请求
    //这里的意思是当请求方式为get时打开自动发送请求功能
    if (two < one) {
      two = two + 1
      console.log(two)
      return true;
    }
    else {
      two = 1
      return false;
    }
  }
})

import { md5_post } from '../utils/encryptions'
//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    console.log(config)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()

    }
    if (config.method == 'get') {
      config.data = true
      let timee = Date.parse(new Date());
      config.headers['X-Access-Timestamp'] = timee
      config.headers['X-Access-Signature'] = md5_post(timee)
      // alert('dddddd')
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// axios.interceptors.response.use(response => {
//   console.log(response)
//   //   // if (response.method == 'get') {
//   //   //   response.data = true
//   //   //   let timee = Date.parse(new Date());
//   //   //   response.headers['H-TOKEN'] = '111'
//   //   //   response.headers['X-Access-Timestamp'] = timee
//   //   //   response.headers['X-Access-Signature'] = md5_post(timee)
//   //   //   alert('dddddd')
//   //   // }
//   //   // headers: { 'X-Access-Timestamp': timee, 'X-Access-Signature': md5_post(timee) }

//   return response;

//   //   // return response
//   // 
// }, err => {
//   console.log('-------------------------------------')
//   console.log(err.retry)
//   console.log(err.config.timeout)
//   console.log(err.config.retry)
//   console.log(err.config)
//   console.log(axios.defaults)
//   var config = err.config;
//   // If config does not exist or the retry option is not set, reject
//   if (!config || !config.retry) return Promise.reject(err);
//   console.log(axios.defaults)
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0;
//   console.log(config.__retryCount)
//   // Check if we've maxed out the total number of retries
//   if (config.__retryCount >= config.retry) {
//     // Reject with the error
//     console.log(config.retry)
//     return Promise.reject(err);
//   }

//   // Increase the retry count
//   config.__retryCount += 1;

//   // Create new promise to handle exponential backoff
//   var backoff = new Promise(function (resolve) {
//     console.log('------9000')
//     setTimeout(function () {
//       resolve();
//     }, config.retryDelay || 1);
//   });

//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function () {
//     console.log('99999')
//     return axios(config);
//   });
// });
//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  console.log(response)
  // if (response.method == 'get') {
  //   response.data = true
  //   let timee = Date.parse(new Date());
  //   response.headers['H-TOKEN'] = '111'
  //   response.headers['X-Access-Timestamp'] = timee
  //   response.headers['X-Access-Signature'] = md5_post(timee)
  //   alert('dddddd')
  // }
  // headers: { 'X-Access-Timestamp': timee, 'X-Access-Signature': md5_post(timee) }

  return response;

  // return response
}, err => {
  console.log(err)
  //  1.判断请求超时
  console.log('-------------------------------------')
  console.log(err)
  if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
    // return service.request(originalRequest);//例如再重复请求一次
    MessageBox.alert('由于网络波动原因，请稍后重试或刷新页面！', '提示', {
      confirmButtonText: '确定',
      // center: true


    })
    return false;
  }
  console.log(err)
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求')
        break;
      case 401:
        console.log('未授权，请重新登录')
        break;
      case 403:
        console.log('拒绝访问')
        break;
      case 404:
        console.log('请求错误,未找到该资源')
        break;
      case 405:
        console.log('请求方法未允许')
        break;
      case 408:
        console.log('请求超时')
        break;
      case 500:
        console.log('服务器端出错')
        break;
      case 501:
        console.log('网络未实现')
        break;
      case 502:
        console.log('网络错误')
        break;
      case 503:
        console.log('服务不可用')
        break;
      case 504:
        console.log('网络超时')
        break;
      case 505:
        console.log('http版本不支持该请求')
        break;
      default:
        console.log(`连接错误${err.response.status}`)
    }
  } else {
    console.log('连接到服务器失败')
  }
  return Promise.resolve(err.response)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    let timee = 'TtGktugrVcY0pEDd1ZWp9ntNXsYNf3ID218C9tTlOQT9FYst3KkjTONp2p1mUf6z';
    console.log(timee)
    // let header = { 'X-Access-Timestamp': timee, 'X-Access-Signature': md5_post(timee) }
    // alert(JSON.stringify(header))
    axios.get(url, {
      params: { params, t: Date.parse(new Date()), },
      // headers: { 'X-Access-Timestamp': timee, 'X-Access-Signature': md5_post(timee) }
    })
      .then(response => {
        if (response.data.errorcode == 0 || response.data.errcode == 0) {
          resolve(response.data);
        } else {
          errorFun(response.data, response.config.url)
        }

      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  // data = qs.stringify(data)
  return new Promise((resolve, reject) => {
    let timee = Date.parse(new Date());
    let header = { headers: { 'X-Access-Timestamp': timee, 'X-Access-Signature': md5_post(timee) } }
    instance.post(url, data, header)
      .then(response => {
        console.log(response)

        if (response.data.errorcode == 0 || response.data.errcode == 0) {
          resolve(response.data);
        } else {
          console.log(response.data)
          errorFun(response.data, response.config.url)
        }
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装patch请求
* @param url
* @param data
* @returns {Promise}
*/

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装put请求
* @param url
* @param data
* @returns {Promise}
*/

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}
{/* <script src="https://res.wx.qq.com/open/libs/weuijs/1.0.0/weui.min.js"></script> */ }
// document.write("<script language=javascript src='https://res.wx.qq.com/open/libs/weuijs/1.0.0/weui.min.js'></script>");
const list = 'api/wxserver/getloginuser api/user/binduser api/user/unbinduser api/user/changepasswd api/wxserver/getmessagedetail api/wxserver/messagecommit api/wxserver/messagedeny ' +
  'api/wxserver/addmessagereader api/wxserver/getmessagereader api/wxserver/getallmessageinfobytype api/wxserver/getauditingmessagedetail' +
  ' api/wxserver/delmessagereply api/wxserver/getmessagereply api/wxserver/addmessagereply '
import { MessageBox } from 'element-ui';
// import { Dialog } from 'cube-ui';
function errorFun (errorcode, url) {
  console.log(errorcode)
  let content = '服务器错误，请刷新重试！';
  if (errorcode.errcode == 20001) {
    content = errorcode.errmsg
  } else if (errorcode.errcode == 10002) {
    content = '工号重复！'
  } else if (errorcode.errcode == 30007) {
    content = '该类型已被使用，不可删除！'
  } else if (errorcode.errcode == 30005) {
    content = '不在该企业中！'
  } else if (errorcode.errcode == 10001) {
    content = '该部门拥有子部门,无法删除!'
  } else if (errorcode.errcode == 10002) {
    content = '没有权限删除!'
  } else if (errorcode.errcode == 30001) {
    content = errorcode.message
  } else if (errorcode.errcode == 60002) {
    content = '最后一个管理员不能删除!'
  } else if (errorcode.errcode == 60003) {
    content = '不能删除自己！'
  } else if (errorcode.errcode == 60001) {
    content = '当前用户已添加！'
  } else if (errorcode.errcode == 10003) {
    content = '导入的表中存在已添加账户！'
  } else if (errorcode.errcode == 70001) {
    content = errorcode.errmsg
  } else if (errorcode.errcode == 80001) {
    content = errorcode.errmsg
  } else if (errorcode.errcode == 80002) {
    content = '验证码错误！'
  } else if (errorcode.errorcode == -1) {
    content = '没有该用户，请联系管理员！'
    MessageBox.alert(content, '提示', {
      confirmButtonText: '确定',
      callback: () => {
        // this.$router.push({ name: 'login' })
        window.location.href = '/login'
      }
      // center: true
    });
    return false;
  }
  // Modal.error({
  //   title: '提示',
  //   content: content,
  //   okText: '确认',
  //   onOk () {
  //     // return new Promise((resolve, reject) => {
  //     //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
  //     // }).catch(() => console.log('Oops errors!'));
  //   },
  //   // onCancel () { },
  // });'
  // alert(url)
  console.log(url)
  if (errorcode.errcode == -19) {
    window.location.href = '/404'
    return false;
  }

  // if (list.indexOf(url.split('/')[url.split('/').length - 1].split('?')[0]) == -1) {
  // MessageBox.alert(content, '提示', {
  //   confirmButtonText: '确定',
  //   // center: true

  // })
  // } else {
  //   Dialog.$create({
  //     type: 'alert',
  //     title: '提示',
  //     content: content,
  //     icon: 'cubeic-alert',
  //     // icon: 'cubeic-warn'
  //   }).show()

  // }

  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    // alert('手机端')
    // Dialog.$create({
    //   type: 'alert',
    //   title: '提示',
    //   content: content,
    //   icon: 'cubeic-alert',
    //   // icon: 'cubeic-warn'
    // }).show()
  } else {
    // alert('PC端')
    MessageBox.alert(content, '提示', {
      confirmButtonText: '确定',
      // center: true

    })
  }

}


// export default {
//   post (url, paramObj) {
//     return post(url, paramObj)
//   }
// }

// export const server = {
//   post: function (url, paramObj) {
//     return post(url, paramObj)
//   }

// }

// export const server = {
//   exam: function (paramObj) {
//     return post('/api.php?ac=v2_djList', paramObj);
//   }
// }

export const server = {
  post: function (url, paramObj) {
    return post(url, paramObj);
  },
  get: function (url, paramObj) {
    return fetch(url, paramObj);
  }
}
