import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: r => require(['../components/login/index.vue'], r),
  },
  {
    path: '/login_index_two',
    name: 'index1',
    component: r => require(['../components/login/index1.vue'], r),
  },
  {
    path: '/login',
    name: 'login',
    component: r => require(['../components/login/login_pc.vue'], r),
  },
  {
    path: '/login_transit',
    name: 'login_transit',
    component: r => require(['../components/login/login_transit.vue'], r),
  },
  {
    path: '/word',
    name: 'word',
    component: r => require(['../components/login/word.vue'], r),
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: r => require(['../components/login/index.vue'], r),
  // },
  {
    path: '/',
    redirect: "/index"
  }, {
    path: '/attention',
    name: 'attention',
    component: r => require(['../components/login/attention.vue'], r),
  },

  {
    path: '/dept',
    name: 'Dept',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'sumlist',
      name: 'sumDept',
      component: r => require(['../components/dept/sum.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'detaillist',
      name: 'detailDept',
      component: r => require(['../components/dept/detaillist.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    },
      //  {
      //   path: 'overload',
      //   name: 'overloadDept',
      //   component: r => require(['../components/dept/overload.vue'], r),
      //   meta: { role: ['0', null, '1', '2', 0, 1, 2] }
      // }, {
      //   path: 'verification',
      //   name: 'verificationDept',
      //   component: r => require(['../components/dept/verification.vue'], r),
      //   meta: { role: ['0', null, '1', '2', 0, 1, 2] }
      // },
    ]
  },
  {
    path: '/fill',
    name: 'fill',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'list',
      name: 'ListFill',
      component: r => require(['../components/fill/index.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'formlist',
      name: 'formlistFill',
      component: r => require(['../components/fill/formList.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'filllist',
      name: 'filllistFill',
      component: r => require(['../components/fill/formDetail.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'endlist',
      name: 'endlistFill',
      component: r => require(['../components/fill/formListEnd.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'sumfill',
      name: 'sumFill',
      component: r => require(['../components/fill/sum.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'sumendfill',
      name: 'sumendFill',
      component: r => require(['../components/fill/sumEnd.vue'], r),
    }, {
      path: 'fillend',
      name: 'fillendFill',
      component: r => require(['../components/fill/formDetailEnd.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'publicform',
      name: 'publicFormFill',
      component: r => require(['../components/fill/publicForm.vue'], r),
    }, {
      path: 'publictask',
      name: 'publicTaskFill',
      component: r => require(['../components/fill/publicTask.vue'], r),
    }, {
      path: 'publiclist',
      name: 'publicListFill',
      component: r => require(['../components/fill/publicList.vue'], r),
    },]
  },
  {
    path: '/newform',
    name: 'NewForm',
    component: r => require(['../components/forms/newform.vue'], r),
    meta: { role: ['0', null, '1', '2', 0, 1, 2] }
  },
  {
    path: '/lookform',
    name: 'lookForm',
    component: r => require(['../components/forms/lookform.vue'], r),
    meta: { role: ['0', null, '1', '2', 0, 1, 2] }
  },
  {
    path: '/editorform',
    name: 'editorForm',
    component: r => require(['../components/forms/editorForm.vue'], r),
    meta: { role: ['0', null, '1', '2', 0, 1, 2] }
  }, {
    path: '/copyform',
    name: 'copyForm',
    component: r => require(['../components/forms/copyForm.vue'], r),
    meta: { role: ['0', null, '1', '2', 0, 1, 2] }
  },
  {
    path: '/forms',
    name: 'forms',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'list',
      name: 'formList',
      component: r => require(['../components/forms/formList.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    },]
  },
  {
    path: '/auditT',
    name: 'auditTemplate',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'index',
      name: 'indexTemplate',
      component: r => require(['../components/audit/index.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    },]
  },
  {
    path: '/audit',
    name: 'audit',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'auditlist',
      name: 'ListAudit',
      component: r => require(['../components/auditA/index.vue'], r),
    }, {
      path: 'approvedlist',
      name: 'approvedAudit',
      component: r => require(['../components/auditA/approved.vue'], r),
    }, {
      path: 'tasklist',
      name: 'taskAudit',
      component: r => require(['../components/auditA/tasklist.vue'], r),
    }, {
      path: 'gathertask',
      name: 'gatherAudit',
      component: r => require(['../components/auditA/gatherlist.vue'], r),
    }, {
      path: 'filllist',
      name: 'filllistAudit',
      component: r => require(['../components/auditA/filllist.vue'], r),
    }, {
      path: 'sumlist',
      name: 'sumlistAudit',
      component: r => require(['../components/auditA/sum.vue'], r),
    },]
  },
  {
    path: '/task',
    name: 'task',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'index',
      name: 'indexTask',
      component: r => require(['../components/task/index.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'authorizelist',
      name: 'authorizeListTask',
      component: r => require(['../components/task/authorizelist.vue'], r),
    }, {
      path: 'alldata',
      name: 'alldataTask',
      component: r => require(['../components/task/alldata.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'alldataA',
      name: 'alldataATask',
      component: r => require(['../components/task/alldataA.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'formdata',
      name: 'formdataTask',
      component: r => require(['../components/task/formdata.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'formdataA',
      name: 'formdataATask',
      component: r => require(['../components/task/formdataA.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    }, {
      path: 'import/:other',
      name: 'importTask',
      component: r => require(['../components/task/components/importlist.vue'], r),
    }, {
      path: 'importA',
      name: 'importATask',
      component: r => require(['../components/task/components/importlistA.vue'], r),
    },]
  },
  {
    path: '/address',
    name: 'address',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/header/index.vue'),
    children: [{
      path: 'index',
      name: 'indexAddress',
      component: r => require(['../components/address/index.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    },
    {
      path: 'permission',
      name: 'permissionAddress',
      component: r => require(['../components/address/components/permissions.vue'], r),
      meta: { role: ['0', null, '1', '2', 0, 1, 2] }
    },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
