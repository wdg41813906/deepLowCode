(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ea09bf6c"],{"129f":function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t===1/e:t!=t&&e!=e}},"2f39":function(t,e,a){},"5bc4":function(t,e,a){"use strict";a("2f39")},"841c":function(t,e,a){"use strict";var s=a("d784"),i=a("825a"),r=a("1d80"),l=a("129f"),n=a("14c3");s("search",1,(function(t,e,a){return[function(e){var a=r(this),s=void 0==e?void 0:e[t];return void 0!==s?s.call(e,a):new RegExp(e)[t](String(a))},function(t){var s=a(e,t,this);if(s.done)return s.value;var r=i(t),o=String(this),c=r.lastIndex;l(c,0)||(r.lastIndex=0);var d=n(r,o);return l(r.lastIndex,c)||(r.lastIndex=c),null===d?-1:d.index}]}))},dd83:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"gatherlist"},[t._m(0),a("el-row",[a("el-col")],1),a("el-form",{attrs:{inline:!0}},[a("el-form-item",{staticStyle:{},attrs:{label:"任务"}},[a("el-select",{attrs:{size:"small"},model:{value:t.task_code,callback:function(e){t.task_code=e},expression:"task_code"}},t._l(t.tasklist,(function(t){return a("el-option",{key:t,attrs:{label:t.Title,value:t.Code}})})),1),a("el-button",{staticClass:"margin_l_5",attrs:{size:"small"},on:{click:function(e){return t.search(2)}}},[t._v("搜索")]),a("el-button",{staticClass:"margin_l_5",attrs:{size:"small",type:"primary"},on:{click:function(e){return t.exportExcel()}}},[t._v("导出")])],1)],1),a("el-card",[a("div",{staticClass:"content sun_content"},[a("div",{staticClass:"sum_table"},[a("data-tables",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"refTable",attrs:{filters:t.filters,data:t.gather_list,"pagination-props":{pageSizes:[10,15,30]},"table-props":t.tableProps},on:{"selection-change":t.handleSelectionChange,"row-click":t.clickTable}},t._l(t.titles_one,(function(t){return a("el-table-column",{key:t,attrs:{label:t.label,prop:t.prop}})})),1)],1)])])],1)},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"top_form"},[a("span",{staticClass:"name_span"},[t._v("汇总")])])}],r=(a("b0c0"),a("ac1f"),a("841c"),a("ade3")),l=a("5a6e"),n={name:"gatherlist",data:function(){return Object(r["a"])({loading:!1,terms:"",task_code:"",gather_list:[],filterText:"",departid:"",departlist:[],filters:[{prop:["userid","user_name","depart","career","position","user_state"],value:""}],rule_list:[],rule_list_key:[],title:"",code:"",assignlist:[],tableProps:{border:!0,"header-cell-style":{background:"#eef1f6",color:"#606266"}},is_detail:!1,detail:{},formdetail:{},termlist:[],tasklist:[],titles_one:[{prop:"depart",label:"单位"},{prop:"理论课",label:"理论课"},{prop:"实验课",label:"实验课"},{prop:"上机课",label:"上机课"},{prop:"实践课",label:"实践课"},{prop:"课程设计",label:"课程设计"},{prop:"毕业设计",label:"毕业设计"},{prop:"实习",label:"实习"},{prop:"大创",label:"大创"},{prop:"其他",label:"其他"},{prop:"合计",label:"合计"},{prop:"金石滩计划学时",label:"金石滩计划学时"}],titles_two:["全日制本科","非全日制本科","继续教育、职业教育、专科","学术型研究生","全日制专业型硕士","非全日制专业型硕士","MBA专业硕士","本科生毕业论文","硕士生毕业论文","博士生毕业论文","硕士生日常指导","博士生日常指导","辅修、双学位","本科生双创项目","补贴工作量","授课工作量补贴","非授课工作量补贴","补贴备注","非授课工作量","授课工作量","其他"]},"gather_list","")},methods:{search:function(t){var e=this,a=this;if(""==this.task_code)return this.$alert("请选择学期！","提示",{confirmButtonText:"确定"}),!1;var s={task_code:this.task_code},i=a.$createObj(s),r=i["keyvalue"],l=a.$apilist["alldatagatherbytask"]+"?signature="+r;this.loading=!0,a.$server.post(l,i["fd"]).then((function(t){e.loading=!1,e.gather_list=t.data})).catch((function(t){}))},getterm:function(){var t=this,e={userid:this.$store.state.userid,corpid:this.$store.state.corpid},a=this.$createObj(e),s=a["keyvalue"],i=this.$apilist["term"]+"?signature="+s;this.$server.post(i,a["fd"]).then((function(e){t.termlist=e.data.reverse()}))},alltasklist:function(){var t=this,e=this,a={corpid:this.$store.state.corpid,userid:this.$store.state.userid},s=e.$createObj(a),i=s["keyvalue"],r=e.$apilist["alltasklist"]+"?signature="+i;this.$server.post(r,s["fd"]).then((function(e){t.tasklist=e.data,t.task_code=e.data[0].Code,t.search(2)})).catch((function(t){}))},detailClick:function(t){this.is_detail=!this.is_detail,this.detail=t},detailBack:function(t){this.is_detail=t},getgather:function(){var t=this,e=this.$route.query.id;this.code=Object(l["a"])(e),this.title=this.$route.query.name,this.taskid=e;var a=this,s={corpid:this.$store.state.corpid,userid:this.$store.state.userid,task_code:Object(l["a"])(e)},i=a.$createObj(s),r=i["keyvalue"],n=a.$apilist["datagather"]+"?signature="+r;this.gather_list=[],this.rule_list=[],this.rule_list_key=[],a.$server.post(n,i["fd"]).then((function(e){t.gather_list=e.data})).catch((function(t){}))},level2departmap:function(){var t=this,e=this,a={corpid:this.$store.state.corpid,userid:this.$store.state.userid},s=e.$createObj(a),i=s["keyvalue"],r=e.$apilist["level2departmap"]+"?signature="+i;this.gather_list=[],this.rule_list=[],this.rule_list_key=[],e.$server.post(r,s["fd"]).then((function(e){t.departlist=e.data})).catch((function(t){}))},exportExcel:function(){var t=this,e=this;if(""==this.task_code)return this.$alert("请选择任务！","提示",{confirmButtonText:"确定"}),!1;var a={task_code:this.task_code},s=e.$createObj(a),i=s["keyvalue"],r=e.$apilist["exportmaingatherexcel"]+"?signature="+i;e.$server.post(r,s["fd"]).then((function(e){window.location.href=t.$store.state.imgurl+"/"+e.data.path})).catch((function(t){}))}},mounted:function(){this.alltasklist(),this.level2departmap()}},o=n,c=(a("5bc4"),a("2877")),d=Object(c["a"])(o,s,i,!1,null,null,null);e["default"]=d.exports}}]);