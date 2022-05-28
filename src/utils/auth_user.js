import Cookies from 'js-cookie'
// import Cookies from 'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js'

const TokenKey = 'Admin-Token'
const inFifteenMinutes = new Date(new Date().getTime() + 12 * 60 * 60 * 1000);
// const inFifteenMinutes = 1 / 2;

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// const UserKey = 'Admin-User'
export function getUser (key) {
  return Cookies.get(key)
}

export function setUser (key, val) {
  return Cookies.set(key, val, { expires: inFifteenMinutes })
}

export function removeUser (key) {
  return Cookies.remove(key)
}