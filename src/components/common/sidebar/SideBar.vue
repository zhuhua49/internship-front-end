<template>
  <div>
    <el-menu v-if="studentSidebar" class="sidebar" default-active="/student/Home" router>
      <el-menu-item index="/student/Home">
        <i class="el-icon-search"/>
        查看职位
      </el-menu-item>
      <el-menu-item index="/student/candidate/Manage">
        <i class="el-icon-tickets"/>
        求职信息管理
      </el-menu-item>
      <el-menu-item index="/student/UploadCV">
        <i class="el-icon-upload2"/>
        上传简历
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"/>
          个人设置
          <el-badge :is-dot="isPerfect"/>
        </template>
        <el-menu-item index="/student/EditInfo">
          修改信息
          <el-badge :is-dot="isPerfect"/>
        </el-menu-item>
        <el-menu-item index="/student/EditPW">
          修改密码
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-menu v-if="adminSidebar" class="sidebar" router>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-warning-outline"/>
          举报管理
        </template>
        <el-menu-item index="/admin/Accusation/ToEnterprise">
          公司举报
        </el-menu-item>
        <el-menu-item index="/admin/Accusation/ToJob">
          职位举报
        </el-menu-item>
        <el-menu-item index="/admin/Accusation/ToStudent">
          求职者举报
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-user"/>
          管理员管理
        </template>
        <el-menu-item index="/admin/addAdmin" :disabled=" getAdmin.level === '普通管理员' ">
          添加管理员
        </el-menu-item>
        <el-menu-item index="/admin/manageAdmin">
          查看管理员
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-menu v-if="enterpriseSidebar" class="sidebar" router>
      <el-submenu index="1" :disabled="disabled">
        <template slot="title">
          <i class="el-icon-tickets"/>
          职位管理
        </template>
        <el-menu-item index="/job/Posting">
          发布职位
        </el-menu-item>
        <el-menu-item index="/job/Manage">
          管理职位
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/candidate/Manage">
        <i class="el-icon-user"/>
        求职者管理
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-setting"/>
          企业设置
        </template>
        <el-menu-item index="/enterprise/EditInfo">
          修改信息
        </el-menu-item>
        <el-menu-item index="/enterprise/EditPW">
          修改密码
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="placeholder"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "SideBar",
    computed: {
      ...mapGetters(['getStudent', 'getEnterprise', 'getAdmin']),
      studentSidebar() {
        return this.$route.path.indexOf('/student/') !== -1 && this.$cookies.isKey('studentID')
      },
      adminSidebar() {
        return this.$route.path.indexOf('/admin/') !== -1 && this.$cookies.isKey('adminID')
      },
      enterpriseSidebar() {
        return this.$route.path.indexOf('/student/') === -1 && this.$route.path.indexOf('/admin/') === -1
          && this.$cookies.isKey('enterpriseID')
      },
      disabled() {
        return !(typeof (this.getEnterprise.name) == 'string' && this.getEnterprise.name !== '')
      },
      isPerfect() {
        return this.$route.path.indexOf('/student/') !== -1 && this.$cookies.isKey('studentID') &&
          this.$route.path.indexOf("EditInfo") === -1 &&
          !(typeof (this.getStudent.realname) == 'string' && this.getStudent.realname !== '')
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .sidebar {
    position: fixed;
    top: 45px;
    left: 0;
    z-index: 9;

    width: 170px;
    height: calc(100vh - 45px);
    margin-left: -20px;

    overflow: hidden;
  }

  .el-badge {
    position: absolute;
  }

  .placeholder {
  }
</style>
