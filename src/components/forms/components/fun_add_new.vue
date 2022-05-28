<template>
  <div class="formula-outer1" v-show="my_is_func">
    <div
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="添加工作量"
      class="el-message-box__wrapper formula-outer"
      style="z-index: 2000"
      v-show="my_is_func"
    >
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title">
            <span>公式编辑</span>
          </div>
          <button class="el-message-box__headerbtn" aria-label>
            <i
              class="el-message-box__close el-icon-close"
              @click="icon_close"
            ></i>
          </button>
        </div>
        <div
          class="el-message-box__content"
          style="height: 700px; overflow-y: auto"
        >
          <!-- <div>
            <el-input v-model="code"></el-input>
          </div> -->
          <div>
            <div class="editor-outer">
              <div class="x-formula-editor">
                <div class="formula-head">
                  <span class="formula-name">{{ func_name }}</span>
                  <span class="formula-equal">=</span>
                </div>
              </div>
              <!-- <button class="subbtn">获取</button> -->
              <div class="func_middle">
                <div class="left">
                  <el-button size="medium" @click="checkFunc()"
                    >公式校验</el-button
                  >
                </div>
                <div class="1" style="float: right">
                  <span class="outcome_state_span">
                    <el-select
                      v-model="outcome_state"
                      size="medium"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in outcome_list"
                        :key="item"
                        :value="item.val"
                        :label="item.name"
                        >{{ item.name }}</el-option
                      >
                    </el-select>
                  </span>
                  <span>保留</span>
                  <span class="decimal_span">
                    <el-select v-model="decimal_point" size="medium">
                      <el-option v-for="item in 5" :key="item" :value="item">{{
                        item
                      }}</el-option>
                    </el-select>
                  </span>
                  <span>位小数</span>
                </div>
                <div class="clearfix"></div>
                <div class="operator">
                  <div class="operator_title">快捷运算符</div>
                  <div class="operator_list">
                    <span
                      class="operator_list_item"
                      v-for="item in operator_list"
                      :key="item.name"
                      @click="addOtherClick(item)"
                    >
                      <span v-if="item.val == '|'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="或"
                          placement="top-start"
                        >
                          <span>{{ item.name }}</span>
                        </el-tooltip>
                      </span>
                      <span v-else-if="item.val == '&'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="与"
                          placement="top-start"
                        >
                          <span>{{ item.name }}</span>
                        </el-tooltip>
                      </span>
                      <span v-else>
                        {{ item.name }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="fields-list">
                  <div class="formula-info-label">可用变量</div>

                  <ul class="field-list" style="display: block">
                    <span
                      v-for="item in strginglist"
                      :key="item"
                      class="field_list_i"
                    >
                      <li
                        v-if="item.C == 'select_number' && item.Is == true"
                        :name="item.Code"
                        class="field"
                        @click="addStrClick($event)"
                      >
                        <a class="menu-item with-capsule" :title="item.Name">
                          <p class="p_over" style="width: 170px">
                            {{ item.Name }}
                          </p>
                          <!-- <div class="menu-capsule style-blue">数字单选</div> -->
                        </a>
                      </li>
                      <li
                        v-else-if="item.C == 'number' && item.Is == true"
                        :name="item.Code"
                        class="field"
                        @click="addStrClick($event)"
                      >
                        <a class="menu-item with-capsule" :title="item.Name"
                          ><p class="p_over" style="width: 170px">
                            {{ item.Name }}
                          </p>
                          <!-- <div class="menu-capsule style-yellow">数字</div> -->
                        </a>
                      </li>
                      <li
                        v-else-if="item.C == 'coefficient' && item.Is == true"
                        :name="item.Code"
                        class="field"
                        @click="addStrClick($event)"
                      >
                        <a class="menu-item with-capsule" :title="item.Name"
                          ><p class="p_over" style="width: 170px">
                            {{ item.Name }}
                          </p>
                          <!-- <div class="menu-capsule style-yellow">数字</div> -->
                        </a>
                      </li>
                    </span>
                  </ul>
                </div>
                <div
                  class="x-layout-table-item fx_formula_info"
                  widgetname="formulaInfoPane"
                >
                  <div class="formula-info-label">函数</div>
                  <div class="formula-info-main">
                    <div class="formula-menu">
                      <!-- <div class="formula-search">
                        <input class="search-input" placeholder="搜索函数" />
                      </div> -->
                      <ul class="formula-list">
                        <li class="formula-category">
                          <div class="title">
                            <i class="angle-icon icon-angleright"></i>数学函数
                          </div>
                          <ul class="children">
                            <li class="formula-item select">ABS</li>
                            <li class="formula-item">AVERAGE</li>
                            <li class="formula-item">MAX</li>
                            <li class="formula-item">MIN</li>
                            <li class="formula-item">SUM</li>
                            <!-- <li class="formula-item">CEILING</li>
                            <li class="formula-item">COUNT</li>
                            <li class="formula-item">COUNTIF</li>
                            <li class="formula-item">FIXED</li>
                            <li class="formula-item">FLOOR</li>
                            <li class="formula-item">INT</li>
                            <li class="formula-item">LARGE</li>
                            <li class="formula-item">LOG</li>
                            <li class="formula-item">MOD</li>
                            <li class="formula-item">POWER</li>
                            <li class="formula-item">PRODUCT</li>
                            <li class="formula-item">ROUND</li>
                            <li class="formula-item">SQRT</li>
                            
                            <li class="formula-item">SUMPRODUCT</li> -->
                          </ul>
                        </li>
                        <!-- <li class="formula-category">
                          <div class="title">
                            <i class="angle-icon icon-angleright"></i>文本函数
                          </div>
                          <ul class="children">
                            <li class="formula-item">CONCATENATE</li>
                            <li class="formula-item">EXACT</li>
                            <li class="formula-item">GETUSERNAME</li>
                            <li class="formula-item">ISEMPTY</li>
                            <li class="formula-item">LEFT</li>
                            <li class="formula-item">LEN</li>
                            <li class="formula-item">LOWER</li>
                            <li class="formula-item">MID</li>
                            <li class="formula-item">REPLACE</li>
                            <li class="formula-item">REPT</li>
                            <li class="formula-item">RIGHT</li>
                            <li class="formula-item">SEARCH</li>
                            <li class="formula-item">SPLIT</li>
                            <li class="formula-item">TEXT</li>
                            <li class="formula-item">TRIM</li>
                            <li class="formula-item">UPPER</li>
                            <li class="formula-item">VALUE</li>
                          </ul>
                        </li> -->
                        <!-- <li class="formula-category">
                          <div class="title">
                            <i class="angle-icon icon-angleright"></i>日期函数
                          </div>
                          <ul class="children">
                            <li class="formula-item">DATE</li>
                            <li class="formula-item">DATEDELTA</li>
                            <li class="formula-item">DAY</li>
                            <li class="formula-item">DAYS</li>
                            <li class="formula-item">DAYS360</li>
                            <li class="formula-item">HOUR</li>
                            <li class="formula-item">ISOWEEKNUM</li>
                            <li class="formula-item">MINUTE</li>
                            <li class="formula-item">MONTH</li>
                            <li class="formula-item">NOW</li>
                            <li class="formula-item">SECOND</li>
                            <li class="formula-item">SYSTIME</li>
                            <li class="formula-item">TIME</li>
                            <li class="formula-item">TIMESTAMP</li>
                            <li class="formula-item">TODAY</li>
                            <li class="formula-item">WEEKNUM</li>
                            <li class="formula-item">YEAR</li>
                          </ul>
                        </li> -->
                        <li class="formula-category">
                          <div class="title">
                            <i class="angle-icon icon-angleright"></i>逻辑函数
                          </div>
                          <ul class="children">
                            <li class="formula-item">IFS</li>
                            <!-- <li class="formula-item">AND</li> -->
                            <!-- <li class="formula-item">AND</li>
                            <li class="formula-item">FALSE</li>
                            <li class="formula-item">IF</li>
                            <li class="formula-item">NOT</li>
                            <li class="formula-item">OR</li>
                            <li class="formula-item">TRUE</li>
                            <li class="formula-item">XOR</li>
                            -->
                          </ul>
                        </li>
                        <!-- <li class="formula-category">
                          <div class="title">
                            <i class="angle-icon icon-angleright"></i>高级函数
                          </div>
                          <ul class="children">
                            <li class="formula-item">MAPX</li>
                            <li class="formula-item">RECNO</li>
                            <li class="formula-item">UUID</li>
                          </ul>
                        </li> -->
                      </ul>
                    </div>
                    <div class="formula-intro">
                      <ul class="intro-wrapper default">
                        <li>请从左侧面板选择字段名和函数，或输入函数</li>
                        <li>
                          公式编辑举例：<span class="formula-name">SUM</span
                          >(<span class="formula-field">基本工资</span>,<span
                            class="formula-field"
                            >加班工资</span
                          >)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button @click="my_is_func = false" size="small">取 消</el-button>
          <el-button type="primary" @click="funcSubmit()" size="small"
            >确 定</el-button
          >
        </div>
      </div>
    </div>
    <div
      class="v-modal1"
      tabindex="0"
      style="z-index: 1999 !important"
      v-show="my_is_func"
    ></div>
  </div>
</template>
<style lang='less'>
.formula-outer1 {
  .v-modal1 {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
  .el-loading-mask {
    z-index: 1 !important;
  }
  .el-message-box {
    width: 800px;
    height: 800px;
    font-size: 14px;
  }
  .flex {
    display: flex;
  }
  .dialog-footer {
    border-top: @border;
    width: 100%;
    // background: red;
    // margin-top: 30px;
    text-align: right;
    padding-right: 10px;
    padding-top: 15px;
    // margin-bottom: -15px;
  }
  .func_middle {
    margin-top: 15px;
    // margin-left: 85px;
  }
  .outcome_state_span {
    display: inline-block;
    margin: auto 5px;
    width: 105px;
    input {
      width: 100% !important;
    }
  }
  .decimal_span {
    display: inline-block;
    width: 60px;
    margin: auto 5px;
    input {
      width: 100% !important;
    }
  }
  .operator {
    margin: 20px auto;
    display: flex;
    .operator_title {
      line-height: 30px;
      font-weight: bold;
    }
  }
  // .selectstring {
  .operator_title {
    // line-height: 30px;
    font-weight: bold;
  }
  // }
  .operator_list {
    padding-left: 5px;
  }
  .operator_list_item {
    color: #333;
    display: inline-block;
    border: @border;
    padding: 3px 8px;
    margin: auto 5px;
    font-size: 14px;
    // font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    height: 30px;
  }
}
</style>
<script>
import $ from 'jquery'
window.jQuery = $
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import "codemirror/theme/ambiance.css";
require("codemirror/mode/javascript/javascript");
// const CodeMirror = require('codemirror/lib/codemirror.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/selection/active-line.js')
// import "codemirror/theme/ambiance.css";
import "codemirror/addon/hint/show-hint.css"
import "@/assets/less/codemirror_style.less"
// require("codemirror/mode/javascript/javascript");


// CodeMirror
// const CodeMirror = require('codemirror/lib/codemirror.js')
// import CodeMirror from 'codemirror/lib/codemirror'
// import "codemirror/theme/ambiance.css";

export default {
  props: {
    is_func: Boolean,
    func_name: String,
    code: String,
    funcnum: Number,
    funclist: Object
  },
  data () {
    return {
      // code: '123',
      my_is_func: false,
      strginglist: [],
      strlist: [],
      str_id_list: [],
      decimal_point: 2,
      outcome_state: 1,
      outcome_list: [{ val: 1, name: '四舍五入' }, { val: 2, name: '向上取整' }, { val: 3, name: '向下取整' }],
      operator_list: [{ name: '≥', val: '≥' }, { name: '≤', val: '≤' }, { name: '>', val: '>' }, { name: '<', val: '<' }, { name: '=', val: '=' }, { name: '|', val: '|' }, { name: '&', val: '&' }, { name: '+', val: '+' }, { name: '-', val: '-' }, { name: '*', val: '*' }, { name: '/', val: '/' }, { name: '(', val: '(' }, { name: ')', val: ')' },
      ],
    }
  },
  watch: {
    code (val) {
      console.log(val)
      var a = {
        id: '123',
        name: 'ddd',
        text: '数字'
      }
      console.log(a);
      console.log(fml)
      // console.log(this.editor)
      // fml.FormulaEditor.insertField(a, true)
    },
    is_func (val) {
      this.my_is_func = val
      let that = this
      console.log(this.funclist)
      if (val) {
        this.getallrulefiled()
        this.$nextTick(function () {
          if (this.funcnum == 2) {
            fml.FormulaEditor.setValue()
            this.decimal_point = this.funclist.decimal_point
            this.outcome_state = this.funclist.outcome_state
            for (let i in that.funclist.strlist) {
              console.log('sdf')
              if (that.funclist.str_id_list[i] <= 'Z' && that.funclist.str_id_list[i] >= 'A') {

                let a = {
                  id: that.funclist.str_id_list[i],
                  name: that.funclist.str_id_list[i],
                  text: that.funclist.strlist[i]
                }
                // console.log(this.editor)
                fml.FormulaEditor.insertField(a, true);//如果是当前表单的工作项 则不需要第二个参数
              } else {

                fml.FormulaEditor.insertOtheritem(that.funclist.strlist[i]);
              }

            }

          }
          else if (this.funcnum == 1) {
            fml.FormulaEditor.setValue()
            this.formulaId = ''
            this.formulaStr = ''
            this.decimal_point = 2
            this.outcome_state = 1


          }
        })
      }
    },
    my_is_func (val) {
      if (!val) {
        this.$emit('back', val)
      }

    }
  },
  methods: {
    icon_close () {
      this.my_is_func = false
    },
    getallrulefiled () {

      this.strginglist = []
      console.log(this.$store.state.formItemList)
      this.strginglist = JSON.parse(JSON.stringify(this.$store.state.formItemList))
      console.log(this.strginglist)

    },
    addOtherClick (val) {
      console.log(val)
      fml.FormulaEditor.insertOtheritem(val.name);
    },
    addStrClick (val) {
      console.log(val.currentTarget.getAttribute("name"))
      console.log(val.target)
      var it = $(this);
      let a = {
        id: val.currentTarget.getAttribute("name"),
        name: val.currentTarget.getAttribute("name"),
        text: val.target.innerText
      }
      console.log(a)
      fml.FormulaEditor.insertField(a, true);//如果是当前表单的工作项 则不需要第二个参数

    },
    checkFunc () {
      let others = fml.FormulaEditor.getValue()

      this.strlist = others.strlist
      this.str_id_list = others.strlistid
      if (others.formula == '') {
        this.$alert('公式未填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      console.log(this.str_id_list)
      // return false
      let $this = this
      let payload = {
        formula_methods: JSON.stringify(this.str_id_list),
        userid: $this.$store.state.userid,
        corpid: $this.$store.state.corpid

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkformula'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.$message({
          message: '公式校验成功！',
          type: 'success'
        });

      }).catch(err => {
        console.log(err)
      })
    },
    funcSubmit () {
      let $this = this
      let others = fml.FormulaEditor.getValue()

      this.strlist = others.strlist
      this.str_id_list = others.strlistid
      if (others.formula == '') {
        this.$alert('公式未填写！', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }

      let backstr = { formulaStr: this.strlist, formulaId: this.str_id_list, decimal_point: this.decimal_point, outcome_state: this.outcome_state }
      console.log(backstr)
      let payload = {
        formula_methods: JSON.stringify(this.str_id_list),
        userid: $this.$store.state.userid,
        corpid: $this.$store.state.corpid

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkformula'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then(() => {
        console.log(this.strlist)
        console.log(this.str_id_list)
        $this.$emit('subBack', { strlist: this.strlist, str_id_list: this.str_id_list, formulaStr: this.strlist, formulaId: this.str_id_list, decimal_point: this.decimal_point, outcome_state: this.outcome_state })


        $this.my_is_func = false

      }).catch(err => {
        console.log(err)
      })

    },
  },
  mounted () {
    let $this = this
    this.$nextTick(() => {

      (function (mod) {
        if (typeof exports == "object" && typeof module == "object") // CommonJS
          mod(require("codemirror/lib/codemirror.js"));
        else if (typeof define == "function" && define.amd) // AMD
          define(["codemirror/lib/codemirror.js"], mod);
        else // Plain browser env
          mod(CodeMirror);
      })(function (a) {
        function b (a, b) {
          for (var c = 0, d = a.length; c < d; ++c)
            b(a[c])
        }
        function c (a, b) {
          if (!Array.prototype.indexOf) {
            for (var c = a.length; c--;)
              if (a[c] === b)
                return !0;
            return !1
          }
          return a.indexOf(b) != -1
        }
        function d (b, c, d, e) {
          var h = b.getCursor(),
            i = d(b, h);
          if (!/\b(?:string)\b/.test(i.type)) {
            i.state = a.innerMode(b.getMode(), i.state).state,
              /^[\w$_]*$/.test(i.string) ? i.end > h.ch && (i.end = h.ch, i.string = i.string.slice(0, h.ch - i.start)) : i = {
                start: h.ch,
                end: h.ch,
                string: "",
                state: i.state,
                type: "." == i.string ? "property" : null
              };
            for (var j = i; "property" == j.type;) {
              if (j = d(b, g(h.line, j.start)), "." != j.string)
                return;
              if (j = d(b, g(h.line, j.start)), !k)
                var k = [];
              k.push(j)
            }
            return {
              list: f(i, k, c, e),
              from: g(h.line, i.start),
              to: g(h.line, i.end)
            }
          }
        }
        function e (b, c) {
          return d(b, a.fomulaContext, function (a, b) {
            return a.getTokenAt(b)
          }, c)
        }
        function f (a, d, e, f) {
          function g (a) {
            0 != a.lastIndexOf(i, 0) || c(h, a) || h.push(a)
          }
          var h = [],
            i = a.string.toUpperCase();
          return i ? (d && d.length ? d.pop() : b(e, g), h) : h
        }
        var g = a.Pos;
        a.registerHelper("hint", "formula", e)
        "use strict";
        a.defineMode("formula", function () {
          function b (a) {
            for (var b = {}, c = 0, d = a.length; c < d; ++c)
              b[a[c]] = !0;
            return b
          }
          function c (a, b) {
            if (a.eatSpace())
              return null;
            var c = a.next();
            if ('"' === c || "'" === c)
              return d(a, c), "string";
            if ("â€‹" === c)
              return d(a, c), "field";
            if (/[\[\],\(\)]/.test(c))
              return "bracket";
            if (/[+\-*\/=<>#!&|≥%≤;]/.test(c))
              return "operator";
            if (/\d/.test(c))
              return a.eatWhile(/[\d\.]/), "number";
            a.eatWhile(/[\w]/);
            var e = a.current();
            return f.hasOwnProperty(e) ? "atom" : g.hasOwnProperty(e) ? "keyword" : h.hasOwnProperty(e) ? "deprecate" : null
          }
          function d (a, b) {
            for (var c, d = !1; null != (c = a.next());) {
              if (c === b && !d)
                return !1;
              d = !d && "\\" === c
            }
            return d
          }
          function e (a, b) {
            return (b.tokens[0] || c)(a, b)
          }
          var f = b(["false", "true"]),
            g = b(a.fomulaContext),
            h = b(["MAP"]);
          return {
            startState: function () {
              return {
                tokens: []
              }
            },
            token: function (a, b) {
              return e(a, b)
            },
            fold: "brace"
          }
        }),
          a.defineMIME("text/fx-formula", "formula")
      });




      window.fml = window.fml || {};

      var a = $;
      fml.STATIC = {
        _st: (new Date).getTime(),
        _ct: (new Date).getTime(),
        zIndex: 8e3,
        Language: "zh",
        num: 0,
        IDBase: new Date - 0,
        CSRF: a('meta[name="csrf-token"]').attr("content"),
        site: window.location.protocol + "//" + window.location.hostname
      }
      fml.Utils = {
        isString: function (a) {
          return "string" == typeof a
        },
        isNumber: function (b) {
          return a.isNumeric(b)
        },
        isFunction: function (b) {
          return a.isFunction(b)
        },
        isDate: function (a) {
          return a instanceof Date
        },
        isArray: function (b) {
          return a.isArray(b)
        },
        isEmpty: function (a) {
          return "" === a || fml.Utils.isNull(a)
        },
        isBlank: function (a) {
          return fml.Utils.isNull(a) || "" === a.trim()
        },
        isNull: function (a) {
          return null == a
        },
        isObjectEmpty: function (a) {
          if (null == a)
            return !0;
          if (a.length > 0)
            return !1;
          if (0 === a.length)
            return !0;
          for (var b in a)
            if (hasOwnProperty.call(a, b))
              return !1;
          return isNaN(a)
        },
        isValueWidget: function (a) {
          return !!fml.ValueWidgets[a]
        },
        address2Str: function (a, b, c) {
          if (c && a) {
            b = "";
            var d = !0;
            /p/.test(c) && a.province && (b += a.province, a.province === a.city && (d = !1)),
              /c/.test(c) && a.city && d && (b += a.city),
              /d/.test(c) && a.district && (b += a.district),
              /a/.test(c) && a.detail && (b += a.detail)
          }
          return b
        },
        num2Str: function (a, b) {
          if (fml.Utils.isEmpty(a))
            return "";
          var c = a + "";
          if (fml.Utils.isEmpty(b))
            return c;
          var d = /\[Num0\]/;
          if (d.test(b))
            return b.replace(d, c);
          if (d = /\[Num1\]/, d.test(b))
            return b.replace(d, fml.Utils._num2CN(c, !1));
          if (d = /\[Num2\]/, d.test(b))
            return b.replace(d, fml.Utils._num2CN(c, !0));
          d = /[#0]+,?[#0]*\.?[#0]*%?/;
          var e = b.match(d);
          if (e && e.length > 0) {
            var f = e[0];
            return c = fml.Utils._numberFormat(a, f),
              b.replace(d, c)
          }
          return b
        },
        _numberFormat: function (a, b) {
          var c = "",
            d = a + "";
          if (/%$/.test(b)) {
            c = "%",
              a = 100 * a,
              b = b.replace("%", "");
            var e = d.indexOf(".");
            if (e > -1) {
              var f = d.length - 3 - e;
              f = f < 0 ? 0 : f > 8 ? 8 : f,
                a = parseFloat(a.toFixed(f))
            }
            d = a + ""
          }
          var g = b.split("."),
            h = g[0],
            i = g[1];
          if ("" !== i) {
            var j = i ? i.length : 0;
            d = parseFloat(a).toFixed(j);
            for (var k = d.split(""), l = j; l > 0 && "#" === i.charAt(l - 1); l--) {
              var m = k.pop();
              if ("0" !== m) {
                k.push(m);
                break
              }
            }
            var n = k.pop();
            "." === n && (n = ""),
              d = k.join("") + n
          }
          var o = d.split("."),
            p = o[0];
          if (/,/.test(h))
            o[0] = p.replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
          else {
            var q = h.match(/[0]+[0#]*$/);
            q && q.length > 0 && (o[0] = fml.Utils.leftPad(p, q[0].length, "0"))
          }
          return o.join(".") + c
        },
        _num2CN: function (a, b) {
          var c = "〇一二三四五六七八九",
            d = "个十百千万亿";
          b && (c = "零壹贰叁肆伍陆柒捌玖", d = "个拾佰仟万亿");
          var e = Math.floor(Math.abs(a)),
            f = Math.abs(a).toString(),
            g = f.replace(/\..*$/, ""),
            h = f.split("."),
            i = c,
            j = d,
            k = "-.",
            l = i[0],
            m = new RegExp(i[0] + "*$"),
            n = new RegExp(i[0] + "+", "g"),
            o = "",
            p = "";
          if (o = a < 0 ? k[0] : "", h.length >= 2) {
            var q = h[1];
            if (q) {
              p = k[1];
              for (var r = 0; r < q.length; r++)
                p += i[+q[r]]
            }
          }
          if (1 == g.length)
            return o + i[e] + p;
          if (g.length <= 5) {
            for (var s = "", t = 0, e = g.length; e--;) {
              var u = +g[t];
              s += this._num2CN(g[t], b) + (u && e ? j[e] : ""),
                t++
            }
            return s = s.replace(n, l),
              s = s.replace(m, ""),
              o + s + p
          }
          for (var v = g.length / 4 >> 0, w = g.length % 4, s = ""; 0 == w || !j[3 + v];)
            w += 4, v--;
          if (+g.substr(0, w)) {
            s = this._num2CN(g.substr(0, w), b) + j[3 + v];
            var x = g.substr(w);
            "0" === x[0] && (s += i[0]),
              s += this._num2CN(x, b)
          } else
            s = this._num2CN(g.substr(0, w), b) + this._num2CN(g.substr(w), b);
          return s = s.replace(n, l),
            s = s.replace(m, ""),
            o + s + p
        },
        date2Str: function (a, b) {
          if (!a)
            return "";
          var c = b.length,
            d = "";
          if (c > 0) {
            for (var e = b.charAt(0), f = 0, g = e, h = 1; h < c; h++) {
              var i = b.charAt(h);
              e !== i ? (d += fml.Utils._compileDateFormat({
                char: e,
                str: g,
                len: h - f
              }, a), e = i, f = h, g = e) : g += i
            }
            d += fml.Utils._compileDateFormat({
              char: e,
              str: g,
              len: c - f
            }, a)
          }
          return d
        },
        _compileDateFormat: function (a, b) {
          var c = a.str,
            d = a.len,
            e = a.char;
          switch (e) {
            case "E":
              c = d > 2 ? Date._DN[b.getDay()] : d > 1 ? Date._SDN[b.getDay()] : b.getDay() + "";
              break;
            case "y":
              c = d <= 3 ? (b.getFullYear() + "").slice(2, 4) : b.getFullYear();
              break;
            case "M":
              c = d > 2 ? Date._MN[b.getMonth()] : d < 2 ? b.getMonth() + 1 : fml.Utils.leftPad(b.getMonth() + 1 + "", 2, "0");
              break;
            case "d":
              c = d > 1 ? fml.Utils.leftPad(b.getDate() + "", 2, "0") : b.getDate();
              break;
            case "h":
              var f = b.getHours() % 12;
              0 === f && (f = 12),
                c = d > 1 ? fml.Utils.leftPad(f + "", 2, "0") : f;
              break;
            case "H":
              c = d > 1 ? fml.Utils.leftPad(b.getHours() + "", 2, "0") : b.getHours();
              break;
            case "m":
              c = d > 1 ? fml.Utils.leftPad(b.getMinutes() + "", 2, "0") : b.getMinutes();
              break;
            case "s":
              c = d > 1 ? fml.Utils.leftPad(b.getSeconds() + "", 2, "0") : b.getSeconds();
              break;
            case "a":
              c = b.getHours() < 12 ? "am" : "pm";
              break;
            default:
              c = a.str
          }
          return c
        },
        pick: function (a, b) {
          var c = {};
          return fml.Utils.forEach(b, function (b, d) {
            d in a && (c[d] = a[d])
          }),
            c
        },
        applyFunc: function (a, b, c, d) {
          return fml.Utils.isFunction(b) ? b.apply(a, c ? c : []) : d
        },
        forEach: function (a, b) {
          if (Array.isArray(a) || a instanceof jQuery)
            for (var c = 0, d = a.length; c < d && b.apply(a[c], [c, a[c]]) !== !1; c++);
          else if (a && "object" == typeof a)
            for (var e in a)
              if (a.hasOwnProperty(e) && b.apply(a[e], [e, a[e]]) === !1)
                break
        },
        flatten: function (a, b, c) {
          if (c || (c = []), a)
            for (var d = 0, e = a.length; d < e; d++) {
              var f = a[d];
              Array.isArray(f) ? fml.Utils.flatten(f, b, c) : b && !b(f) || c.push(f)
            }
          return c
        },
        applyCss: function (a, b) {
          fml.Utils.isEmpty(b) || (fml.Utils.isString(b) ? a.addClass(b) : a.css(b))
        },
        getServerDate: function (a) {
          if (a && a.getResponseHeader) {
            var b = a.getResponseHeader("date");
            b && (fml.STATIC._st = new Date(b).getTime(), fml.STATIC._ct = (new Date).getTime())
          }
        },
        getUrlParameter: function (a) {
          for (var b = window.location.search.substring(1), c = b.split("&"), d = 0; d < c.length; d++) {
            var e = c[d].split("=");
            if (e[0] == a)
              return e[1]
          }
          return null
        },
        validateEmail: function (a) {
          return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(a)
        },
        redirectTo: function (a) {
          window.location.href = a
        },
        isCanvasSupported: function () {
          var a = document.createElement("canvas");
          return !(!a.getContext || !a.getContext("2d"))
        },
        isFormDataSupported: function () {
          return void 0 !== window.FormData
        },

        evalFormula: function (a) {
          var b = [];
          fml.Utils.forEach(Object.keys(fml.Formula), function (a, c) {
            b.push("var " + c + "=fml.Formula." + c)
          });
          var it = b.join(";") + ";";
          var c = new Function(it + "return " + a)();
          return c
        },
        createEntryAttributeField: function (b, c) {
          var d = {
            id: c.entryId
          };
          switch (b) {
            case "ext":
              a.extend(d, {
                name: "ext",
                type: "text",
                text: "扩展字段",
                items: c.extParams
              });
              break;
            case "createTime":
              a.extend(d, {
                name: "createTime",
                type: "datetime",
                format: "yyyy-MM-dd HH:mm:ss",
                text: "提交时间"
              });
              break;
            case "updateTime":
              a.extend(d, {
                name: "updateTime",
                type: "datetime",
                format: "yyyy-MM-dd HH:mm:ss",
                text: "更新时间"
              });
              break;
            case "creator":
              a.extend(d, {
                name: "creator",
                type: "text",
                text: "提交人"
              });
              break;
            case "flowState":
              a.extend(d, {
                name: "flowState",
                type: "flowState",
                text: "流程状态"
              });
              break;
            case "chargers":
              a.extend(d, {
                name: "chargers",
                type: "chargers",
                text: "当前节点/负责人"
              });
              break;
            case "deleter":
              a.extend(d, {
                name: "deleter",
                type: "text",
                text: "删除人"
              });
              break;
            case "deleteTime":
              a.extend(d, {
                name: "deleteTime",
                type: "datetime",
                format: "yyyy-MM-dd HH:mm:ss",
                text: "删除时间"
              });
              break;
            default:
              return null
          }
          return d
        },
        createWidgetName: function () {
          console.log('00999')
          return "_widget_" + fml.STATIC.IDBase++
        },
        formatFileSize: function (a) {
          return fml.Utils.isNumber(a) ? a >= 1e9 ? (a / 1e9).toFixed(2) + " GB" : a >= 1e6 ? (a / 1e6).toFixed(2) + " MB" : (a / 1e3).toFixed(2) + " KB" : "æœªçŸ¥"
        },
        chunkArray: function (a, b) {
          var c = [];
          if (!b || !a.length)
            return c;
          for (var d = 0, e = a.length; d < e; d += b) {
            var f = a.slice(d, d + b);
            c.push(f)
          }
          return c
        },
        UUID: function (a) {
          return a ? (a ^ 16 * Math.random() >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.UUID)
        },
        GCD: function (a, b) {
          return b ? this.GCD(b, a % b) : a
        },
        LCM: function (a, b) {
          return a * b / this.GCD(a, b)
        },
        fixDecimalPrecision: function (a, b) {
          var c = "";
          if (b || (b = 8), !this.isEmpty(a)) {
            var d = parseFloat(a);
            if (!isNaN(d)) {
              var e = (d + "").split(".")[1];
              c = e && e.length > b ? parseFloat(d.toFixed(b)) : d,
                b > 6 && Math.abs(c) < 1 && /e-/.test(c + "") && (c = parseFloat(d.toFixed(6)))
            }
          }
          return c
        },
        getSelectionText: function () {
          return window.getSelection ? window.getSelection().toString() : document.selection && document.selection.createRange ? document.selection.createRange().text : ""
        },
        getCorpType: function (a) {
          return a ? (a = a.toLowerCase(), /^ding/.test(a) ? "dingtalk" : /^w/.test(a) ? "wechat" : "internal") : null
        },
        isCorpSuiteAdmin: function (a) {
          return a && ("dingtalk" === a || "wechat" === a)
        },
        getWeekStartDate: function (a) {
          var b = a.getDay();
          return 0 === b && (b = 7),
            new Date(a.getFullYear(), a.getMonth(), a.getDate() - (b - 1))
        },
        getWeekEndDate: function (a) {
          var b = a.getDay();
          return 0 === b && (b = 7),
            new Date(a.getFullYear(), a.getMonth(), a.getDate() + (7 - b))
        },
        getMonthStartDate: function (a) {
          return new Date(a.getFullYear(), a.getMonth(), 1)
        },
        getMonthEndDate: function (a) {
          return new Date(a.getFullYear(), a.getMonth() + 1, 0)
        },
        setPageTitle: function (a) {
          fml.Utils.isEmpty(a) || (document.title = a)
        },
        createMask: function (b, c) {
          var d = a('<div class="x-window-mask"/>'),
            e = c || {};
          if (e.isModal && d.addClass("modal"), e.isLight ? d.addClass("light") : e.isDark && d.addClass("dark"), e.hasLoader) {
            var f = !e.isDark;
            this.createLoadIcon(d, f)
          }
          return b && d.css({
            "z-index": fml.STATIC.zIndex++
          }).appendTo(b),
            d
        },
        createLoadIcon: function (b, c) {
          var d = a('<div class="x-loader-icon"/>').appendTo(b);
          return c && d.addClass("colorful"),
            a("<div/>").appendTo(d),
            d
        },
        doPrint: function (b, c) {
          a("body").children("div").addClass("x-ui-notprint");
          var d = a("#x-printer").removeClass().empty();
          0 === d.length && (d = a('<div id="x-printer"/>').appendTo("body")),
            b && d.append(b),
            c = fml.Utils.isNull(c) ? 0 : c,
            setTimeout(function () {
              window.print()
            }, c)
        },
        cancelPrint: function () {
          a("body").children(".x-ui-notprint").removeClass("x-ui-notprint"),
            a("#x-printer").remove()
        },
        copyToClipboard: function (a, b) {
          if (a && a.length) {
            var c = document.createElement("textarea");
            c.style.background = "transparent",
              c.style.color = "transparent",
              c.value = a,
              document.body.appendChild(c),
              c.select();
            var d;
            try {
              d = document.execCommand("copy")
            } catch (a) {
              d = !1
            }
            document.body.removeChild(c),
              d && fml.Utils.applyFunc(this, b, [], !1)
          }
        },
        getColorNumber: function (a) {
          return fml.Utils.isEmpty(a) ? 1 : parseInt(a.toString().substring(0, 8), 16) % 6 + 1
        },
        getFieldAttr: function (b, c) {
          if (!fml.Utils.isValueWidget(b.widget.type))
            return null;
          if (c && c.indexOf(b.widget.type) < 0)
            return null;
          var d = {
            id: b.formId,
            text: b.label,
            name: b.widget.widgetName,
            type: b.widget.type
          };
          switch (b.widget.type) {
            case "subform":
              var e = [];
              fml.Utils.forEach(b.widget.items, function (d, f) {
                a.extend(f, {
                  formId: b.formId
                });
                var g = fml.Utils.getFieldAttr(f, c);
                g && (a.extend(g, {
                  subform: b.widget.widgetName
                }), e.push(g))
              }),
                a.extend(d, {
                  items: e
                });
              break;
            case "linkdata":
              a.extend(d, {
                linkForm: b.widget.linkForm,
                linkFields: b.widget.linkFields,
                refAppId: b.widget.refAppId
              });
              break;
            case "combo":
            case "combocheck":
            case "radiogroup":
            case "checkboxgroup":
              a.extend(d, {
                async: b.widget.async,
                items: b.widget.items
              });
              break;
            case "datetime":
              a.extend(d, {
                format: b.widget.format
              })
          }
          return d
        },
        leftPad: function (a, b, c) {
          var d = String(a);
          for (c || (c = " "); d.length < b;)
            d = c + d;
          return d.toString()
        },
        startWith: function (a, b) {
          var c = a.length;
          return !(null == b || "" == b || 0 === c || b.length > c) && a.substr(0, b.length) == b
        },
        getFieldInfoByFormula: function (a) {
          var b = {},
            c = a + "",
            d = c.match(/(\$[0-9a-zA-Z\._]+)(#[0-9a-f]+)?(@[0-9a-f]+)?/),
            e = ["", "field", "entryId", "appId"];
          return fml.Utils.forEach(d, function (a, c) {
            0 !== a && c && (b[e[a]] = c.substr(1))
          }),
            b
        },
        getFieldInfoById: function (a) {
          var b = {};
          a = "#" + a;
          var c = a.match(/(#[0-9a-f]+)(@[0-9a-f]+)?/),
            d = ["", "entryId", "appId"];
          return fml.Utils.forEach(c, function (a, c) {
            0 !== a && c && (b[d[a]] = c.substr(1))
          }),
            b
        },
        isWpsWebView: function () {
          return /wpscloudform/.test(navigator.userAgent)
        },
        callWPSAPI: function (a) {
          var b = "jsAsynCall(" + JSON.stringify(a) + ")";
          window.cefQuery && window.cefQuery({
            request: b
          })
        },
        onWPSPageUnload: function (a, b) {
          a ? fml.Msg.alert({
            type: "warning",
            msg: "å½“å‰é¡µé¢æœªä¿å­˜ï¼Œæ˜¯å¦ç¡®å®šç¦»å¼€ï¼Ÿ",
            text4Ok: "ç¦»å¼€",
            text4Cancel: "å–æ¶ˆ",
            onOk: function () {
              fml.Utils.applyFunc(this, b, [], !1)
            }
          }) : fml.Utils.applyFunc(this, b, [], !1)
        },
        fileDownload: function (a, b) {
          if (fml.Utils.isWpsWebView()) {
            var c = {
              method: "downloadUrl",
              url: a,
              filename: b
            },
              d = b && b.split(".").pop();
            c.filter = "(*." + (d || "*") + ")",
              fml.Utils.callWPSAPI(c)
          } else
            fml.Utils.redirectTo(a)
        },
        isSupportPdf: function () {
          return "undefined" != typeof navigator.mimeTypes["application/pdf"]
        },
        dt: function (a, b) {
          if (a) {
            var c = ["e=" + a, "t=" + (new Date).getTime()];
            fml.Utils.isEmpty(b) || c.push("ext=" + b),
              fml.STATIC.user && fml.STATIC.user.username && c.push("u=" + fml.STATIC.user.username);
            var d = new Image;
            d.src = fml.CONFIG.HOST.TRACK_HOST + "/log?" + c.join("&")
          }
        }
      }
      fml.Formula = {
        AND: function () {
          for (var a = fml.Utils.flatten(arguments), b = 0, c = a.length; b < c; b++)
            if (!a[b])
              return !1;
          return !0
        },
        OR: function () {
          for (var a = fml.Utils.flatten(arguments), b = 0, c = a.length; b < c; b++)
            if (a[b])
              return !0;
          return !1
        },
        FALSE: function () {
          return !1
        },
        TRUE: function () {
          return !0
        },
        IFS: function (a, b, c) {
          return a ? b : c
        },
        IF: function (a, b, c) {
          return a ? b : c
        },
        NOT: function (a) {
          return !a
        },
        XOR: function () {
          for (var a = 0, b = fml.Utils.flatten(arguments), c = 0, d = b.length; c < d; c++)
            b[c] && a++;
          return !!(1 & Math.floor(Math.abs(a)))
        },
        CONCATENATE: function () {
          for (var a = fml.Utils.flatten(arguments), b = 0; (b = a.indexOf(!0)) > -1;)
            a[b] = "TRUE";
          for (var c = 0; (c = a.indexOf(!1)) > -1;)
            a[c] = "FALSE";
          return a.join("")
        },
        EXACT: function (a, b) {
          return a === b
        },
        LEFT: function (a, b) {
          return b = fml.Utils.isEmpty(b) ? 1 : b,
            a ? a.substring(0, b) : ""
        },
        LEN: function (a) {
          return fml.Utils.isString(a) ? a ? a.length : 0 : a && a.length ? a.length : 0
        },
        LOWER: function (a) {
          return fml.Utils.isString(a) ? a ? a.toLowerCase() : a : ""
        },
        REPLACE: function (a, b, c, d) {
          return fml.Utils.isNumber(b) && fml.Utils.isNumber(c) ? (a = a || "", d = d || "", a.substr(0, b - 1) + d + a.substr(b - 1 + c)) : a
        },
        REPT: function (a, b) {
          return b = b || 0,
            new Array(b + 1).join(a)
        },
        RIGHT: function (a, b) {
          return b = void 0 === b ? 1 : b,
            a ? a.substring(a.length - b) : ""
        },
        SEARCH: function (a, b, c) {
          var d;
          return fml.Utils.isString(a) && fml.Utils.isString(b) ? (c = fml.Utils.isNull(c) ? 0 : c, d = b.toLowerCase().indexOf(a.toLowerCase(), c - 1) + 1) : 0
        },
        SPLIT: function (a, b) {
          return fml.Utils.isString(a) ? a.split(b) : []
        },
        TRIM: function (a) {
          return fml.Utils.isString(a) ? a.replace(/ +/g, " ").trim() : ""
        },
        UPPER: function (a) {
          return fml.Utils.isString(a) ? a.toUpperCase() : ""
        },
        MID: function (a, b, c) {
          return a = a || "",
            fml.Utils.isNumber(b) && fml.Utils.isNumber(c) ? a.substr(b - 1, c) : a
        },
        AVERAGE: function () {
          for (var a = fml.Utils.flatten(arguments, function (a) {
            return fml.Utils.isNumber(a)
          }), b = a.length, c = 0, d = 0, e = 0; e < b; e++)
            c += a[e], d += 1;
          return c / d
        },
        COUNT: function () {
          return fml.Utils.flatten(arguments).length
        },
        COUNTIF: function () {
          var arr = arguments[0], condition = arguments[1];
          var len = 0;
          if (condition.indexOf(">") == -1 && condition.indexOf("=") == -1 && condition.indexOf("<") == -1) {
            for (var i = 0; i < arr.length; i++) {
              var a = arr[i];
              if (a == condition) {
                len++;
              }
            }
            return len;
          } else {
            for (var i = 0; i < arr.length; i++) {
              var a = arr[i];
              if (typeof a == "number" && !!new Function("return " + a + condition)()) {
                len++;
              }
            }
            return len;
          }
        },
        LARGE: function (a, b) {
          return a = fml.Utils.flatten(a, function (a) {
            return fml.Utils.isNumber(a)
          }),
            a.sort(function (a, b) {
              return b - a
            })[b - 1]
        },
        MAX: function () {
          var a = fml.Utils.flatten(arguments, function (a) {
            return fml.Utils.isNumber(a)
          });
          return 0 === a.length ? 0 : Math.max.apply(Math, a)
        },
        MIN: function () {
          var a = fml.Utils.flatten(arguments, function (a) {
            return fml.Utils.isNumber(a)
          });
          return 0 === a.length ? 0 : Math.min.apply(Math, a)
        },
        SMALL: function (a, b) {
          return a = fml.Utils.flatten(a, function (a) {
            return fml.Utils.isNumber(a)
          }),
            a.sort(function (a, b) {
              return a - b
            })[b - 1]
        },
        ABS: function (a) {
          return fml.Utils.isNumber(a) ? Math.abs(a) : 0
        },
        ROUND: function (a, b) {
          return Math.round(a * Math.pow(10, b)) / Math.pow(10, b)
        },
        CEILING: function (a, b) {
          if (0 === b)
            return 0;
          var c = b < 0 ? -1 : 0;
          b = Math.abs(b);
          var d = b - Math.floor(b),
            e = 0;
          return d > 0 && (e = -Math.floor(Math.log(d) / Math.log(10))),
            a >= 0 ? fml.Formula.ROUND(Math.ceil(a / b) * b, e) : 0 === c ? -fml.Formula.ROUND(Math.floor(Math.abs(a) / b) * b, e) : -fml.Formula.ROUND(Math.ceil(Math.abs(a) / b) * b, e)
        },
        FLOOR: function (a, b) {
          if (0 === b)
            return 0;
          if (!(a > 0 && b > 0 || a < 0 && b < 0))
            return 0;
          b = Math.abs(b);
          var c = b - Math.floor(b),
            d = 0;
          return c > 0 && (d = -Math.floor(Math.log(c) / Math.log(10))),
            a >= 0 ? fml.Formula.ROUND(Math.floor(a / b) * b, d) : -fml.Formula.ROUND(Math.floor(Math.abs(a) / b) * b, d)
        },
        INT: function (a) {
          return fml.Utils.isNumber(a) ? Math.floor(a) : 0
        },
        LOG: function (a, b) {
          return b = void 0 === b ? 10 : b,
            fml.Utils.isNumber(b) ? Math.log(a) / Math.log(b) : 0
        },
        MOD: function (a, b) {
          if (0 === b)
            return 0;
          var c = Math.abs(a % b);
          return b > 0 ? c : -c
        },
        POWER: function (a, b) {
          var c = Math.pow(a, b);
          return isNaN(c) ? 0 : c
        },
        PRODUCT: function () {
          for (var a = fml.Utils.flatten(arguments, function (a) {
            return fml.Utils.isNumber(a)
          }), b = 1, c = 0; c < a.length; c++)
            b *= a[c];
          return b
        },
        SQRT: function (a) {
          return a < 0 ? 0 : Math.sqrt(a)
        },
        SUM: function () {
          for (var a = 0, b = fml.Utils.flatten(arguments, function (a) {
            return fml.Utils.isNumber(a)
          }), c = 0, d = b.length; c < d; ++c)
            a += b[c];
          return a
        },
        SUMPRODUCT: function () {
          for (var a = 0, b = [], c = -1, d = 0; d < arguments.length; d++)
            arguments[d] instanceof Array && (c = c < 0 ? arguments[d].length : Math.min(arguments[d].length, c), b.push(arguments[d]));
          for (var e, f, g, h = 0; h < c; h++) {
            for (e = 1, f = 0; f < b.length; f++)
              g = parseFloat(b[f][h]), isNaN(g) && (g = 0), e *= g;
            a += e
          }
          return a
        },
        FIXED: function (a, b) {
          return b = void 0 === b ? 0 : b,
            fml.Utils.isNumber(b) && b >= 0 ? Number(a).toFixed(b) : ""
        },
        DATE: function () {
          return 6 === arguments.length ? new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10), parseInt(arguments[3], 10), parseInt(arguments[4], 10), parseInt(arguments[5], 10)) : 3 === arguments.length ? new Date(parseInt(arguments[0], 10), parseInt(arguments[1], 10) - 1, parseInt(arguments[2], 10)) : new Date(arguments[0])
        },
        TIME: function (a, b, c) {
          return (3600 * a + 60 * b + c) / 86400
        },
        TIMESTAMP: function (a) {
          return fml.Utils.isDate(a) ? a.getTime() : 0
        },
        TODAY: function () {
          return new Date
        },
        NOW: function () {
          return new Date
        },
        SYSTIME: function () {
          var a = fml.STATIC._st,
            b = (new Date).getTime() - fml.STATIC._ct;
          return b > 0 && b < 36e5 && (a += b),
            new Date(a)
        },
        DAY: function (a) {
          return a.getDate()
        },
        MONTH: function (a) {
          return a.getMonth() + 1
        },
        YEAR: function (a) {
          return a.getFullYear()
        },
        HOUR: function (a) {
          return a.getHours()
        },
        MINUTE: function (a) {
          return a.getMinutes()
        },
        SECOND: function (a) {
          return a.getSeconds()
        },
        DAYS: function (a, b) {
          var c = new Date(a.getFullYear(), a.getMonth(), a.getDate()),
            d = new Date(b.getFullYear(), b.getMonth(), b.getDate());
          return (c - d) / 864e5
        },
        DAYS360: function (a, b, c) {
          var d,
            e,
            f = b.getMonth(),
            g = a.getMonth();
          if (c)
            d = 31 === b.getDate() ? 30 : b.getDate(), e = 31 === a.getDate() ? 30 : a.getDate();
          else {
            var h = new Date(b.getFullYear(), f + 1, 0).getDate(),
              i = new Date(a.getFullYear(), g + 1, 0).getDate();
            d = b.getDate() === h ? 30 : b.getDate(),
              a.getDate() === i ? d < 30 ? (g++, e = 1) : e = 30 : e = a.getDate()
          }
          return 360 * (a.getFullYear() - b.getFullYear()) + 30 * (g - f) + (e - d)
        },
        DATEDELTA: function (a, b) {
          return fml.Utils.isNumber(b) || (b = 0),
            new Date(a.getTime() + 864e5 * b)
        },
        ISOWEEKNUM: function (a) {
          a.setHours(0, 0, 0),
            a.setDate(a.getDate() + 4 - (a.getDay() || 7));
          var b = new Date(a.getFullYear(), 0, 1);
          return Math.ceil(((a - b) / 864e5 + 1) / 7)
        },
        WEEKNUM: function (a, b) {
          var c = 2 === b ? 1 : 0,
            d = new Date(a.getFullYear(), 0, 1),
            e = (c + 7 - d.getDay()) % 7,
            f = e > 0 ? 1 : 0,
            g = d.getTime() + 24 * e * 60 * 60 * 1e3;
          return Math.floor((a.getTime() - g) / 864e5 / 7 + 1) + f
        },
        TEXT: function (a, b) {
          return fml.Utils.isNull(a) ? "" : fml.Utils.isDate(a) && !fml.Utils.isEmpty(b) ? fml.Utils.date2Str(a, b) : fml.Utils.num2Str(a, b)
        },
        VALUE: function (a) {
          return fml.Utils.isEmpty(a) ? 0 : isNaN(a) ? 0 : parseFloat(a)
        },
        UUID: function () {
          return fml.Utils.UUID()
        },

        ISEMPTY: function (a) {
          return fml.Utils.isObjectEmpty(a)
        },
        GETUSERNAME: function () {//需修改
          return fml.STATIC.user ? fml.STATIC.user.nickname : ""
        }
      }
      fml.FormulaUsage = [{
        category: "数学函数",
        // docUrl: "https://hc.jiandaoyun.com/doc/9035",
        contains: [{
          name: "ABS",
          intro: "ABS函数可以获取一个数的绝对值",
          usage: "ABS(数字)",
          example: "ABS(-8)可以返回8，也就是-8的绝对值"
        }, {
          name: "AVERAGE",
          intro: "AVERAGE函数可以获取一组数值的算术平均值",
          usage: "AVERAGE(数字1;数字2;...)",
          example: "AVERAGE({语文成绩};{数学成绩}; {英语成绩})返回三门课程的平均分"
        }, {
          name: "CEILING",
          intro: "CEILING函数可以将数字增大到最接近原值的指定因数的倍数",
          usage: "CEILING(数字,因数)",
          example: "CEILING(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字"
        }, {
          name: "COUNT",
          intro: "COUNT函数可以获取参数的数量",
          usage: "COUNT(值,值,...)",
          example: "COUNT(小明,小王,小张,小李)返回4，也就是人员的数量"
        }, {
          name: "COUNTIF",
          intro: "COUNTIF函数可以获取数组中满足条件的参数个数",
          usage: 'COUNTIF(数组,"条件")',
          example: 'COUNTIF(子表单.性别, "女")，可得到子表单中性别填的是"女"的数据条数；COUNTIF([1,2,3,4],">2")，可得到1,2,3,4中大于2的数字数量，结果为2。'
        }, {
          name: "FIXED",
          intro: "FIXED函数可将数字舍入到指定的小数位数并输出为文本",
          usage: "FIXED(数字,小数位数)",
          example: 'FIXED(3.1415,2)返回"3.14"'
        }, {
          name: "FLOOR",
          intro: "FLOOR函数可将数字减小到最接近原值的指定因数的倍数",
          usage: "FLOOR(数字,因数)",
          example: "FLOOR(7,6)返回6，因为6比7小的同时，也是6的倍数中最接近7的数字"
        }, {
          name: "INT",
          intro: "INT函数可以获取一个数的整数部分",
          usage: "INT(数字)",
          example: "INT(3.1415)返回3，也就是3.1415的整数部分"
        }, {
          name: "LARGE",
          intro: "LARGE函数可以获取数据集中第k个最大值",
          usage: "LARGE(数组,k)",
          example: 'LARGE({学生成绩.数学成绩},1)返回子表单"学生成绩"中排名第1的"数学成绩"'
        }, {
          name: "LOG",
          intro: "LOG函数可以根据指定底数返回数字的对数",
          usage: "LOG(数字,底数)",
          example: "LOG(100,10)返回2，也就是以10为底数100的对数"
        }, {
          name: "MAX",
          intro: "MAX函数可以获取一组数值的最大值",
          usage: "MAX(数字1;数字2;...)",
          example: "MAX({语文成绩};{数学成绩};{英语成绩})返回三门课程中的最高分"
        }, {
          name: "MIN",
          intro: "MIN函数可以获取一组数值的最小值",
          usage: "MIN(数字1;数字2,...)",
          example: "MAX({语文成绩};{数学成绩};{英语成绩})返回三门课程中的最低分"
        }, {
          name: "MOD",
          intro: "MOD函数可以获取两数相除的余数",
          usage: "MOD(被除数,除数)",
          example: "MOD(4,3)返回1，也就是4/3的余数"
        }, {
          name: "POWER",
          intro: "POWER函数可以获取数字乘幂的结果",
          usage: "POWER(数字,指数)",
          example: "POWER(3，2)返回9，也就是3的2次方"
        }, {
          name: "PRODUCT",
          intro: "PRODUCT函数可以获取一组数值的乘积",
          usage: "PRODUCT(数字1,数字2,...)",
          example: "PRODUCT({单价}, {数量})获取总价，也就是单价和数量的乘积"
        }, {
          name: "ROUND",
          intro: "ROUND函数可以将数字四舍五入到指定的位数",
          usage: "ROUND(数字,数字位数)",
          example: "ROUND(3.1485,2)返回3.15"
        }, {
          name: "SQRT",
          intro: "SQRT函数可以获取一个数字的正平方根",
          usage: "SQRT(数字)",
          example: "SQRT(9)返回3，也就是9的正平方根"
        }, {
          name: "SUM",
          intro: "SUM函数可以获取一组数值的总和",
          usage: "SUM(数字1;数字2;...)",
          example: "SUM({语文成绩};{数学成绩}; {英语成绩})返回三门课程的总分"
        }, {
          name: "SUMPRODUCT",
          intro: "SUMPRODUCT函数可以将数组间对应的元素相乘，并返回乘积之和，适用于加权求和",
          usage: "SUMPRODUCT(数组,数组...)",
          example: "SUMPRODUCT([1,2,3],[0.1,0.2,0.3])返回1.4，也就是 1×0.1 + 2×0.2 + 3×0.3的值"
        }]
      }, {
        category: "文本函数",
        // docUrl: "https://hc.jiandaoyun.com/doc/9034",
        contains: [{
          name: "CONCATENATE",
          intro: "CONCATENATE函数可以将多个文本合并成一个文本",
          usage: "CONCATENATE(文本1,文本2,...)",
          example: 'CONCATENATE("三年二班","周杰伦")会返回"三年二班周杰伦"'
        }, {
          name: "EXACT",
          intro: "EXACT函数可以比较两个文本是否完全相同，完全相同则返回true，否则返回false",
          usage: "EXACT(文本1, 文本2)",
          example: "EXACT({手机号},{中奖手机号})，如果两者相同，返回true，如果不相同，返回false"
        }, {
          name: "GETUSERNAME",
          intro: "GETUSERNAME函数可以获取当前用户的昵称",
          usage: "GETUSERNAME()",
          example: "略"
        }, {
          name: "ISEMPTY",
          intro: "ISEMPTY函数可以用来判断值是否为空文本、空对象或者空数组",
          usage: "ISEMPTY(文本)",
          example: "略"
        }, {
          name: "LEFT",
          intro: "LEFT函数可以从一个文本的第一个字符开始返回指定个数的字符",
          usage: "LEFT(文本,文本长度)",
          example: 'LEFT("三年二班周杰伦",2)返回"三年"，也就是"三年二班周杰伦"的从左往右的前2个字符'
        }, {
          name: "LEN",
          intro: "LEN函数可以获取文本中的字符个数",
          usage: "LEN(文本)",
          example: 'LEN("朝辞白帝彩云间")返回7，因为这句诗中有7个字符'
        }, {
          name: "LOWER",
          intro: "LOWER函数可以将一个文本中的所有大写字母转换为小写字母",
          usage: "LOWER(文本)",
          example: 'LOWER("JAYZ")返回"jayz"'
        }, {
          name: "MID",
          intro: "MID返回文本中从指定位置开始的指定数目的字符",
          usage: "MID(文本,开始位置_数字,指定数目)",
          example: 'MID("简道云应用定制工具",4,6)返回"应用定制工具"'
        }, {
          name: "REPLACE",
          intro: "REPLACE函数可以根据指定的字符数，将部分文本替换为不同的文本",
          usage: "REPLACE(文本,开始位置,替换长度,新文本)",
          example: 'REPLACE("简道云应用定制工具",4,6,"企业数据管理平台")返回"简道云企业数据管理平台"'
        }, {
          name: "REPT",
          intro: "REPT函数可以将文本重复一定次数",
          usage: "REPT(文本,重复次数)",
          example: 'REPT("简道云",3)返回"简道云简道云简道云"'
        }, {
          name: "RIGHT",
          intro: "RIGHT函数可以获取由给定文本右端指定数量的字符构成的文本值",
          usage: "RIGHT(文本,文本长度)",
          example: 'RIGHT("三年二班周杰伦",3)返回"周杰伦"，也就是"三年二班周杰伦"从右往左的前3个字符'
        }, {
          name: "SEARCH",
          intro: "SEARCH函数可以获取文本1在文本2中的开始位置",
          usage: "SEARCH(文本1,文本2)",
          example: 'SEARCH("2016","简道云2016")返回4'
        }, {
          name: "SPLIT",
          intro: "SPLIT函数可以将文本按指定分割符分割成数组",
          usage: "SPLIT(文本,分隔符_文本)",
          example: 'SPLIT("简道云-应用定制工具","-")返回"简道云，应用定制工具"'
        }, {
          name: "TEXT",
          intro: "TEXT函数可以将数字转化成文本",
          usage: "TEXT(数字)",
          example: 'TEXT(3.1415)返回"3.1415"'
        }, {
          name: "TRIM",
          intro: "TRIM函数可以删除文本首尾的空格",
          usage: "TRIM(文本)",
          example: 'TRIM("   简道云   ")返回"简道云"'
        }, {
          name: "UPPER",
          intro: "UPPER函数可以将一个文本中的所有小写字母转换为大写字母",
          usage: "UPPER(文本)",
          example: 'UPPER("jayz")返回"JAYZ"'
        }, {
          name: "VALUE",
          intro: "VALUE函数可以将文本转化为数字",
          usage: "VALUE(文本)",
          example: 'VALUE("3.1415")返回3.1415'
        }]
      }, {
        category: "日期函数",
        // docUrl: "https://hc.jiandaoyun.com/doc/9036",
        contains: [{
          name: "DATE",
          intro: "DATE函数可以将时间戳转换为日期对象",
          usage: "DATE(时间戳)",
          example: "略"
        }, {
          name: "DATEDELTA",
          intro: "DATEDELTA函数可以将指定日期加/减指定天数",
          usage: "DATEDELTA(指定日期,需要加减的天数)",
          example: "略"
        }, {
          name: "DAY",
          intro: "DAY函数可以获取某日期是当月的第几日",
          usage: "DAY(时间戳)",
          example: "略"
        }, {
          name: "DAYS",
          intro: "DAYS函数可以返回两个日期之间相差的天数。",
          usage: "DAYS(结束日期,开始日期)",
          example: "略"
        }, {
          name: "DAYS360",
          intro: "DAYS360按照一年 360 天的算法，返回两个日期间相差的天数",
          usage: "DAYS360(结束日期,开始日期)",
          example: "略"
        }, {
          name: "HOUR",
          intro: "HOUR函数可以返回某日期的小时数",
          usage: "HOUR(时间戳)",
          example: "略"
        }, {
          name: "ISOWEEKNUM",
          intro: "ISOWEEKNUM函数可以返回指定日期在全年中的ISO周数",
          usage: "ISOWEEKNUM(指定日期)",
          example: "略"
        }, {
          name: "MINUTE",
          intro: "MINUTE函数可以返回某日期的分钟数",
          usage: "MINUTE(日期)",
          example: "略"
        }, {
          name: "MONTH",
          intro: "MONTH返回某日期的月份",
          usage: "MONTH(日期)",
          example: "略"
        }, {
          name: "NOW",
          intro: "NOW函数可以获取当前时间",
          usage: "NOW()",
          example: "略"
        }, {
          name: "SECOND",
          intro: "SECOND函数可以返回某日期的秒数",
          usage: "SECOND(日期)",
          example: "略"
        }, {
          name: "SYSTIME",
          intro: "SYSTIME函数可以获取当前服务器时间",
          usage: "SYSTIME()",
          example: "略"
        }, {
          name: "TIME",
          intro: "TIME函数可以返回特定时间的十进制数字",
          usage: "TIME(时_数字,分_数字,秒_数字)",
          example: "略"
        }, {
          name: "TIMESTAMP",
          intro: "TIMESTAMP函数可以将日期对象转换成时间戳。",
          usage: "TIMESTAMP(日期)",
          example: "略"
        }, {
          name: "TODAY",
          intro: "TODAY函数可以返回今天",
          usage: "TODAY()",
          example: "略"
        }, {
          name: "WEEKNUM",
          intro: "WEEKNUM函数可以返回指定日期在当年是第几周",
          usage: "WEEKNUM(指定日期)",
          example: "略"
        }, {
          name: "YEAR",
          intro: "YEAR函数可以返回某日期的年份",
          usage: "YEAR(时间戳)",
          example: "略"
        }]
      }, {
        category: "逻辑函数",
        // docUrl: "https://hc.jiandaoyun.com/doc/9033",
        contains: [{
          name: "AND",
          intro: "如果所有参数都为真，AND函数返回布尔值true，否则返回布尔值 false",
          usage: "AND(逻辑表达式1,逻辑表达式2,...)",
          example: "AND({语文成绩}>90,{数学成绩}>90,{英语成绩}>90)，如果三门课成绩都> 90，返回true，否则返回false"
        }, {
          name: "FALSE",
          intro: "FALSE函数返回布尔值false",
          usage: "FALSE()",
          example: "略"
        }, {
          name: "IFS",
          intro: "IFS函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值",
          usage: "IFS(逻辑表达式&逻辑表达式|逻辑表达式)",
          example: 'IFS({语文成绩}>60)，当语文成绩>60时返回1，否则返回0；IFS({语文成绩}>60&{数学成绩}>60)，当语文成绩>60且数学成绩>60时返回1，否则返回0；IFS({语文成绩}>60|{数学成绩}>60)，当语文成绩>60或数学成绩>60时返回1，否则返回0。'
        }, {
          name: "IF",
          intro: "IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值",
          usage: "IF(逻辑表达式,为true时返回的值,为false时返回的值)",
          example: 'IF({语文成绩}>60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。'
        }, {
          name: "NOT",
          intro: "NOT函数返回与指定表达式相反的布尔值。",
          usage: "NOT(逻辑表达式)",
          example: "NOT({语文成绩}>60)，如果语文成绩大于60返回false，否则返回true"
        }, {
          name: "OR",
          intro: "如果任意参数为真，OR 函数返回布尔值true；如果所有参数为假，返回布尔值false。",
          usage: "OR(逻辑表达式1,逻辑表达式2,...)",
          example: "OR({语文成绩}>90,{数学成绩}>90,{英语成绩}>90)，任何一门课成绩> 90，返回true，否则返回false"
        }, {
          name: "TRUE",
          intro: "TRUE函数返回布尔值true",
          usage: "TRUE()",
          example: "略"
        }, {
          name: "XOR",
          intro: "XOR函数可以返回所有参数的异或值",
          usage: "XOR(逻辑表达式1, 逻辑表达式2,...)",
          example: "XOR({语文成绩}>90,{数学成绩}>90)，如果两门成绩都>90,返回false；如果两门成绩都<90，返回false；如果其中一门>90，另外一门<90，返回true"
        }]
      }, {
        category: "高级函数",
        docUrl: "https://hc.jiandaoyun.com/doc/9037",
        contains: [{
          name: "MAPX",
          intro: "MAPX函数是一个可以用来进行跨表单取数的高级函数",
          usage: "MAPX(operation,map_value,map_field,result_field)",
          example: "略"
        }, {
          name: "RECNO",
          intro: "RECNO函数依据当前表单被新打开的次数进行不断累计，起始值为1。",
          usage: "RECNO()",
          example: "略"
        }, {
          name: "UUID",
          intro: "UUID函数随机码生成器。可适用于随机流水号的使用场景等",
          usage: "UUID()",
          example: "略"
        }]
      }]
      fml.extend = function (b, c, d) {
        "object" == typeof c && (d = c, c = b, b = function () {
          c.apply(this, arguments)
        });
        var e = function () { },
          f = c.prototype;
        return e.prototype = f,
          b.prototype = new e,
          b.superclass = f,
          $.extend(b.prototype, d),
          b
      };
      fml.OB = function (a) {
        this.options = $.extend(this._defaultConfig(), a),
          this._beforeInit(),
          this._init(),
          this._afterInit()
      }, $.extend(fml.OB.prototype, {
        _defaultConfig: function () {
          return {
            onBeforeInit: null,
            onAfterInit: null
          }
        },
        _init: function () { },
        _beforeInit: function () {
          fml.Utils.applyFunc(this, this.options.onBeforeInit, [], !1)
        },
        _afterInit: function () {
          fml.Utils.applyFunc(this, this.options.onAfterInit, [], !1)
        },
      });
      fml.Widget = fml.extend(fml.OB, {
        _defaultConfig: function () {
          return $.extend(fml.Widget.superclass._defaultConfig.apply(this, arguments), {
            widgetName: "",
            baseCls: "",
            customCls: null,
            enable: !0,
            visible: !0,
            invalidateType: "blank"
          })
        },
        _init: function () {
          fml.Widget.superclass._init.apply(this, arguments),
            this._initRoot(),
            this._initNameEffects()
        },
        _afterInit: function () {
          this._initElementSize(),
            this._initVisualEffects(),
            this._initDefaultValue(),
            fml.Widget.superclass._afterInit.apply(this, arguments)
        },
        _initRoot: function () {
          var a = this.options;
          null != a.renderEl ? this.element = $(a.renderEl) : this.element = this._defaultRoot(),
            a.baseCls && this.element.addClass(a.baseCls),
            a.customCls && this.element.addClass(a.customCls)
        },
        _initNameEffects: function () {
          var a = this.options;
          a.widgetName || (a.widgetName = "_widget_" + fml.STATIC.IDBase++),
            this.element.attr({
              widgetName: a.widgetName
            })
        },
        _initElementSize: function () {
          this.doResize()
        },
        _initVisualEffects: function () {
          this.setEnable(this.options.enable),
            this.setVisible(this.options.visible)
        },
        _initDefaultValue: function () {
          var a = this.options;
          null != a.value ? this.setValue(a.value) : null != a.text && this.setText(a.text)
        },
        _defaultRoot: function () {
          return $("<div/>")
        },
        getWidgetByName: function (a) {
          return this.options.resultWidgets ? this.options.resultWidgets[a] : null
        },
        getWidgetName: function () {
          return this.options.widgetName
        },
        getWidgetType: function () {
          return this.options.type
        },
        getText: function () {
          return this.options.text
        },
        setText: function (a) {
          this.options.text = a
        },
        getValue: function () {
          console.log(this.options)
          return this.options.value
        },
        setValue: function (a) {
          this.options.value = a
        },
        isEnabled: function () {
          return this.options.enable
        },
        setEnable: function (a) {
          this.options.enable = !!a,
            this.options.enable === !0 ? this.element.removeClass("x-ui-disable") : this.element.addClass("x-ui-disable")
        },
        isVisible: function () {
          return this.options.visible
        },
        setVisible: function (a) {
          this.options.visible = !!a,
            this.options.visible === !0 ? this.element.removeClass("x-ui-hidden") : this.element.addClass("x-ui-hidden")
        },
        reset: function () {
          this.setValue(null)
        },
        doResize: function (a) {
          var b = this.options;
          a && (b.width = a.width, b.height = a.height),
            fml.Utils.isEmpty(b.width) || this.element.css({
              width: b.width
            }),
            fml.Utils.isEmpty(b.height) || this.element.css({
              height: b.height
            })
        },
        destroy: function () {
          this.element.remove()
        },
        rebuild: function () {
          this.options.renderEl = this.element,
            this.element.empty(),
            this._beforeInit(),
            this._init(),
            this._afterInit()
        },
        checkValidate: function () {
          return !0
        },
        fireEvent: function (a, b) {
          this.element.trigger(a, b)
        },
        getOptions: function () {
          var a = this.options;
          return {
            type: a.type,
            widgetName: a.widgetName,
            customCls: a.customCls,
            height: a.height,
            width: a.width,
            text: a.text,
            value: a.value,
            enable: a.enable,
            visible: a.visible,
            allowBlank: a.allowBlank,
            rely: a.rely
          }
        },
        getInvalidateType: function () {
          return this.options.invalidateType
        },
        setInvalidateType: function (a) {
          this.options.invalidateType = a
        },
        getNullValue: function () {
          return null
        },
        getLinkValue: function () {
          return this.getValue()
        },
        getLinkType: function () {
          return this.getWidgetType()
        },
      })


      fml.FormulaEditor = {
        CONST: {
          NAME_FILED_CLS: "cm-field-name",
          VALUE_FIELD_CLS: "cm-field-value",
          INVALID_FIELD_CLS: "cm-field-invalid",
          DEPRECATE_FIELD_CLS: "cm-deprecate"
        },
        _defaultConfig: function () {
          return a.extend(fml.FormulaEditor.superclass._defaultConfig.apply(), {
            baseCls: "x-formula-editor",
            keywords: [],
            text: "学号",
            hasFunction: !0,
            labelMap: null
          })
        },
        _init: function () {
          // fml.FormulaEditor.superclass._init.apply(this, arguments);
          var b = {
            baseCls: "x-formula-editor",
            keywords: [],
            text: $this.code,
            hasFunction: !0,
            labelMap: null
          },
            c = "";
          this.element = $("." + b.baseCls);
          console.log(this.element);
          var that = this;
          console.log()
          // b.hasFunction && (c, this.element.addClass("has-func")),
          //   this.element.append(a('<div class="formula-head"/>').append(a('<span class="formula-name"/>').text(b.text)).append(a('<span class="formula-equal"/>').text("="))).append(a('<div class="formula-foot"><ul>' + c + "</ul></div>")),
          console.log(b)
          this.editor = CodeMirror(this.element[0], {
            keywords: b.keywords,
            textWrapping: !0,
            lineWrapping: !0,
            lineNumbers: !1,
            matchBrackets: !0,
            specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
            mode: "formula"
          }),
            this.editor.on("change", function (cm, event) {
              if (event.origin != "complete") {//未选中
                cm.showHint({
                  hint: CodeMirror.hint.formula,
                  completeSingle: false,
                  shown: function () {
                    console.log("显示了")
                  },
                  select: function (cpt, ele) {
                    console.log(cpt, ele)
                  },
                  pick: function (item) {
                    console.log(item);
                  }
                });
              } else {
                that.insertBarcket();
              }
            }),
            this.editor.addKeyMap({
              Backspace: function (a) {
                var b = a.getTokenAt(a.getCursor());
                if ("field" == b.type) {
                  var c = a.getCursor().line;
                  a.setSelection(new CodeMirror.Pos(c, b.start), new CodeMirror.Pos(c, b.end)),
                    a.replaceSelection("", null, "+delete")
                } else
                  a.execCommand("delCharBefore")
              }
            })
        },
        insertFormulaitem: function (text) {
          console.log(text)
          var that = this;
          var c = that.editor.getCursor();
          that.editor.replaceSelection("" + text + "");
          var d = that.editor.getCursor();
          $(that.editor.markText(c, d, {
            handleMouseEvents: !0,
            atomic: !0,
            replaceWith: $('<span class="cm-keyword">' + text + '</span>')[0]
          }).widgetNode);
          that.insertBarcket();
        },
        insertOtheritem: function (text) {
          console.log(text)
          var that = this;
          var c = that.editor.getCursor();
          that.editor.replaceSelection("" + text + "");
          var d = that.editor.getCursor();
          $(that.editor.markText(c, d, {
            handleMouseEvents: !0,
            atomic: !0,
            replaceWith: $('<span class="cm-operator">' + text + '</span>')[0]
          }).widgetNode);
          // that.insertBarcket();
          that.editor.setCursor(d);
          that.editor.focus();
        },
        /**
         * 插入（）
         * @return {[type]} [description]
         */
        insertBarcket: function () {
          var that = this;
          var c = that.editor.getCursor();
          that.editor.replaceSelection("(");
          var d = that.editor.getCursor();
          $(that.editor.markText(c, d, {
            handleMouseEvents: !0,
            atomic: !0,
            replaceWith: $('<span class="cm-bracket CodeMirror-matchingbracket">(</span>')[0]
          }).widgetNode);
          var c1 = that.editor.getCursor();
          that.editor.replaceSelection(")");
          var d1 = that.editor.getCursor();
          $(that.editor.markText(c1, d1, {
            handleMouseEvents: !0,
            atomic: !0,
            replaceWith: $('<span class="cm-bracket CodeMirror-matchingbracket">)</span>')[0]
          }).widgetNode);
          that.editor.setCursor(d);
          that.editor.focus();
        },
        _markField: function (t) {
          var i = "",
            n = {
              "data-field": t.field
            };
          t.invalid ? i = this.CONST.INVALID_FIELD_CLS : t.entry ? (i = this.CONST.NAME_FILED_CLS, n["data-entry"] = t.entry) :
            i = this.CONST.VALUE_FIELD_CLS, $(this.editor.markText(t.from, t.to, {
              handleMouseEvents: !0,
              atomic: !0,
              replacedWith: $('<span class="cm-field ' + i + '">' + t.text + "</span>")[0]
            }).widgetNode).attr(n).addClass(i)
        },
        /**
         * 插入工作项
         * @param  {[type]} a [description]
         * @param  {[type]} b [description]
         * @return {[type]}   [description]
         */
        insertField: function (a, b) {
          var c = this.editor.getCursor();
          this.editor.replaceSelection("" + a.text + "");
          var d = this.editor.getCursor(),
            e = {
              from: c,
              to: d,
              field: a.name,//工作项ID
              entry: b ? a.id : null,//工作项所属的表单id
              text: a.text
            };
          this._markField(e),
            this.editor.focus()
        },
        checkValidate: function () {
          var b = a(this.editor.display.lineDiv);
          return b.find("span." + this.CONST.DEPRECATE_FIELD_CLS).length > 0 ? (this.setInvalidateType("deprecated field"), !1) : b.find("span." + this.CONST.INVALID_FIELD_CLS).length > 0 ? (this.setInvalidateType("invalid field"), !1) : (this.setInvalidateType(null), !0)
        },
        getValue: function () {
          var b = [],
            stringid = [],
            stringlist = [],
            c = this.CONST,
            d = [],
            e = a(this.editor.display.lineDiv).find("pre:first>span");
          console.log(e)
          return fml.Utils.forEach(e, function (e, f) {
            var g = [];
            var o = []
            console.log(f)
            console.log()
            fml.Utils.forEach(a(f).children("span"), function (b, e) {
              var f = a(e).attr("data-field"),
                h = a(e).attr("data-entry");
              console.log(a(e).text())
              console.log(a(e))
              if (a(e).hasClass(c.NAME_FILED_CLS)) {
                // g.push("$" + f + "#" + h);
                g.push(f);
                o.push(a(e).text())
              }

              else if (a(e).hasClass(c.VALUE_FIELD_CLS)) {
                g.push("$" + f + "#"), d.indexOf(f) === -1 && d.push(f);
                o.push(a(e).text())
              }
              else {
                if (a(e).hasClass(c.DEPRECATE_FIELD_CLS) || a(e).hasClass(c.INVALID_FIELD_CLS))
                  return;
                g.push(a(e).text())
                o.push(a(e).text())
              }
            });
            console.log(g)
            console.log(o)
            var h = g.join("").replace(/\u200b/g, "").replace(/\u00a0/g, " ");
            b.push(h)
            console.log(b)
            stringid = g
            stringlist = o
          }), {
            formula: b.join("\n"),
            strlist: stringlist,
            strlistid: stringid,
            relyWidgets: d
          }
        },
        setValue: function (a) {
          var b = this,
            c = this.options,
            d = [],
            e = [];
          if (a) {
            var f = a.split("\n");
            fml.Utils.forEach(f, function (a, b) {
              var f = "",
                g = b.split(/(\$[0-9a-zA-Z\._#@]+)/g);
              fml.Utils.forEach(g, function (b, d) {
                if (/^\$(_widget_|_formula_|ext)/.test(d)) {
                  var g;
                  fml.Utils.startWith(d, "$ext") ? g = "扩展字段" : c.labelMap && (g = c.labelMap[d]);
                  var h = !1;
                  fml.Utils.isNull(g) && (g = "无效字段", h = !0);
                  var i = d.replace("$", "").split("#"),
                    j = i[0],
                    k = i[1],
                    l = CodeMirror.Pos(a, f.length);
                  f += "" + g + "";
                  var m = CodeMirror.Pos(a, f.length);
                  e.push({
                    from: l,
                    to: m,
                    field: j,
                    entry: k,
                    invalid: h
                  })
                } else
                  f += d
              }),
                d.push(f)
            })
          }
          this.editor.setValue(d.join("\n")),
            fml.Utils.forEach(e, function (a, c) {
              b._markField(c)
            })
        }
      };


      CodeMirror.fomulaContext = Object.keys(fml.Formula);

      fml.FormulaEditor._init();

      /**
       * 点击工作项
       * @param  {[type]} ){	var it            [description]
       * @return {[type]}         [description]
       */
      $(".field-list  .field").click(function () {
        var it = $(this);
        var a = {
          id: it.attr("name"),
          name: it.attr("name"),
          text: it.find("span").text()
        }
        console.log(a);
        console.log(fml)
        // console.log(this.editor)
        fml.FormulaEditor.insertField(a, true);//如果是当前表单的工作项 则不需要第二个参数
      });

      $(".subbtn").click(function () {
        let val = $('.x-formula-editor').childNodes
        console.log(fml)
        console.log(this.editor)
        let others = fml.FormulaEditor.editor.getValue()
        console.log(others)
        console.log(fml.FormulaEditor.getValue())
        // console.log(fml.FormulaEditor.editor.options())
        // fml.FormulaEditor.getValue('$_widget_1493093397868#')
        var a = {
          id: '123',
          name: 'ddd',
          text: '数字'
        }
        console.log(a);
        console.log(fml)
        // console.log(this.editor)
        // fml.FormulaEditor.insertField(a,true)
      })

      /**
       * 展开折叠函数
       * @param  {[type]} ){	$(this).parent().toggleClass('expand');} [description]
       * @return {[type]}                                               [description]
       */
      $(".formula-category .title").click(function () {
        $(this).parent().toggleClass('expand1');

      })

      /**
       * 点击函数插入编辑器中
       * @type {fml}
       */
      $(".formula-category .formula-item").mouseover(function () {
        var name = $(this).text(), list = fml.FormulaUsage, intro = $(".formula-intro .intro-wrapper");
        var currentFml;
        for (var i = 0; i < list.length; i++) {
          var cate = list[i];
          for (var j = 0; j < cate.contains.length; j++) {
            var con = cate.contains[j];
            if (name == con.name) {
              currentFml = con;
              break;
            }
          }
        }
        if (currentFml) {
          intro.html('<li class="intro"><span class="formula-name">' + currentFml.name + '</span>' + (currentFml.intro.indexOf(currentFml.name) > -1 ? currentFml.intro.split(currentFml.name)[1] : currentFml.intro) + '</li><li class="usage">用法：<span class="formula-name">' + currentFml.name + '</span>(' + currentFml.usage.split("(")[1] + '</li><li class="example">示例：' + currentFml.example + '</li>')
        }
      }).click(function () {
        fml.FormulaEditor.insertFormulaitem($(this).text());
      })






    })
  }
}
</script>
