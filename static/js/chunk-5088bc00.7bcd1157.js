(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5088bc00"],{"72bd":function(t,e,a){"use strict";a("72d7")},"72d7":function(t,e,a){},e4f1:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"newform page"},[a("div",{staticClass:"title title_form_header"},[a("el-row",[a("el-col",{attrs:{span:4}},[a("div",[a("div",{staticClass:"fd-nav-back",on:{click:function(e){return t.backClick()}}},[a("i",{staticClass:"el-icon-arrow-left"})])])]),a("el-col",{staticClass:"text_right",staticStyle:{"line-height":"60px"},attrs:{span:4,offset:15}},["123"==t.mycode?a("el-button",{attrs:{size:"small"},on:{click:function(e){return t.saveSet(1)}}},[t._v("保存并返回")]):a("el-button",{attrs:{size:"small"},on:{click:function(e){return t.saveSet(2)}}},[t._v("保存并返回")])],1)],1)],1),a("div",{staticClass:"clearfix"}),a("div",{staticClass:"page__content"},[a("DynamicForm",{ref:"formDesign",attrs:{conf:t.formData,is_add:t.is_form,tabName:"formDesign"},on:{back:t.formBack,subback:t.subAlertBack}})],1)])},s=[],r=a("59f2"),o={name:"newform",components:{DynamicForm:r["a"]},data:function(){return{detail:{},is_form:!0,nownum:0,formData:{fields:[],title:"",labelPosition:"top",labelWidth:100,formRules:"rules",is_template:!1,type_id:"",urlpath:"",remark:"",sort:""}}},methods:{backClick:function(){var t=this;this.$confirm("未保存返回, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.$router.push({name:"formList",query:{k:Date.now()}})})).catch((function(){t.$message({type:"info",message:"已取消返回"})}))},saveSet:function(t){var e=this,a=this.$refs.formDesign;for(var i in this.formData=a.formConf,this.formData.fields){if("calculate"==this.formData.fields[i].tagIcon&&0==this.formData.fields[i].strlist.length)return this.$alert("请填写 "+this.formData.fields[i].label+" 的计算公式！","提示",{confirmButtonText:"确定"}),!1;if("coefficient"==this.formData.fields[i].tagIcon){if(""==this.formData.fields[i].const_value)return this.$alert("请填加 "+this.formData.fields[i].label+" 的系数值！","提示",{confirmButtonText:"确定"}),!1;if(!/^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(this.formData.fields[i].const_value))return this.$alert(this.formData.fields[i].label+" 的系数值请填写数字！","提示",{confirmButtonText:"确定"}),!1;this.formData.fields[i].const_value=parseFloat(this.formData.fields[i].const_value)}else if("select"==this.formData.fields[i].tagIcon||"select_number"==this.formData.fields[i].tagIcon){if(0==this.formData.fields[i].options.length)return this.$alert("请填加 "+this.formData.fields[i].label+" 的选项！","提示",{confirmButtonText:"确定"}),!1;for(var s in this.formData.fields[i].options){if(""==this.formData.fields[i].options[s].label)return this.$alert("请填写 "+this.formData.fields[i].label+" 的选项名！","提示",{confirmButtonText:"确定"}),!1;if("select_number"==this.formData.fields[i].tagIcon&&""==this.formData.fields[i].options[s].value)return this.$alert("请填写 "+this.formData.fields[i].label+" 的选项值！","提示",{confirmButtonText:"确定"}),!1}}}if(""==this.formData.title)return this.$alert("请在表单属性中填写表单名称！","提示",{confirmButtonText:"确定"}),!1;if(""==this.formData.type_id)return this.$alert("请选择表单分类！","提示",{confirmButtonText:"确定"}),!1;if(""!=this.formData.sort){if(!/^[+-]?(0|([1-9]\d*))?$/g.test(this.formData.sort))return this.$alert("顺序请填写整数！","提示",{confirmButtonText:"确定"}),!1;this.formData.sort=parseInt(this.formData.sort)}this.$delete(this.formData,"form_code");var r=this,o={corpid:this.$store.state.corpid,userid:this.$store.state.userid,form_info:JSON.stringify(this.formData)},n=r.$createObj(o),f=n["keyvalue"],l=r.$apilist["addonetemplateform"]+"?signature="+f;r.$server.post(l,n["fd"]).then((function(t){e.$router.push({name:"formList",query:{k:Date.now()}})})).catch((function(t){}))}}},n=o,f=(a("72bd"),a("2877")),l=Object(f["a"])(n,i,s,!1,null,null,null);e["default"]=l.exports}}]);