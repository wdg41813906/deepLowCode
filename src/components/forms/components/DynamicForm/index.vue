/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */

<template>
  <div class="container1 container container2">
    <!-- <el-dialog
      :visible.sync="my_is_add"
      width="1200px"
      :close-on-click-modal="false"
      class="formalert_conainer"
    > -->

    <div class="left-board">
      <!-- <div class="logo-wrapper">
        <div class="logo">创建表单</div>
      </div>-->
      <div class="left-scrollbar">
        <el-tabs v-model="activeTabName" :stretch="true">
          <el-tab-pane label="常用组件" name="common">
            <div class="components-list">
              <!-- <div class="components-title">
                <svg-icon icon-class="component" />输入型组件
              </div>-->
              <p class="component_title">基础控件</p>

              <draggable
                class="components-draggable"
                :list="inputComponents"
                :group="{
                  name: 'componentsGroup',
                  pull: 'clone',
                  put: false,
                }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in inputComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon
                      v-if="element.tagIcon == 'select_number'"
                      :icon-class="'select'"
                    />
                    <svg-icon :icon-class="element.tagIcon" v-else />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
              <p class="component_title">样式控件</p>
              <draggable
                class="components-draggable"
                :list="readOnly"
                :group="{
                  name: 'componentsGroup',
                  pull: 'clone',
                  put: false,
                }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in readOnly"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon
                      v-if="element.tagIcon == 'select_number'"
                      :icon-class="'select'"
                    />
                    <svg-icon :icon-class="element.tagIcon" v-else />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
              <p class="component_title">可计算控件</p>

              <draggable
                class="components-draggable"
                :list="commonComponents"
                :group="{
                  name: 'componentsGroup',
                  pull: 'clone',
                  put: false,
                }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in commonComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon
                      v-if="element.tagIcon == 'select_number'"
                      :icon-class="'select'"
                    />
                    <svg-icon :icon-class="element.tagIcon" v-else />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />
    <div class="center-board">
      <div class="action-bar">
        <!-- <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button> -->
        <!-- <el-button
            class="copy-btn-main"
            icon="el-icon-success"
            type="text"
            @click="preview"
            >预览</el-button
          > -->
        <el-button
          class="info-btn"
          icon="el-icon-delete"
          type="text"
          @click="empty"
        ></el-button>
      </div>
      <div id="ipad">
        <div class="outeripad" :class="[ipadMode]">
          <div class="ipadbody">
            <div class="ipadscreen" ref="imageDom">
              <el-scrollbar class="center-scrollbar">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                  <el-form
                    :size="formConf.size"
                    :label-position="formConf.labelPosition"
                    :disabled="formConf.disabled"
                    :label-width="formConf.labelWidth + 'px'"
                  >
                    <div class="drawing-item">
                      <el-form-item>
                        {{ formConf.remark }}
                      </el-form-item>
                    </div>

                    <draggable
                      class="drawing-board"
                      :list="drawingList"
                      :animation="200"
                      group="componentsGroup"
                      @end="onMianDragEnd"
                    >
                      <draggable-item
                        v-for="(element, index) in drawingList"
                        :key="element.renderKey"
                        :drawing-list="drawingList"
                        :element="element"
                        :index="index"
                        :active-id="activeId"
                        :form-conf="formConf"
                        :put="shouldClone"
                        @activeItem="activeFormItem"
                        @copyItem="drawingItemCopy"
                        @deleteItem="drawingItemDelete"
                      />
                    </draggable>
                    <div v-show="!drawingList.length" class="empty-info">
                      从左侧拖入或点选组件进行表单设计
                    </div>
                  </el-form>
                </el-row>
              </el-scrollbar>
            </div>
            <!-- <div class="ipadcamera"></div> -->
            <!-- <div class="ipadhomebutton"></div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />-->
    <!-- <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />-->
    <!-- :disabled="!IsDisable" -->
    <input id="copyNode" type="hidden" />
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="my_is_add = false" size="small">取 消</el-button>
      <el-button type="primary" @click="getDatasave()" size="small"
        >确 定</el-button
      >
    </span> -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import SvgIcon from '@/components/public/SvgIcon'
import draggable from "vuedraggable";
// import { saveAs } from 'file-saver'
// import beautifier from 'beautifier'
// import ClipboardJS from 'clipboard'
import render from "./components/render";
// import FormDrawer from './FormDrawer'
import RightPanel from "./RightPanel";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  readOnly,
  customMadeComponents,
  commonComponents,
  formConf
} from "./components/generator/config";
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase
} from "./utils/index";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from "./components/generator/html";
import { makeUpJs } from "./components/generator/js";
import { makeUpCss } from "./components/generator/css";
import drawingDefalut from "./components/generator/drawingDefalut";
// import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from "./DraggableItem";
import {
  getDrawingList,
  saveDrawingList,
  // getIdGlobal,
  // saveIdGlobal,
  getFormConf
} from "./utils/db";
import { debounce } from '@/assets/utils'
// import html2canvas from "html2canvas"
const emptyActiveData = { style: {}, autosize: {} };
let oldActiveId;
let tempActiveData;

const formConfInDB = getFormConf();
// const idGlobal = getIdGlobal();
export default {
  components: {
    draggable,
    render,
    RightPanel,
    DraggableItem

    // FormDrawer,
    // CodeTypeDialog,
  },
  props: ['tabName', 'conf', 'is_add', 'num', 'conf1'],
  data () {
    const storageList = getDrawingList()
    const drawingList = Array.isArray(storageList) && storageList.length ? storageList : drawingDefalut
    return {
      // idGlobal,
      IsDisable: true,
      my_is_add: true,
      formConf,
      inputComponents,
      readOnly,
      selectComponents,
      layoutComponents,
      commonComponents,
      customMadeComponents,
      labelWidth: 100,
      drawingList,
      drawingData: {},
      activeId: drawingList ? drawingList[0].idx : "",
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingList[0],
      activeTabName: "common",
      ipadMode: 'portrait'
    };
  },
  watch: {
    is_add (val) {
      this.my_is_add = val

      if (val == true) {
        // this.conf = JSON.parse(JSON.stringify(this.conf1))
        // this.drawingList = []
        // console.log(this.conf)
        // console.log(this.conf1)
        console.log(this.conf.fields)

        if (typeof this.conf === 'object' && this.conf !== null) {
          this.drawingList = this.conf.fields
          Object.assign(this.formConf, this.conf)
        } else {
          const drawingListInDB = getDrawingList()
          const hasStorage = Array.isArray(drawingListInDB) && drawingListInDB.length > 0
          this.drawingList = hasStorage ? drawingListInDB : drawingDefalut
          formConfInDB && (this.formConf = formConfInDB)
        }
        this.activeFormItem(this.drawingList[0])
        this.activeId = this.drawingList ? this.drawingList[0].idx : ""
        console.log(this.activeId)
        oldActiveId = ''
      }
    },
    my_is_add (val) {
      this.$emit('back', val)
    },
    // eslint-disable-next-line func-names
    "activeData.label": function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      console.log(this.activeData.placeholder)
      console.log(oldVal)
      if (this.activeData.tagIcon == 'select' || this.activeData.tagIcon == 'select_number') {
        this.activeData.placeholder = '请选择' + val
      } else {
        this.activeData.placeholder = '请输入' + val
      }

      // this.activeData.placeholder.replace(oldVal, "") + val;
    },
    activeId: {
      handler (val) {
        oldActiveId = val;
      },
      immediate: true
    },
    drawingList: {
      handler (val) {
        if (!val) return
        if (!this.afterDrawingChange) {
          this.afterDrawingChange = debounce(this.handlerListChange, 400) // 使用了deep 所以刷新会比较频繁
        }
        this.afterDrawingChange()
      },
      deep: true,
      immediate: true
    },
    // idGlobal: {
    //   handler(val) {
    //     saveIdGlobal(val);
    //   },
    //   immediate: true
    // }
  },
  created () {
    console.log(this.drawingList)
    console.log(this.conf)
    if (typeof this.conf === 'object' && this.conf !== null) {
      this.drawingList = this.conf.fields
      Object.assign(this.formConf, this.conf)
    } else {
      const drawingListInDB = getDrawingList()
      const hasStorage = Array.isArray(drawingListInDB) && drawingListInDB.length > 0
      this.drawingList = hasStorage ? drawingListInDB : drawingDefalut
      formConfInDB && (this.formConf = formConfInDB)
    }
    this.activeFormItem(this.drawingList[0])
    this.activeId = this.drawingList ? this.drawingList[0].idx : ""
    console.log(this.activeId)
    oldActiveId = ''
    console.log(this.conf)

    // const clipboard = new ClipboardJS('#copyNode', {
    //   text: trigger => {
    //     const codeStr = this.generateCode()
    //     this.$notify({
    //       title: '成功',
    //       message: '代码已复制到剪切板，可粘贴。',
    //       type: 'success'
    //     })
    //     return codeStr
    //   }
    // })
    // clipboard.on('error', e => {
    //   this.$message.error('代码复制失败')
    // })
  },
  methods: {
    stringComponent () {
      let stringC = []
      let strlist = { code: [], val: [], is_assign: [] }

      for (let i in this.drawingList) {
        // console.log(this.drawingList[i])enable_assign
        stringC.push({ Name: this.drawingList[i].label, Is: this.drawingList[i].enable_assign == true ? false : true, C: this.drawingList[i].tagIcon, Idx: this.drawingList[i].idx, Code: String.fromCharCode(64 + this.drawingList[i].idx) })
        strlist.code.push(String.fromCharCode(64 + this.drawingList[i].idx))
        strlist.val.push(this.drawingList[i].label)
        strlist.is_assign.push(this.drawingList[i].enable_assign == true ? false : true)
      }

      // setUser('stringComponents', (JSON.stringify(stringC)))
      this.$store.commit('stringComponents', stringC)
      this.$store.commit('stringList', strlist)
    },
    handlerListChange (val) {
      const vm = this
      this.$store.commit('clearPCondition') // 清除所有条件 重新检测赋值
      const canUsedAsPCon = (conf, parent) => {
        const isRangeCmp = ['fc-date-duration', 'fc-time-duration'].includes(conf.tag)
        if (isRangeCmp && !conf.showDuration) return false
        if (parent && parent.rowType === 'table') return false
        if (!conf.proCondition || !conf.required) return false
        if (conf.tag === 'el-select' && conf.multiple) return false
        return true
      }
      const loop = (data, parent) => {
        if (!data) return
        Array.isArray(data.children) && data.children.forEach(child => loop(child, data))
        if (Array.isArray(data)) {
          data.forEach(loop)
        } else {
          canUsedAsPCon(data, parent)
            ? vm.$store.commit("addPCondition", data)
            : vm.$store.commit("delPCondition", data.idx)
        }
      }
      loop(this.drawingList)
      saveDrawingList(this.drawingList)
      this.$store.commit('updateFormItemList', this.drawingList)
      this.stringComponent()
      // if (val.length === 0) this.idGlobal = 100;
    },
    /**
     * 判断是否是常用组件
     * 非常用组件即套餐组件  不能新填或删除子组件
     */
    isCommonCmp (name) {
      return this.commonComponents.findIndex(t => t.label === name) > -1
    },
    /**
     * 阻止表格中嵌套行容器
     * 定制组件不能添加子组件
     */
    shouldClone (to, from, target, event, conf) {
      // .drawing-row-item —— 行容器的类名 ipad里面的组件才会带有
      // 直接拖拽的行容器 最外层含有.drawing-row-item
      // 定制组件 内部含有.drawing-row-item
      // const hasRow = target.classList.contains('.drawing-row-item') || target.querySelector('.drawing-row-item') !== null
      // const isRowContainer = ['布局容器', '表格/明细'].includes(target.innerText) //是阻止从左侧拖拽嵌套
      // const isCusFromLeft = target.classList.contains('custom-component')
      const targetConf = target._underlying_vm_
      const isRowContainer = conf.cmpType === 'common' && conf.rowType === 'layout'
      if (isRowContainer) return true
      if (conf.cmpType === 'custom') return false
      if (conf.rowType === 'table') {
        if (targetConf.layout === 'rowFormItem') return false
        if (this.isFilledPCon([targetConf.idx])) return false
      }
      return true
    },
    activeFormItem (element) {
      if (element) {
        this.activeData = element;
        this.activeId = element.idx;
      }
    },
    onEnd (obj, a) {
      if (obj.from !== obj.to) {
        this.activeId = tempActiveData.idx;
        this.activeData = tempActiveData;
      }
    },
    onMianDragEnd (obj, a) {
      this.activeFormItem(this.drawingList[obj.newIndex]);
    },
    getSameTagCmpNum (tagIcon) {
      return this.drawingList.reduce((count, item) => {
        if (item.children) {
          return count + item.children.reduce((c, t) => {
            return t.tagIcon === tagIcon ? c + 1 : c
          }, 0)
        }
        return item.tagIcon === tagIcon ? count + 1 : count
      }, 0)
    },
    createCmpLabel (cmp) {
      const len = this.getSameTagCmpNum(cmp.tagIcon)
      return len ? cmp.label + len : cmp.label
    },
    addComponent (item) {
      const clone = this.cloneComponent(item);
      // this.drawingList.push(clone);
      let other = 1
      for (let i in this.drawingList) {
        if (this.drawingList[i].idx == this.activeId) {
          // this.drawingList.splice(i, 0, clone)

          other = parseFloat(i) + 1
          break;
        }
      }
      this.drawingList.splice(other, 0, clone)
      this.activeFormItem(clone);
    },
    getMaxId () {
      if (this.drawingList.length) {
        return this.drawingList.reduce((maxId, cmp) => {
          cmp.idx > maxId && (maxId = cmp.idx)
          if (Array.isArray(cmp.children)) {
            maxId = cmp.children.reduce((max, child) => Math.max(max, child.idx), maxId)
          }
          return maxId
        }, 0)
      }
      return 0
    },
    getNextId () {
      return this.getMaxId() + 1
    },
    cloneComponent (origin) {
      const clone = JSON.parse(JSON.stringify(origin));
      clone.idx = this.getNextId();
      // clone.span = formConf.span;
      clone.renderKey = clone.idx + new Date().getTime(); // 改变renderKey后可以实现强制更新组件
      if (!clone.layout) clone.layout = "colFormItem";
      if (clone.layout === "colFormItem") {
        clone.label = this.createCmpLabel(clone)
        clone.vModel = `field${clone.idx}`;
        clone.placeholder !== undefined && (clone.placeholder += clone.label);
        tempActiveData = clone;
      } else if (clone.layout === "rowFormItem") {
        if (clone.rowType === 'table') {
          clone.vModel = `field${clone.idx}`;
        }
        // delete clone.label;
        clone.componentName = `row${clone.idx}`;
        clone.gutter = this.formConf.gutter;
        this.cloneChildrenOfRowFormItem(clone);
        tempActiveData = clone;
      }
      return tempActiveData;
    },
    cloneChildrenOfRowFormItem (rowFormItem) {
      if (rowFormItem.children && rowFormItem.children.length) {
        let children = rowFormItem.children;
        children.forEach((clone, index) => {
          clone.idx = rowFormItem.idx + index + 1;
          // clone.span = formConf.span;
          clone.renderKey = clone.idx + new Date().getTime(); // 改变renderKey后可以实现强制更新组件
          if (!clone.layout) clone.layout = "colFormItem";
          if (clone.layout === "colFormItem") {
            clone.vModel = `field${clone.idx}`;
            clone.placeholder !== undefined &&
              (clone.placeholder += clone.label);
          } else if (clone.layout === "rowFormItem") {
            delete clone.label;
            clone.componentName = `row${clone.idx}`;
            clone.gutter = this.formConf.gutter;
            this.cloneChildrenOfRowFormItem(clone);
          }
        });
      }
    },
    isEmptyRowContainer () {
      const rowContainer = this.drawingList.find(t => t.layout === 'rowFormItem')
      if (rowContainer) {
        return rowContainer.children.length === 0
      }
    },
    AssembleFormData () {
      this.formData = {
        ...this.formConf,
        fields: JSON.parse(JSON.stringify(this.drawingList))
      };
    },


    getDatasave () {
      console.log('sdfsdf')
      this.$emit()
      this.AssembleFormData();
      this.formData = {
        ...this.formConf,
        fields: JSON.parse(JSON.stringify(this.drawingList))
      };
      this.$emit('update:formData', this.formData)
      console.log(this.formData)
      for (let i in this.formData.fields) {
        if (this.formData.fields[i].tagIcon == 'calculate' && this.formData.fields[i].strlist.length == 0) {
          this.$alert('请填写 ' + this.formData.fields[i].label + ' 的计算公式！', '提示', {
            confirmButtonText: '确定',

          });
          return false;
        } else if (this.formData.fields[i].tagIcon == 'select' || this.formData.fields[i].tagIcon == 'select_number') {
          if (this.formData.fields[i].options.length == 0) {
            this.$alert('请填加 ' + this.formData.fields[i].label + ' 的选项！', '提示', {
              confirmButtonText: '确定',

            });
            return false;
          } else {
            for (let j in this.formData.fields[i].options) {
              if (this.formData.fields[i].options[j].label == '') {
                this.$alert('请填写 ' + this.formData.fields[i].label + ' 的选项名！', '提示', {
                  confirmButtonText: '确定',

                });
                return false;
              }
              if (this.formData.fields[i].tagIcon == 'select_number' && !/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(this.formData.fields[i].options[j].value)) {
                this.$alert('请填写 ' + this.formData.fields[i].label + ' 的选项内容为数字！', '提示', {
                  confirmButtonText: '确定',

                });
                return false;
              }
            }
          }
        }
      }
      if (this.formData.title == '') {
        this.$alert('请在表单属性中填写表单名称！', '提示', {
          confirmButtonText: '确定',

        });
        return false;

      }
      if (this.formData.type_id == '') {
        this.$alert('请选择表单分类！', '提示', {
          confirmButtonText: '确定',

        });
        return false;

      }
      this.IsDisable = false
      // if (this.formData.is_template) {
      //   let self = this
      //   this.activeId = ''
      //   setTimeout(function () {
      //     html2canvas(self.$refs.imageDom).then(canvas => {
      //       // console.log(canvas)
      //       let timee = Date.parse(new Date());
      //       // 转成图片，生成图片地址
      //       self.imgUrl = canvas.toDataURL("image/png");
      //       console.log(self.imgUrl)
      //       let $this = self
      //       let payload = {
      //         corpid: self.$store.state.corpid,
      //         userid: self.$store.state.userid,
      //         basestr: String(canvas.toDataURL("image/png")).split("base64,")[1],
      //         shotname: timee
      //       }
      //       let createvalue = $this.$createObj(payload);
      //       var keyvalue = createvalue['keyvalue'];
      //       let posturl = $this.$apilist['uploadimages'] + '?signature=' + keyvalue;
      //       // return false;
      //       $this.$server.post(posturl, createvalue['fd']).then((data) => {
      //         // console.log(data)
      //         self.formData.urlpath = data.urlpath
      //         self.IsDisable = true
      //         self.$emit('subback', self.formData)
      //         self.my_is_add = false
      //       }).catch(err => {
      //         console.log(err)
      //       })
      //     });
      //   }, 200)
      // } else {
      //   this.$emit('subback', this.formData)
      //   this.IsDisable = true
      //   this.my_is_add = !this.my_is_add
      // }
      this.$emit('subback', this.formData)
      this.IsDisable = true
      this.my_is_add = !this.my_is_add
      console.log(this.formData)
      console.log(this.tabName)
    },
    /**
     * 供父组件使用 获取表单JSON
     */
    getData () {
      return new Promise((resolve, reject) => {
        if (this.drawingList.length === 0) {
          reject({ msg: '表单不允许为空', target: this.tabName })
          return
        }

        if (this.isEmptyRowContainer()) {
          reject({ msg: '您的行容器中没有组件', target: this.tabName })
          return
        }
        this.AssembleFormData();
        resolve({ formData: this.formData, target: this.tabName })
      })
    },
    preview () {
      this.AssembleFormData();
      let htmlCode = makeUpHtml(this.formData, "file");
      let jsCode = makeUpJs(this.formData, "file");
      let cssCode = makeUpCss(this.formData);
      this.$router.push({
        name: "preview",
        params: {
          formData: {
            htmlCode,
            jsCode,
            cssCode
          }
        }
      });
    },
    generate (data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    // execRun(data) {
    //   this.AssembleFormData()
    //   this.drawerVisible = true
    // },
    // execDownload(data) {
    //   const codeStr = this.generateCode()
    //   const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
    //   saveAs(blob, data.fileName)
    // },
    execCopy (data) {
      document.getElementById("copyNode").click();
    },
    empty () {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          // this.idGlobal = 100;
          this.$store.commit('clearPCondition')
        }
      );
    },
    drawingItemCopy (item, parent) {
      let clone = JSON.parse(JSON.stringify(item));
      clone = this.createIdAndKey(clone);
      parent.push(clone);
      this.activeFormItem(clone);
    },
    createIdAndKey (item) {
      item.idx = this.getNextId();
      item.renderKey = item.idx + new Date().getTime();
      if (item.layout === "colFormItem") {
        item.vModel = `field${item.idx}`;
      } else if (item.layout === "rowFormItem") {
        item.componentName = `row${item.idx}`;
      }
      if (Array.isArray(item.children)) {
        item.children = item.children.map(childItem =>
          this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    isFilledPCon (idxs) {
      const processCmp = this.$parent.$children.find(t => t.isProcessCmp)
      return processCmp && processCmp.isFilledPCon(idxs)
    },
    checkColItem (cmp) {
      if (!cmp) return false
      const isPcon = this.$store.state.processConditions.find(t => t.idx == cmp.idx) ? true : false
      return isPcon && this.isFilledPCon([cmp.idx])
    },
    // 判断是否已被流程图作为条件必填项了
    isProCondition (cmp) {
      if (Array.isArray(cmp.children) && cmp.children.length) { // 容器组件需要检查子元素
        if (cmp.rowType === 'table') return false // 表格的子元素不可能为流程条件
        let flag = false
        const loop = (el) => {
          if (flag) return // flag === true 代表找到了一个了 不需要再找下一个
          if (Array.isArray(el)) {
            el.some(e => {
              if (e.children) loop(e.children)
              return this.checkColItem(e)
            }) && (flag = true)
          }
        }
        loop(cmp.children)
        return flag
      } else {
        return this.checkColItem(cmp)
      }
    },
    drawingItemDelete (index, parent) {
      // 首先判断是否是流程条件 再判断是否有节点使用过
      // if (this.isProCondition(parent[index])) {
      //   this.$message.warning("该组件已作为流程判断条件，无法删除");
      //   return
      // }
      // this.$store.commit("delPCondition", parent[index].idx);
      parent.splice(index, 1);
      for (let i in this.drawingList) {
        if (this.drawingList[i].tagIcon == 'calculate') {
          if (this.drawingList[i].str_id_list.indexOf(String.fromCharCode(64 + parent[index].idx)) > -1) {
            this.drawingList[i].str_id_list = []
            this.drawingList[i].strlist = []
          }
        }
      }
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          // this.activeFormItem(this.drawingList[len - 1]);
          this.activeFormItem(this.drawingList[0]);
        }
      });
    },
    // generateCode() {
    //   const { type } = this.generateConf
    //   this.AssembleFormData()
    //   const script = vueScript(makeUpJs(this.formData, type))
    //   const html = vueTemplate(makeUpHtml(this.formData, type))
    //   const css = cssStyle(makeUpCss(this.formData))
    //   return beautifier.html(html + script + css, beautifierConf.html)
    // },
    // download() {
    //   this.dialogVisible = true
    //   this.showFileName = true
    //   this.operationType = 'download'
    // },
    run () {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "run";
    },
    // copy() {
    //   this.dialogVisible = true
    //   this.showFileName = false
    //   this.operationType = 'copy'
    // },
    tagChange (newTag) {
      newTag = this.cloneComponent(newTag);
      newTag.vModel = this.activeData.vModel;
      newTag.idx = this.activeId;
      newTag.span = this.activeData.span;
      delete this.activeData.tag;
      delete this.activeData.tagIcon;
      //   delete this.activeData.document;
      Object.keys(newTag).forEach(key => {
        if (
          this.activeData[key] !== undefined &&
          typeof this.activeData[key] === typeof newTag[key]
        ) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList (newTag, list) {
      const index = list.findIndex(item => item.idx === this.activeId);
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach(item => {
          if (Array.isArray(item.children))
            this.updateDrawingList(newTag, item.children);
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "./styles/home.less";

.container1 {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  .el-dialog__header {
    border-bottom: none !important;
  }

  .el-select {
    width: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .component_title {
    font-weight: bold;
    padding: 10px 5px;
  }
}
.container2 {
  #ipad {
    height: 100%;
    display: flex;
    max-width: 880px;
    margin: auto;
    .outeripad,
    .ipadbody,
    .ipadscreen {
      position: relative;
      height: 100%;
    }

    .ipadcamera,
    .ipadhomebutton {
      position: absolute;
    }
  }

  /* iPad */
  .outeripad {
    box-shadow: 0 0 13px 3px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin: auto;

    &.portrait {
      padding: 45px 25px;
      height: 85% !important;
      width: 68%;
      min-height: 560px;
    }

    &.landscape {
      width: 90%;
      padding: 25px 45px;
      height: 78% !important;

      .ipadcamera {
        left: -20px;
        top: 50%;
        margin-top: -10px;
      }

      .ipadhomebutton {
        margin-right: -38px;
        top: 50%;
        right: 0;
        left: unset;
        margin-top: -18px;
      }
    }

    .ipadbody {
      background-color: white;
      border-radius: 10px;
    }

    .ipadscreen {
      background-color: rgba(239, 239, 239, 0.6);
    }

    .ipadcamera {
      top: -38px;
      left: 50%;
      background-color: #aeaeae;
      height: 10px;
      width: 10px;
      border-radius: 5px;
      margin-top: 10px;
      margin-left: -5px;
    }

    .ipadhomebutton {
      background-color: #fff;
      height: 30px;
      width: 30px;
      border-radius: 15px;
      border: 1px solid #a8a8a8;
      margin-top: 6px;
      margin-left: -15px;
      left: 50%;
      cursor: pointer;
    }

    .el-radio-group {
      line-height: 2.5;
    }
  }
}
.el-date-editor .el-range-separator {
  box-sizing: content-box;
}
</style>

<style lang="less" scoped>
.svg-icon {
  float: right;
}
.info-btn {
  color: #a6a9ad;
}
</style>
