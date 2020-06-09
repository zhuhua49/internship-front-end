<template>
  <div style="position: relative;">
    <div class="edit-avatar">
      <el-avatar v-if="loaded" :key="key" :src="avatarURL" :size="150">
        <el-image :src="require('assets/img/avatar.png')" style="width: 150px;"/>
      </el-avatar>
      <br>
      <el-upload action="http://localhost:8081/upload" :multiple="false" :show-file-list="false"
                 :data="fileData" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" type="primary">上传头像</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2MB</div>
      </el-upload>
      <div class="tip">
        建议上传您的职业照或者证件照
        <br>
        头像将会和您的基本信息一同展示给企业
      </div>
    </div>
    <el-form :model="student" status-icon :rules="rules" ref="ruleForm"
             label-width="100px" class="ruleForm">
      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model="student.realname" placeholder="请输入您的真实姓名"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="student.sex">
          <el-radio-button label="男"/>
          <el-radio-button label="女"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="student.age" placeholder="请输入您的年龄"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="student.email" placeholder="请输入您的常用邮箱"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="student.telephone" placeholder="请输入您的手机号码"/>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="student.qq" placeholder="请输入您的QQ号"/>
      </el-form-item>
      <el-form-item label="所在地区" prop="area">
        <el-cascader v-model="student.area" :options="prefecture" :props="{ expandTrigger: 'hover' }"/>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politic">
        <el-radio-group v-model="student.politic">
          <el-radio-button label="党员"/>
          <el-radio-button label="共青团员"/>
          <el-radio-button label="群众"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="教育经历" prop="education">
        <el-input type="textarea" autosize v-model="student.education" maxlength="255" show-word-limit
                  placeholder="请填写您受教育的经历，包括时间和地点，可以从中专/大专/本科开始填起。也可以填写职业教育经历，比如在哪里进修等等。"/>
      </el-form-item>
      <el-form-item label="工作经历" prop="career">
        <el-input type="textarea" autosize v-model="student.career" maxlength="255" show-word-limit
                  placeholder="请填写您的工作经历，工作经历主要包括公司名称、职位名称、工作时间和工作描述。"/>
      </el-form-item>
      <el-form-item label="个人简介" prop="introduction">
        <el-input type="textarea" autosize v-model="student.introduction" maxlength="255" show-word-limit
                  placeholder="请用几句话简单介绍一下个人优势和其他方面"/>
      </el-form-item>
      <div class="updateTime" v-if="student.updateTime !== null">最近一次修改时间：{{student.updateTime | showDate}}</div>
      <el-form-item>
        <el-button type="primary" plain @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {updateStudent} from "network/student"
  import {prefecture} from "common/prefecture";
  import {formatDate} from "common/utils";
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "studentEditInfo",
    data() {
      const checkRealname = (rule, value, callback) => {
        const reg = /^[\u4e00-\u9fa5]+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入中文'));
        } else {
          callback();
        }
      };
      const checkAge = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      };
      const checkEmail = (rule, value, callback) => {
        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (value !== undefined && value !== null && value !== '' && !reg.test(value)) {
          callback(new Error('请输入正确的邮箱格式'));
        } else {
          callback();
        }
      };
      const checkTelephone = (rule, value, callback) => {
        const reg = /^(13[0-9]|14[5|7]|15[0-9]|18[0-3|5-9])\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码格式'));
        } else {
          callback();
        }
      };
      const checkQQ = (rule, value, callback) => {
        const reg = /^[1-9][0-9]{4,}$/;
        if (value !== undefined && value !== null && value !== '' && !reg.test(value)) {
          callback(new Error('请输入正确的QQ号格式'));
        } else {
          callback();
        }
      };
      return {
        loaded: false,
        key: 0,
        avatarURL: "",
        fileData: {folder: "avatar"},
        prefecture: [],
        student: {},
        rules: {
          realname: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            {validator: checkRealname, trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'},
          ],
          age: [
            {required: true, message: '请输入年龄', trigger: 'blur'},
            {validator: checkAge, trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'change'}
          ],
          telephone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: checkTelephone, trigger: 'blur'}
          ],
          qq: [
            {validator: checkQQ, trigger: 'change'}
          ],
          area: [
            {required: true, message: '请选择所在地区', trigger: 'change'},
          ],
        }
      };
    },
    computed: {
      ...mapGetters(['getStudent']),
    },
    filters: {
      showDate: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created() {
      this.prefecture = prefecture;
      this.student = JSON.parse(JSON.stringify(this.getStudent));
      this.avatarURL = "http://localhost:8081/avatar/" + this.student.id + this.student.username + ".jpg?" + new Date();
      this.fileData.filename = this.student.id + this.student.username + ".jpg";
      this.loaded = true
    },
    methods: {
      ...mapMutations(['setStudent']),
      //头像操作
      handleAvatarSuccess(res, file) {
        if (res) {
          this.$message({
            message: '上传头像图片成功',
            type: 'success',
            showClose: true,
            center: true,
          });
          this.avatarURL = "http://localhost:8081/avatar/" + this.student.id + this.student.username + ".jpg?" + new Date();
          this.key++;
          this.$bus.$emit("avatarChange");
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message({
            message: '上传头像图片只能是 JPG 格式',
            type: 'error',
            showClose: true,
            center: true,
          });
        } else if (!isLt2M) {
          this.$message({
            message: '上传头像图片大小不能超过 2MB',
            type: 'error',
            showClose: true,
            center: true,
          });
        }
        return isJPG && isLt2M;
      },
      // 网络请求
      updateStudent() {
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
    width: 500px;
    margin: 50px auto 0;
  }

  .edit-avatar {
    position: absolute;
    right: 100px;
  }

  .tip{
    margin: 10px auto;
    font-size: 12px;
    color: #606266;
  }

  .el-form-item__content {
    height: 40px;
  }

  .updateTime {
    margin-bottom: 10px;
    font-size: 12px;
  }
</style>
