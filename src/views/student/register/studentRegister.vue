<template>
  <el-form :model="student" status-icon :rules="rules" ref="ruleForm"
           label-width="100px" class="ruleForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="student.username" placeholder="请输入用户名"/>
    </el-form-item>
    <el-form-item label="密码" prop="pw">
      <el-input type="password" v-model="student.pw" placeholder="请输入密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPw">
      <el-input type="password" v-model="student.checkPw" placeholder="请再次输入密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="验证码" prop="verify" style="width: 445px;">
      <el-input style="width: 225px;" v-model="student.verify" placeholder="请输入验证码（不区分大小写）"/>
      <canvas ref="changeImg" width="120" height="40" title="看不清，换一张" @click="drawPic"
              style="margin-top: -2px;vertical-align: middle;"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitForm('ruleForm')">注册</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {captchaMixin} from "common/mixin";
  import {checkStudent, insertStudent} from "network/student"
  import {mapMutations} from 'vuex'

  export default {
    name: "studentRegister",
    mixins: [captchaMixin],
    data() {
      const checkUsername = (rule, value, callback) => {
        const reg = /^[A-Za-z0-9]{3,25}$/;
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入3-25位的字母和数字'));
        }
        this.checkStudent();
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
          if (this.student.checkPw !== '') {
            this.$refs.ruleForm.validateField('checkPw');
          }
          callback();
        }
      };
      const validatePw2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.student.pw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const checkVerify = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (value.toUpperCase() !== this.captcha) {
          callback(new Error('验证码输入错误'));
        } else {
          callback();
        }
      };
      return {
        checking: 1,
        student: {
          username: '',
          pw: '',
          checkPw: '',
          verify: '',
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
          verify: [
            {validator: checkVerify, trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      ...mapMutations(['setStudent']),
      // 网络请求
      checkStudent() {
        checkStudent(this.student).then(res => {
          this.checking = res;
        })
      },
      insertStudent() {
        insertStudent(this.student).then(res => {
          this.$message({
            message: '注册成功',
            type: 'success',
            showClose: true,
            center: true,
          });
          this.$cookies.set("studentID",res.id);
          this.setStudent(res);
          this.$bus.$emit("avatarChange");
          this.$router.push('/student/Home')
        })
      },
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.insertStudent();
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
