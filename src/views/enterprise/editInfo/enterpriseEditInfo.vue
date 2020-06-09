<template>
  <div style="position: relative;">
    <div class="edit-logo">
      <el-avatar v-if="loaded" :key="key" :src="logoURL" :size="150">
        <el-image :src="require('assets/img/bossLogo.png')" style="width: 150px;"/>
      </el-avatar>
      <br>
      <el-upload action="http://localhost:8081/upload" :multiple="false" :show-file-list="false"
                 :data="fileData" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <el-button slot="trigger" size="small" type="primary">上传公司logo</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2MB</div>
      </el-upload>
      <div class="tip">
        公司logo将会和公司信息一同展示给求职者
      </div>
    </div>
    <el-form :model="enterprise" status-icon :rules="rules" ref="ruleForm"
             label-width="100px" class="ruleForm">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="enterprise.name" placeholder="请输入公司名称"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="enterprise.email" placeholder="请输入常用邮箱"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="enterprise.telephone" placeholder="请输入联系电话"/>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="enterprise.qq" placeholder="请输入QQ号"/>
      </el-form-item>
      <el-form-item label="所在地区" prop="area">
        <el-cascader v-model="enterprise.area" :options="prefecture" :props="{ expandTrigger: 'hover' }"/>
      </el-form-item>
      <el-form-item label="具体地址" prop="address">
        <el-input v-model="enterprise.address" placeholder="请输入公司的具体地址"/>
      </el-form-item>
      <el-form-item label="创立时间" prop="founded">
        <el-date-picker type="month" v-model="enterprise.founded" placeholder="请选择创立时间" format="yyyy 年 MM 月"/>
      </el-form-item>
      <el-form-item label="公司规模" prop="scale">
        <el-select v-model="enterprise.scale" placeholder="请选择公司规模">
          <el-option value="0-20人"/>
          <el-option value="20-90人"/>
          <el-option value="100-499人"/>
          <el-option value="500-999人"/>
          <el-option value="1000-9999人"/>
          <el-option value="10000人以上"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公司简介" prop="introduction">
        <el-input type="textarea" autosize v-model="enterprise.introduction" maxlength="255" show-word-limit
                  placeholder="请用几句话简单介绍一下您的公司"/>
      </el-form-item>
      <div class="updateTime" v-if="enterprise.updateTime !== null">最近一次修改时间：{{enterprise.updateTime | showDate}}</div>
      <el-form-item>
        <el-button type="primary" plain @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {updateEnterprise} from "network/enterprise"
  import {prefecture} from "common/prefecture";
  import {formatDate} from "common/utils";
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "enterpriseEditInfo",
    data() {
      const checkName = (rule, value, callback) => {
        const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入合法字符'));
        } else {
          callback();
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
        const reg = /(^(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的电话号码格式'));
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
      const checkFounded = (rule, value, callback) => {
        const time = new Date();
        if (value > time) {
          callback(new Error('不能选择未来的时间'));
        } else {
          callback();
        }
      };
      return {
        loaded: false,
        key: 0,
        logoURL: "",
        fileData: {folder: "logo"},
        prefecture: [],
        enterprise: {},
        rules: {
          name: [
            {required: true, message: '请输入公司名称', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
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
          address: [
            {required: true, message: '请输入具体地址', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          founded: [
            {required: true, message: '请选择创立时间', trigger: 'change'},
            {validator: checkFounded, trigger: 'change'}
          ],
          scale: [
            {required: true, message: '请选择公司规模', trigger: 'change'},
          ],
        }
      };
    },
    computed: {
      ...mapGetters(['getEnterprise']),
    },
    filters: {
      showDate: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created() {
      this.prefecture = prefecture;
      this.enterprise = JSON.parse(JSON.stringify(this.getEnterprise));
      this.logoURL = "http://localhost:8081/logo/" + this.enterprise.id + this.enterprise.username + ".jpg?" + new Date();
      this.fileData.filename = this.enterprise.id + this.enterprise.username + ".jpg";
      this.loaded = true
    },
    methods: {
      ...mapMutations(['setEnterprise']),
      //头像操作
      handleAvatarSuccess(res, file) {
        if (res) {
          this.$message({
            message: '上传图片成功',
            type: 'success',
            showClose: true,
            center: true,
          });
          this.logoURL = "http://localhost:8081/logo/" + this.enterprise.id + this.enterprise.username + ".jpg?" + new Date();
          this.key++;
          this.$bus.$emit("logoChange");
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message({
            message: '上传图片只能是 JPG 格式',
            type: 'error',
            showClose: true,
            center: true,
          });
        } else if (!isLt2M) {
          this.$message({
            message: '上传图片大小不能超过 2MB',
            type: 'error',
            showClose: true,
            center: true,
          });
        }
        return isJPG && isLt2M;
      },
      // 网络请求
      updateEnterprise() {
        this.enterprise.area = this.enterprise.area.join("-");
        updateEnterprise(this.enterprise).then(res => {
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
            this.enterprise.updateTime = new Date();
            this.setEnterprise(this.enterprise);
            this.$router.push('/enterprise/Home')
          }
        })
      },
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateEnterprise();
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

  .edit-logo {
    position: absolute;
    right: 100px;
  }

  .tip{
    margin: 10px auto;
    font-size: 12px;
    color: #606266;
  }

  .updateTime {
    margin-bottom: 10px;
    font-size: 12px;
  }
</style>
