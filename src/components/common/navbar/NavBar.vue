<template>
  <div>
    <div class="navbar-entity">
      <div class="nav-bar">
        <div class="left">
          <router-link to="/student/Home">
            <el-image class="logo" :src="require('assets/img/logo.png')" fit="contain"/>
            <div id="logoName">斗金兼职</div>
          </router-link>
        </div>
        <div class="center">
          <slot name="center"/>
        </div>
        <div class="right" v-if="$route.path.indexOf('/student/') !== -1">
          <div v-if="$cookies.isKey('studentID')">
            <el-dropdown @command="handleStudent">
              <span class="el-dropdown-link">
                <el-avatar v-if="avatarLoad" :key="key" :src="avatarURL" size="medium" :error="avatarError"/>
                <span v-if="typeof (getStudent.realname) == 'string' && getStudent.realname !== ''">
                  {{getStudent.realname}}
                </span>
                <span v-else>{{getStudent.username}}</span>
                <i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="注销">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <div v-if="isLogin">
              <router-link to="/student/Login">登录</router-link>
            </div>
            <div v-if="isRegister">
              <router-link to="/student/Register">注册</router-link>
            </div>
          </div>
          <div class="switch">
            <router-link to="/enterprise/Home">转到企业版></router-link>
          </div>
        </div>
        <div class="right" v-else-if="$route.path.indexOf('/admin/') !== -1">
          <div v-if="$cookies.isKey('adminID')">
            <el-dropdown @command="handleAdmin">
              <span class="el-dropdown-link">
                <i class="el-icon-user"/>
                <span>{{getAdmin.realname}}</span>
                <i class="el-icon-arrow-down el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="注销">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else-if="isLogin">
            <router-link to="/admin/Login">登录</router-link>
          </div>
        </div>
        <div class="right" v-else>
          <div v-if="$cookies.isKey('enterpriseID')">
            <el-dropdown @command="handleEnterprise">
          <span class="el-dropdown-link">
            <el-avatar v-if="logoLoad" :key="key" :src="logoURL" size="medium" :error="logoError"/>
            <span v-if="typeof (getEnterprise.name) == 'string' && getEnterprise.name !== ''">
              {{getEnterprise.name}}
            </span>
            <span v-else>{{getEnterprise.username}}</span>
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="注销">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <div v-if="isLogin">
              <router-link to="/enterprise/Login">登录</router-link>
            </div>
            <div v-if="isRegister">
              <router-link to="/enterprise/Register">注册</router-link>
            </div>
          </div>
          <div class="switch">
            <router-link to="/student/Home">转到学生版></router-link>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 44px;"/>
  </div>
</template>

<script>
  import {student} from "network/student"
  import {enterprise} from "network/enterprise"
  import {admin} from "network/admin"
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "NavBar",
    data() {
      return {
        avatarLoad: true,
        logoLoad: true,
        key: 0,
        avatarURL: "",
        logoURL: "",
        showTip: true,
      }
    },
    computed: {
      ...mapGetters(['getStudent', 'getEnterprise', 'getAdmin']),
      isLogin() {
        return this.$route.path.indexOf("Login") === -1
      },
      isRegister() {
        return this.$route.path.indexOf("Register") === -1
      },
    },
    created() {
      if (this.$cookies.isKey('studentID')) {
        student(this.$cookies.get('studentID')).then(res => {
          this.setStudent(res);
          this.avatarURL = "http://localhost:8081/avatar/" + this.getStudent.id + this.getStudent.username + ".jpg?"+new Date();
          this.key++
        })
      }
      if (this.$cookies.isKey('enterpriseID')) {
        enterprise(this.$cookies.get('enterpriseID')).then(res => {
          this.setEnterprise(res);
          this.logoURL = "http://localhost:8081/logo/" + this.getEnterprise.id + this.getEnterprise.username + ".jpg?"+new Date();
          this.key++
        })
      }
      if (this.$cookies.isKey('adminID')) {
        admin(this.$cookies.get('adminID')).then(res => {
          this.setAdmin(res);
        })
      }
      this.$bus.$on("avatarChange", () => {
        this.avatarURL = "http://localhost:8081/avatar/" + this.getStudent.id + this.getStudent.username + ".jpg?"+new Date();
        this.key++;
        this.avatarLoad = true;
      });
      this.$bus.$on("logoChange", () => {
        this.logoURL = "http://localhost:8081/logo/" + this.getEnterprise.id + this.getEnterprise.username + ".jpg?"+new Date();
        this.key++;
        this.logoLoad = true;
      })
    },
    methods: {
      ...mapMutations(['setStudent', 'setEnterprise', 'setAdmin']),
      avatarError() {
        this.avatarLoad = false;
        return true
      },
      logoError() {
        this.logoLoad = false;
        return true
      },
      handleStudent(command) {
        if (command === '注销') {
          this.$cookies.remove("studentID");
          if (this.$route.path.indexOf("Home") !== -1) {
            this.$router.go(0)
          } else {
            this.$router.push('/student/Home')
          }
        }
      },
      handleEnterprise(command) {
        if (command === '注销') {
          this.$cookies.remove("enterpriseID");
          if (this.$route.path.indexOf("Home") !== -1) {
            this.$router.go(0)
          } else {
            this.$router.push('/enterprise/Home')
          }
        }
      },
      handleAdmin(command) {
        if (command === '注销') {
          this.$cookies.remove("adminID");
          if (this.$route.path.indexOf("Home") !== -1) {
            this.$router.go(0)
          } else {
            this.$router.push('/admin/Home')
          }
        }
      },
    }
  }
</script>

<style scoped>
  .navbar-entity {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }

  .nav-bar {
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #DCDFE6;
    box-shadow: 0 1px 1px rgba(100, 100, 100, .2);
  }

  .left, .right {
    height: 44px;
    width: 450px;
  }

  .center {
    flex: 1;
  }

  .logo {
    height: 30px;
    width: 30px;
    margin-top: -8px;
    vertical-align: middle;
  }

  .left div {
    display: inline-block;
  }

  #logoName {
    color: #409EFF;
    font-size: 25px;
  }

  .right div {
    margin-right: 10px;
    display: inline-block;
  }

  .right div a {
    color: #303133;
  }

  .right div a:hover {
    color: #409EFF;
  }

  .el-dropdown-link {
    cursor: pointer;
    font-size: 18px;
  }

  .el-avatar {
    margin-top: -3px;
    vertical-align: middle;
  }

  .el-avatar > .el-image {
    height: 36px;
    width: 36px;
  }

  .switch {
    font-size: 12px;
  }
</style>
