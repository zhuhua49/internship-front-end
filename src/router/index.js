import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/student/Home',
  },
  {
    path: '/admin',
    redirect: '/admin/Home',
  },
  {
    path: '/student/Home',
    name: 'studentHome',
    component: () => import('../views/student/home/studentHome.vue')
  },
  {
    path: '/student/Register',
    name: 'studentRegister',
    component: () => import('../views/student/register/studentRegister.vue')
  },
  {
    path: '/student/Login',
    name: 'studentLogin',
    component: () => import('../views/student/login/studentLogin.vue')
  },
  {
    path: '/student/EditInfo',
    name: 'studentEditInfo',
    component: () => import('../views/student/editInfo/studentEditInfo.vue')
  },
  {
    path: '/student/EditPW',
    name: 'studentEditPW',
    component: () => import('../views/student/editPW/studentEditPW.vue')
  },
  {
    path: '/student/UploadCV',
    name: 'studentUploadCV',
    component: () => import('../views/student/uploadCV/uploadCV.vue')
  },
  {
    path: '/student/candidate/Manage',
    name: 'studentCandidateManage',
    component: () => import('../views/student/candidate/manage/candidateManage.vue')
  },
  {
    path: '/student/seeJob/:id',
    name: 'studentSeeJob',
    component: () => import('../views/student/seeJob/seeJob.vue')
  },
  {
    path: '/student/seeEnterprise/:id',
    name: 'studentSeeEnterprise',
    component: () => import('../views/student/seeEnterprise/seeEnterprise.vue')
  },
  {
    path: '/enterprise/Home',
    name: 'enterpriseHome',
    component: () => import('../views/enterprise/home/enterpriseHome.vue')
  },
  {
    path: '/enterprise/Register',
    name: 'enterpriseRegister',
    component: () => import('../views/enterprise/register/enterpriseRegister.vue')
  },
  {
    path: '/enterprise/Login',
    name: 'enterpriseLogin',
    component: () => import('../views/enterprise/login/enterpriseLogin.vue')
  },
  {
    path: '/enterprise/EditInfo',
    name: 'enterpriseEditInfo',
    component: () => import('../views/enterprise/editInfo/enterpriseEditInfo.vue')
  },
  {
    path: '/enterprise/EditPW',
    name: 'enterpriseEditPW',
    component: () => import('../views/enterprise/editPW/enterpriseEditPW.vue')
  },
  {
    path: '/job/Posting',
    name: 'jobPosting',
    component: () => import('../views/job/posting/jobPosting.vue')
  },
  {
    path: '/job/Manage',
    name: 'jobManage',
    component: () => import('../views/job/manage/jobManage.vue')
  },
  {
    path: '/candidate/Manage',
    name: 'candidateManage',
    component: () => import('../views/candidate/manage/candidateManage.vue')
  },
  {
    path: '/admin/Home',
    name: 'adminHome',
    component: () => import('../views/admin/home/adminHome.vue')
  },
  {
    path: '/admin/Login',
    name: 'adminLogin',
    component: () => import('../views/admin/login/adminLogin.vue')
  },
  {
    path: '/admin/Accusation/ToEnterprise',
    name: 'adminAccusationToEnterprise',
    component: () => import('../views/admin/accusation/toEnterprise/toEnterprise.vue')
  },
  {
    path: '/admin/Accusation/ToJob',
    name: 'adminAccusationToJob',
    component: () => import('../views/admin/accusation/toJob/toJob.vue')
  },
  {
    path: '/admin/Accusation/ToStudent',
    name: 'adminAccusationToStudent',
    component: () => import('../views/admin/accusation/toStudent/toStudent.vue')
  },
  {
    path: '/admin/addAdmin',
    name: 'addAdmin',
    component: () => import('../views/admin/addAdmin/addAdmin.vue')
  },
  {
    path: '/admin/manageAdmin',
    name: 'manageAdmin',
    component: () => import('../views/admin/manageAdmin/manageAdmin.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
