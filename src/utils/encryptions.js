import md5 from 'js-md5';
function md5_post (str) {
  // console.log(strvalue)
  let strlist = 'timestamp=' + str + '&token=ASHJUHU35MqCaBuvtB2P1miXAXYAsOH2qluEqQf'

  // var keyvalue = md5(strlist).toUpperCase()
  var keyvalue = md5(strlist)
  // console.log(keyvalue)
  return keyvalue;
}

export {
  md5_post
}