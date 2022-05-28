
export const apilist = {

  //--------------------------------------------------------
  'getloginuserid': 'api/common/getloginuserid',//auth_code  手机端
  'getloginuser': 'api/login/getloginuser',//auth_code  pc端
  'getjssdksign': 'api/common/getjssdksign',//corpid url

  //职位
  'getallposition': 'api/basedata/getallposition',//
  'deloneposition': 'api/basedata/deloneposition',//c
  'addoneposition': 'api/basedata/addoneposition',//position
  'editposition': 'api/basedata/editposition',//id position
  //职称
  'getallcareer': 'api/basedata/getallcareer',//
  'delonecareer': 'api/basedata/delonecareer',//id
  'addonecareer': 'api/basedata/addonecareer',//career
  'editcareer': 'api/basedata/editcareer',//id career
  //form
  'gettemplateforminfo': 'api/basedata/gettemplateforminfo',//userid
  'gettemplateformdetail': 'api/basedata/gettemplateformdetail',//form_code
  'deltemplateform': 'api/basedata/deltemplateform',//form_code
  'addonetemplateform': 'api/basedata/addonetemplateform',//userid form_info
  'edittemplateformtitle': 'api/basedata/edittemplateformtitle',//form_code title
  'edittemplateformtype': 'api/basedata/edittemplateformtype',//form_code type_id
  'gettemplateworkflow': 'api/basedata/gettemplateworkflow',//
  'addtemplateworkflow': 'api/basedata/addtemplateworkflow',//workflow_info
  'checkformula': 'api/basedata/checkformula',//formula_methods
  'editone': 'api/type/editone',//corpid id content
  'delone': 'api/type/delone',//corpid id userid
  'edittype': 'api/form/edittype',//code type_id
  'edittitle': 'api/form/edittitle',//code title
  //组织管理
  'getalluserinfobydepartid': 'api/user/getalluserinfobydepartid',//department_id page_size page_index
  'addoneuser': 'api/user/addoneuser',//departid userid username mobile email position career remark
  'edituser': 'api/user/edituser',//departid userid username mobile email position career remark
  'deluserinfos': 'api/user/deluserinfos',//self userids
  'deloneuser': 'api/user/deloneuser',//self userid
  'searchuser': 'api/user/searchuser',//query_data depart_id
  'adddepartment': 'api/department/adddepartment',//department
  'deldepartment': 'api/department/deldepartment',//department_id
  'editdepartment': 'api/department/editdepartment',//department_id department
  'getalldepartment': 'api/department/getalldepartment',//
  'getalldepartmentanduser': 'api/department/getalldepartmentanduser',//
  'checkuserid': 'api/user/checkuserid',//检查用户名 corpid userid
  //类型
  'getallbytype': 'api/basedata/getallbytype',//typedesc userid
  'editonetype': 'api/basedata/editonetype',//id content
  'addonetype': 'api/basedata/addonetype',//type_desc content userid
  'delonetype': 'api/basedata/delonetype',//id userid
  //任务
  'alltasklist': 'api/task/alltasklist',//
  'addonetask': 'api/task/addonetask',//remark title start_date end_date userid userid
  'switchtaskstate': 'api/task/switchtaskstate',//task_code  state
  'countoftask': 'api/task/countoftask',//task_code  删除时使用
  'delonetask': 'api/task/delonetask',//task_code
  'editonetask': 'api/task/editonetask',//remark title start_date end_date userid  task_code
  'pubtask': 'api/task/pubtask',//task_code
  'maincountinfo': 'api/task/maincountinfo',//task_code userid
  'getexceltemplate': 'api/task/getexceltemplate',//form_code
  'addmaindatabyexcel': 'api/task/addmaindatabyexcel',//doc_code
  //申报页
  'getactivetask': 'api/task/getactivetask',//
  'getselfformlist': 'api/task/getselfformlist',//task_code userid
  'edittaskuser': 'api/task/edittaskuser',//userid task_code departid position career
  'allmaindatabyformcodeanduserid': 'api/maindata/allmaindatabyformcodeanduserid',//task_code userid form_code 如果不传userid 就是所有的 不传form_code 就是这个人下所有数据
  'addone_main': 'api/maindata/addone',//form_field_info form_code userid task_code
  'formdetail': 'api/maindata/formdetail',//form_code
  'allusernameandid': 'api/user/allusernameandid',//corpid
  'countfunction': 'api/maindata/countfunction',//form_code rule_file_info
  'detailbycode': 'api/maindata/detailbycode',//main_code
  'edit': 'api/maindata/edit',//main_code form_field_info
  'getauditlist': 'api/maindata/getauditlist',//task_code
  'commitmaindatawithnodecode': 'api/maindata/commitmaindatawithnodecode',//main_code depart_code node_code
  'batchcommitmaindatawithnodecode': 'api/maindata/batchcommitmaindatawithnodecode',//main_codes depart_code node_code
  'callbackone': 'api/maindata/callbackone',//main_code
  'delone_main': 'api/maindata/delone',//
  'batchdel': 'api/maindata/batchdel',//
  'getallloginfobydatacode': 'api/maindata/getallloginfobydatacode',//
  'historytask': 'api/task/historytask',//userid corpid,结束的填报任务
  //审批
  'alltoauditelist': 'api/maindata/alltoauditelist',//userid corpid 获取审批列表
  'allhaveauditedlist': 'api/maindata/allhaveauditedlist',//userid corpid  已审批列表
  'denyone': 'api/maindata/denyone',//main_code  userid content 拒绝
  'denymaindatas': 'api/maindata/denymaindatas',//main_codes userid content 批量拒绝
  'approveone': 'api/maindata/approveone',//main_code  userid 通过
  'approvemaindatas': 'api/maindata/approvemaindatas',//main_codes userid 批量通过

  'getallloginfobydatacode': 'api/maindata/getallloginfobydatacode',//

  'gatherlist': 'api/gather/gatherlist',//corpid task_code
  'export': 'api/gather/export',//corpid task_code
  'qiniudown': 'api/common/qiniudown',//key
  'login': 'api/user/login',//userid passwd
  'qiniutoken': 'api/common/qiniutoken',//get

  // 'deltemplateform': 'api/form/deltemplateform',//form_code

  'getselfformlist': 'api/task/getselfformlist',//
  'count': 'api/maindata/count',//task_code form_code
  'adminaddone': 'api/maindata/adminaddone',//admin_userid  corpid  form_field_info  form_code  userid  task_code
  'getexceltemplate': 'api/task/getexceltemplate',//form_code
  'addmaindatabyexcel': 'api/task/addmaindatabyexcel',//doc_code  userid  corpid  task_code  form_code
  'getallaudittaskbyuserid': 'api/task/getallaudittaskbyuserid',//corpid userid page_index page_size
  'gatherlistaudit': 'api/gather/gatherlistaudit',//corpid task_code userid
  'exportaudit': 'api/gather/exportaudit',//corpid task_code userid
  'getaudformlist': 'api/task/getaudformlist',//userid corpid task_code
  'allmaindatabyformcodeandaudituserid': 'api/maindata/allmaindatabyformcodeandaudituserid',//task_code userid form_code corpid

  'countselected': 'api/maindata/countselected',//


  //公示
  'getpubinfo': 'api/pubtask/getpubinfo',//task_code
  'updatepubinfo': 'api/pubtask/updatepubinfo',//task_code state start_date end_date pub_scope
  'allpubtask': 'api/task/allpubtask',//userid corpid page_index page_size
  'allpubdata': 'api/task/allpubdata',//userid corpid task_code form_code
  'getformlist': 'api/task/getformlist',//

  'uploadfiles': 'api/common/uploadfiles',//上传 file userid
  'uploadimages': 'api/common/uploadimages',//
  //管理员
  'addoneadmin': 'api/user/addoneadmin',//userid departids level
  'alladmin': 'api/user/alladmin',//userid
  'deloneadmin': 'api/user/deloneadmin',//userid
  'signin': 'api/login/signin',//userid passwd
  'setpasswd': 'api/login/setpasswd',//userid passwd username
  'checkisauditor': 'api/task/checkisauditor',//

  'term': 'api/basedata/term',//
  'datagather': 'api/gather/datagather',//task_code terms userid
  'othertoselfassigndata': 'api/maindata/othertoselfassigndata',//task_code corpid userid form_code 他人分配给自己的，如果不传form_code 就是这个任务所有的
  'datagatherbydepart': 'api/gather/datagatherbydepart',//task_code  depart_id  terms
  'overloadworkload': 'api/gather/overloadworkload',//task_code  userid
  'hegangworkload': 'api/gather/hegangworkload',//task_code userid  terms
  'exportallgatherexcel': 'api/gather/exportallgatherexcel',//task_code userid  terms
  'exportdepartgatherexcel': 'api/gather/exportdepartgatherexcel',//task_code
  'exportoverloadworkload': 'api/gather/exportoverloadworkload',//task_code userid  terms
  'exporthegang': 'api/gather/exporthegang',//task_code userid terms
  'level2departmap': 'api/login/level2departmap',//userid
  'updatecooper': 'api/basedata/updatecooper',//code  cooper
  'updatecooper_task': 'api/task/updatecooper',//
  'allauthorizetask': 'api/task/allauthorizetask',//userid state
  'allauthorizeformbytaskcode': 'api/task/allauthorizeformbytaskcode',//userid task_code
  'allmaindatabyimportuserid': 'api/maindata/allmaindatabyimportuserid',//task_code import_userid form_code
  'departgather': 'api/gather/departgather',//task_code  depart_id
  'alldatagatherbytask': 'api/gather/alldatagatherbytask',//task_code

  'allgatherexcel': 'api/gather/allgatherexcel',//
  'alluserdatagatherbytask': 'api/gather/alluserdatagatherbytask',//
  'exportgatherexcel': 'api/gather/exportgatherexcel',//
  'personalgather': 'api/gather/personalgather',//
  'exportmaingatherexcel': 'api/gather/exportmaingatherexcel',
  'exportallgatherexcel': 'api/gather/exportallgatherexcel',
  'oneuserdetail': 'api/user/oneuserdetail',//userid corpid

};