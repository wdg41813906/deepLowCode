(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5473a177"],{"0a2b":function(t,e,i){},"2ce5":function(t,e,i){"use strict";i("0a2b")},"43a4":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"formlist_fill"},[i("div",{staticClass:"top_form"},[i("span",{staticClass:"name_span",class:{active_gatherlist:t.is_tab},on:{click:function(e){return t.tabClick(1)}}},[t._v(t._s(t.task_name)+"表单")]),i("span",{staticClass:"line_span"},[t._v("|")]),i("span",{staticClass:"name_span",class:{active_gatherlist:!t.is_tab},attrs:{span:""},on:{click:function(e){return t.tabClick(2)}}},[t._v("所有数据")]),i("span",{staticClass:"right"},[i("router-link",{staticClass:"margin_l_10",attrs:{to:{name:"ListFill",query:{k:Date.now()}}}},[i("el-button",{attrs:{icon:"iconfont icon-cancel",size:"small"}},[t._v("返回")])],1)],1)]),t.is_tab?i("div",t._l(t.sortFun(t.formlist),(function(e){return i("div",{key:e,staticClass:"type_div"},[i("p",{staticClass:"title_form"},[i("span",{on:{click:function(i){return t.typeEditorClick(e,t.formlist[e][0].TypeContent)}}},[t._v(" "+t._s(t.formlist[e][0].TypeContent)+" ")])]),i("div",{staticClass:"clearfix"}),1==t.isStr(t.formlist[e])?i("ul",{staticClass:"eform-list clearfix"},t._l(t.formlist[e],(function(e){return i("li",{key:e,on:{mouseover:function(e){return t.mouseOver(e)},mouseleave:function(e){return t.mouseLeave(e)}}},[i("div",{staticClass:"list_box"},[i("div",{staticClass:"content_list_item"},[i("p",{staticClass:"p_over left width_150",attrs:{slot:"reference"},slot:"reference"},[t._v(" "+t._s(e.Title)+" ")]),e.DenyCount>0?i("p",{staticClass:"right other_count"},[t._v(" "+t._s(e.DenyCount)+" ")]):t._e(),i("div",{staticClass:"clearfix"})]),i("div",[i("div",{staticClass:"left other_left"},[i("p",[t._v("已填报数："+t._s(e.AllCount))]),i("p",[t._v("待审批数："+t._s(e.CommitCount))])]),i("ul",{staticClass:"operation flex right"},[i("li",{on:{click:function(i){return t.goClick(e)}}},[i("span",[t._v("进入")])])])])])])})),0):t._e(),i("div",{staticClass:"clearfix"})])})),0):t._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.is_tab,expression:"!is_tab"}]},[i("data-tables",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",attrs:{data:t.tableData,"pagination-props":{pageSizes:[5,10,15]},"row-key":t.row_key,"expand-row-keys":t.expandRowKeys,"table-props":t.tableProps},on:{"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{label:"内容"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.FormFieldInfos,(function(e,a){return i("div",{key:e},[a<3?i("p",{staticClass:"flow-subtitle"},[""!=e.opt_label&&"image"!=e.opt_label&&"file"!=e.opt_label?i("span",[t._v(" "+t._s(e.field_label)+":"+t._s(e.opt_label.split("__")[1])+" ")]):"image"==e.opt_label||"file"==e.opt_label?i("span",[t._v(" "+t._s(e.field_label)+": "),e.value.length>1?i("span",[t._v(t._s(e.value[0].name)+"...")]):1==e.value.length?i("span",[t._v(t._s(e.value[0].name))]):i("span",[t._v("-")])]):i("span",[t._v(" "+t._s(e.field_label)+":"+t._s(e.value)+" ")])]):t._e()])}))}}])}),i("el-table-column",{attrs:{label:"表单名",prop:"FormName"}}),i("el-table-column",{attrs:{label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("div",{staticClass:"flow-permisson-row"},[i("span",[0==e.row.State?i("span",{staticClass:"flow_per"},[t._v("未提交")]):1==e.row.State?i("span",{staticClass:"flow_per warning"},[t._v("已提交 ")]):2==e.row.State?i("span",{staticClass:"flow_per danger"},[t._v("驳回")]):3==e.row.State?i("span",{staticClass:"flow_per success"},[t._v("已通过")]):4==e.row.State?i("span",{staticClass:"flow_per warning"},[t._l(e.row.AuditStates,(function(a,s){return i("span",{key:a},[i("span",[t._v(t._s(a.user_info[0].name))]),s<e.row.AuditStates.length-1?i("span",[t._v("/")]):t._e()])})),t._v(" 审核中")],2):5==e.row.State?i("span",{staticClass:"flow_per success"},[t._v("已通过")]):6==e.row.State?i("span",{staticClass:"flow_per"},[t._v("导入数据")]):t._e()])])]}}])}),i("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-dropdown",[i("span",{staticClass:"el-dropdown-link"},[i("i",{staticClass:"el-icon-more"})]),i("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[i("el-dropdown-item",[i("p",{on:{click:function(i){return t.detailClick(e.row)}}},[t._v("详情")])]),i("el-dropdown-item",[i("p",{on:{click:function(i){return t.delClick(e.row.Code)}}},[t._v(" 删除 ")])])],1)],1)]}}])})],1),i("div",{staticClass:"clearfix"}),i("div",{staticClass:"text_right"},[i("el-link",{staticClass:"margin_l_5 link_font",attrs:{type:"primary"},on:{click:function(e){return t.gourl()}}},[t._v("查看汇总>>")])],1)],1),i("el-dialog",{staticClass:"audit_dialog",attrs:{title:"选择审批",visible:t.dialogTableVisible,width:"600px","close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogTableVisible=e}}},[i("el-form",{staticClass:"auditform",attrs:{"label-width":"80px"},nativeOn:{submit:function(t){t.preventDefault()}}},[i("el-form-item",{attrs:{label:"部门"}},[i("el-select",{attrs:{placeholder:"请选择"},on:{change:function(e){return t.auditSelectClick()}},model:{value:t.select_depart,callback:function(e){t.select_depart=e},expression:"select_depart"}},t._l(t.auditkey,(function(e){return i("el-option",{key:e,attrs:{label:t.auditlist[e].depart_name,value:e}})})),1)],1),i("el-form-item",{attrs:{label:"审批"}},[i("el-select",{attrs:{placeholder:"请选择"},model:{value:t.select_auditcode,callback:function(e){t.select_auditcode=e},expression:"select_auditcode"}},t._l(t.audit_key_list,(function(t){return i("el-option",{key:t.NodeCode,attrs:{label:t.ConditionName,value:t.NodeCode}})})),1)],1)],1),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{size:"small"},on:{click:function(e){t.dialogTableVisible=!1}}},[t._v("取 消")]),i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){return t.auditSubmitClick()}}},[t._v("确 定")])],1)],1),i("FillAlert",{attrs:{is_add:t.is_add,formlist:t.formlist,task_code:t.task_code},on:{back:t.fillBack,subback:t.subFillBack}}),i("FillEditorAlert",{attrs:{is_add:t.is_editor,form_data:t.formdetail,main_code:t.main_code,task_code:t.task_code,detail:t.detail},on:{back:t.fillEBack,subback:t.subFillEBack}}),i("DetailAlert",{attrs:{is_add:t.is_detail,detail:t.detail,form_data:t.formdetail},on:{back:t.detailBack,otherback:t.otherDetailBack}}),i("LogAlert",{attrs:{is_add:t.is_log,code:t.logcode},on:{back:t.logBack}})],1)},s=[],l=(i("99af"),i("b0c0"),i("b64b"),i("ade3")),o=i("5a6e"),n=i("03e5"),r=i("d394"),c=i("b4f9"),d=i("9583"),u={name:"formlist_fill",components:{FillAlert:n["a"],FillEditorAlert:r["a"],DetailAlert:c["a"],LogAlert:d["a"]},data:function(){var t;return t={loading:!1,task_code:"",task_name:"",formlist:[],is_tab:!1,tableData:[]},Object(l["a"])(t,"loading",!1),Object(l["a"])(t,"filed_infos",[]),Object(l["a"])(t,"tableProps",{border:!0,"header-cell-style":{background:"#eef1f6",color:"#606266"}}),Object(l["a"])(t,"is_detail",!1),Object(l["a"])(t,"detail",{}),Object(l["a"])(t,"is_add",!1),Object(l["a"])(t,"formdetail",{}),Object(l["a"])(t,"is_editor",!1),Object(l["a"])(t,"main_code",""),Object(l["a"])(t,"dellist",""),Object(l["a"])(t,"auditlist",""),Object(l["a"])(t,"auditkey",""),Object(l["a"])(t,"codeval",""),Object(l["a"])(t,"dialogTableVisible",!1),Object(l["a"])(t,"select_depart",""),Object(l["a"])(t,"select_auditcode",""),t},methods:{gourl:function(){this.$router.push({name:"sumendFill",query:{id:this.$route.query.id,name:this.$route.query.name}})},otherDetailBack:function(){this.allmaindatabyformcodeanduserid()},auditSelectClick:function(){this.select_auditcode="",this.audit_key_list=this.auditlist[this.select_depart].conditions},auditSubmitClick:function(){if(""==this.select_auditcode)return this.$alert("请选择审批流程！","提示",{confirmButtonText:"确定"}),!1;1==this.num?this.commitmaindatawithnodecode(this.codeval):this.batchcommitmaindatawithnodecode(this.codeval)},commitmaindatawithnodecode:function(t){var e=this,i=this,a={corpid:this.$store.state.corpid,userid:this.$store.state.userid,main_code:t,depart_code:this.select_depart,node_code:this.select_auditcode},s=i.$createObj(a),l=s["keyvalue"],o=i.$apilist["commitmaindatawithnodecode"]+"?signature="+l;i.$server.post(o,s["fd"]).then((function(){e.dialogTableVisible=!1,e.$message({type:"success",message:"提交成功!"}),e.allmaindatabyformcodeanduserid()})).catch((function(t){}))},batchcommitmaindatawithnodecode:function(t){var e=this,i=this,a={corpid:this.$store.state.corpid,userid:this.$store.state.userid,main_codes:JSON.stringify(t),depart_code:this.select_depart,node_code:this.select_auditcode},s=i.$createObj(a),l=s["keyvalue"],o=i.$apilist["batchcommitmaindatawithnodecode"]+"?signature="+l;i.$server.post(o,s["fd"]).then((function(t){e.dialogTableVisible=!1,70002==t.data?e.$alert(t.message,"提示",{confirmButtonText:"确定",callback:function(t){e.allmaindatabyformcodeanduserid()}}):(e.$message({type:"success",message:"提交成功!"}),e.allmaindatabyformcodeanduserid())})).catch((function(t){}))},handleSelectionChange:function(t){this.dellist=t},addListClick:function(){if(0==this.dellist.length)return this.$alert("请选择提交内容！","提示",{confirmButtonText:"确定"}),!1;var t=[];for(var e in this.dellist)t.push(this.dellist[e].Code);this.submitClick(t,2)},submitClick:function(t,e){this.dialogTableVisible=!this.dialogTableVisible,this.num=e,this.codeval=t},getauditlist:function(){var t=this,e=this,i={corpid:this.$store.state.corpid,userid:this.$store.state.userid,task_code:this.task_code},a=e.$createObj(i),s=a["keyvalue"],l=e.$apilist["getauditlist"]+"?signature="+s;e.$server.post(l,a["fd"]).then((function(e){t.auditlist=e.data,t.auditkey=Object.keys(e.data)})).catch((function(t){}))},batchdel:function(){var t=this;if(0==this.dellist.length)return this.$alert("请选择要删除的数据","提示",{confirmButtonText:"确定"}),!1;this.$confirm("此操作将永久删除数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var e=[];for(var i in t.dellist)e.push(t.dellist[i].Code);var a=t,s={corpid:t.$store.state.corpid,userid:t.$store.state.userid,main_codes:JSON.stringify(e)},l=a.$createObj(s),o=l["keyvalue"],n=a.$apilist["batchdel"]+"?signature="+o;a.$server.post(n,l["fd"]).then((function(e){t.$message({type:"success",message:"删除成功!"}),t.dellist=[],t.allmaindatabyformcodeanduserid()})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))}))},delClick:function(t){var e=this;this.$confirm("删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var i=e,a={corpid:e.$store.state.corpid,userid:e.$store.state.userid,code:t},s=i.$createObj(a),l=s["keyvalue"],o=i.$apilist["delone_main"]+"?signature="+l;i.$server.post(o,s["fd"]).then((function(){e.allmaindatabyformcodeanduserid(),e.$message({type:"success",message:"删除成功!"})})).catch((function(t){}))})).catch((function(){}))},ediotrFillClick:function(t){this.main_code=t.Code,this.detail=t,this.getformdetail(t.FormCode)},getformdetail:function(t){var e=this,i=this;this.name=this.$route.query.name;var a={corpid:this.$store.state.corpid,userid:this.$store.state.userid,form_code:t},s=i.$createObj(a),l=s["keyvalue"],o=i.$apilist["formdetail"]+"?signature="+l;i.$server.post(o,s["fd"]).then((function(i){e.formdetail=i.data,e.formdetail.form_code=t,e.is_editor=!e.is_editor})).catch((function(t){}))},fillEBack:function(t){this.is_editor=t},subFillEBack:function(){this.allmaindatabyformcodeanduserid()},subFillBack:function(){this.allmaindatabyformcodeanduserid()},fillClick:function(){this.is_add=!this.is_add},fillBack:function(t){this.is_add=t},detailClick:function(t){this.is_detail=!this.is_detail,this.detail=t},detailBack:function(t){this.is_detail=t},goClick:function(t){this.$router.push({name:"fillendFill",query:{name:t.Title,taskname:this.$route.query.name,id:Object(o["b"])(t.Code),taskcode:this.$route.query.id}})},tabClick:function(t){this.is_tab=1==t},isStr:function(t){return"string"!=typeof t?1:234},sortFun:function(t){var e=[],i=[],a=Object.keys(t);for(var s in a)"string"==typeof t[a[s]]?i.push(a[s]):e.push(a[s]);return e.concat(i.reverse())},mouseOver:function(t){t.currentTarget.className="  active"},mouseLeave:function(t){t.currentTarget.className=""},getselfformlist:function(){var t=this,e=this;this.task_code=Object(o["a"])(this.$route.query.id);var i={corpid:this.$store.state.corpid,userid:this.$store.state.userid,task_code:this.task_code},a=e.$createObj(i),s=a["keyvalue"],l=e.$apilist["getselfformlist"]+"?signature="+s;e.$server.post(l,a["fd"]).then((function(e){t.formlist=e.data})).catch((function(t){}))},allmaindatabyformcodeanduserid:function(){var t=this,e=this;this.task_code=Object(o["a"])(this.$route.query.id),this.task_name=Object(o["a"])(this.$route.query.name);var i={corpid:this.$store.state.corpid,userid:this.$store.state.userid,task_code:this.task_code},a=e.$createObj(i),s=a["keyvalue"],l=e.$apilist["allmaindatabyformcodeanduserid"]+"?signature="+s;this.loading=!0,e.$server.post(l,a["fd"]).then((function(e){if(t.tableData=e.data,t.select_depart="",t.select_auditcode="",t.loading=!1,0==e.data.length){for(var i in t.filed_infos=[],e.filed_infos)t.filed_infos.push({label:e.filed_infos[i].label});t.filed_infos.push({label:"状态"}),t.filed_infos.push({label:"操作"})}})).catch((function(t){}))}},mounted:function(){this.getselfformlist(),this.allmaindatabyformcodeanduserid(),this.getauditlist()}},f=u,_=(i("2ce5"),i("2877")),m=Object(_["a"])(f,a,s,!1,null,null,null);e["default"]=m.exports}}]);