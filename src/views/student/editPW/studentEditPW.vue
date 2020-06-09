<template>
  <el-form :model="studentPw" status-icon :rules="rules" ref="ruleForm"
           label-width="100px" class="ruleForm">
    <el-form-item label="旧密码" prop="oldPw">
      <el-input v-model="studentPw.oldPw" placeholder="请输入旧密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="新密码" prop="pw">
      <el-input type="password" v-model="studentPw.pw" placeholder="请输入新密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item label="确认新密码" prop="checkPw">
      <el-input type="password" v-model="studentPw.checkPw" placeholder="请再次输入新密码" autocomplete="off"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitForm('ruleForm')">修改</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateStudent} from "network/student"
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "studentEditPW",
    data() {
      const checkOld = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else if (value !== this.student.pw) {
          callback(new Error('密码错误!'));
        } else {
          callback();
        }
      };
      const validatePw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value === this.student.pw) {
          callback(new Error('新密码不能和旧密码一样'));
        } else {
          if (this.studentPw.checkPw !== '') {
            this.$refs.ruleForm.validateField('checkPw');
          }
          callback();
        }
      };
      const validatePw2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.studentPw.pw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        studentPw: {
          oldPw: '',
          pw: '',
          checkPw: '',
        },
        student: {},
        rules: {
          oldPw: [
            {validator: checkOld, trigger: 'blur'}
          ],
          pw: [
            {validator: validatePw, trigger: 'blur'}
          ],
          checkPw: [
            {validator: validatePw2, trigger: 'blur'}
          ],
        }
      };
    },
    computed: {
      ...mapGetters(['getStudent']),
    },
    created() {
      this.student = JSON.parse(JSON.stringify(this.getStudent))
    },
    methods: {
      ...mapMutations(['setStudent']),
      // 网络请求
      updateStudent() {
        this.student.pw = this.studentPw.pw;
        this.student.area = this.student.area.join("-");
        updateStudent(this.student).then(res => {
          if (res === null) {
            this.$message({
              message: '修改未成功，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '修改成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.student.updateTime = new Date();
            this.setStudent(this.student);
            this.$router.push('/student/Home')
          }
        })
      },
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateStudent();
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
