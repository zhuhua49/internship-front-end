<template>
  <el-form :model="admin" status-icon :rules="rules" ref="ruleForm"
           label-width="100px" class="ruleForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="admin.username" placeholder="请输入用户名"/>
    </el-form-item>
    <el-form-item label="密码" prop="pw">
      <el-input type="password" v-model="admin.pw" placeholder="请输入密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPw">
      <el-input type="password" v-model="admin.checkPw" placeholder="请再次输入密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="真实姓名" prop="realname">
      <el-input v-model="admin.realname" placeholder="请输入管理员的真实姓名"/>
    </el-form-item>
    <el-form-item label="联系电话" prop="telephone">
      <el-input v-model="admin.telephone" placeholder="请输入管理员的手机号码"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain :loading="loading"
                 @click="submitForm('ruleForm')">
        添加
      </el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {checkAdmin, insertAdmin} from "network/admin"
  import {mapGetters} from 'vuex'

  export default {
    name: "addAdmin",
    data() {
      const checkUsername = (rule, value, callback) => {
        const reg = /^[A-Za-z0-9]{3,25}$/;
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入3-25位的字母和数字'));
        }
        this.checkAdmin();
        setTimeout(() => {
          if (this.checking === 1) {
            callback(new Error('用户名重复，请更换用户名'));
          } else {
            callback();
          }
        }, 2000);
      };
      const validatePw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.admin.checkPw !== '') {
            this.$refs.ruleForm.validateField('checkPw');
          }
          callback();
        }
      };
      const validatePw2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.admin.pw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const checkRealname = (rule, value, callback) => {
        const reg = /^[\u4e00-\u9fa5]+$/;
        if (value === '') {
          callback(new Error('请输入真实姓名'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入中文'));
        } else {
          callback();
        }
      };
      const checkTelephone = (rule, value, callback) => {
        const reg = /^(13[0-9]|14[5|7]|15[0-9]|18[0-3|5-9])\d{8}$/;
        if (value === '') {
          callback(new Error('请输入联系电话'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码格式'));
        } else {
          callback();
        }
      };
      return {
        checking: 1,
        loading: false,
        admin: {
          username: '',
          pw: '',
          checkPw: '',
          realname: '',
          telephone: '',
        },
        rules: {
          username: [
            {validator: checkUsername, trigger: 'blur'}
          ],
          pw: [
            {validator: validatePw, trigger: 'blur'}
          ],
          checkPw: [
            {validator: validatePw2, trigger: 'blur'}
          ],
          realname: [
            {validator: checkRealname, trigger: 'blur'}
          ],
          telephone: [
            {validator: checkTelephone, trigger: 'blur'}
          ],
        }
      };
    },
    computed: {
      ...mapGetters(['getAdmin']),
    },
    created() {
      if (this.getAdmin.level === '普通管理员') {
        this.$router.replace('/admin/Home')
      }
    },
    methods: {
      // 网络请求
      checkAdmin() {
        checkAdmin(this.admin).then(res => {
          this.checking = res;
        })
      },
      insertAdmin() {
        this.admin.level = '普通管理员';
        insertAdmin(this.admin).then(res => {
          this.$message({
            message: '管理员添加成功',
            type: 'success',
            showClose: true,
            center: true,
          });
          this.loading = false;
          this.resetForm('ruleForm')
        })
      },
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.insertAdmin();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  .ruleForm {
    width: 400px;
    margin: 50px auto 0;
  }
</style>
