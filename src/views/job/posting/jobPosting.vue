<template>
  <el-form :model="job" status-icon :rules="rules" ref="ruleForm"
           label-width="100px" class="ruleForm">
    <el-form-item label="职位名称" prop="name">
      <el-input v-model="job.name" placeholder="请输入职位名称"/>
    </el-form-item>
    <el-form-item label="职位种类" prop="type">
      <el-cascader v-model="job.type" :options="type" :props="{ expandTrigger: 'hover' }"/>
    </el-form-item>
    <el-form-item label="职位薪资" prop="salary">
      <el-input v-model="job.salary" placeholder="请输入职位薪资"/>
    </el-form-item>
    <el-form-item label="工作时间" prop="workTime">
      <el-input v-model="job.workTime" placeholder="请输入工作时间"/>
    </el-form-item>
    <el-form-item label="所在地区" prop="area">
      <el-cascader v-model="job.area" :options="prefecture" :props="{ expandTrigger: 'hover' }"/>
    </el-form-item>
    <el-form-item label="具体地址" prop="address">
      <el-input v-model="job.address" placeholder="请输入工作的具体地址"/>
    </el-form-item>
    <el-form-item label="职位描述" prop="introduction">
      <el-input type="textarea" autosize v-model="job.introduction" maxlength="255" show-word-limit
                placeholder="请用几句话简单描述一下这个职位"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="submitForm('ruleForm')">发布</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {insertJob} from "network/job"
  import {type} from "common/type";
  import {prefecture} from "common/prefecture";
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "jobPosting",
    data() {
      const checkName = (rule, value, callback) => {
        const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入合法字符'));
        } else {
          callback();
        }
      };
      return {
        type: [],
        prefecture: [],
        job: {},
        rules: {
          name: [
            {required: true, message: '请输入职位名称', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择职位种类', trigger: 'change'},
          ],
          salary: [
            {required: true, message: '请输入职位薪资', trigger: 'blur'},
          ],
          workTime: [
            {required: true, message: '请输入工作时间', trigger: 'blur'},
          ],
          area: [
            {required: true, message: '请选择所在地区', trigger: 'change'},
          ],
          address: [
            {required: true, message: '请输入具体地址', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入职位描述', trigger: 'blur'},
          ],
        }
      };
    },
    computed: {
      ...mapGetters(['getEnterprise']),
    },
    created() {
      this.type = type;
      this.prefecture = prefecture;
      this.job.area = this.getEnterprise.area;
      this.job.address = this.getEnterprise.address;
    },
    methods: {
      ...mapMutations(['setEnterprise']),
      // 网络请求
      insertJob() {
        this.job.bossID = this.getEnterprise.id;
        this.job.type = this.job.type.join("-");
        this.job.area = this.job.area.join("-");
        this.job.updateTime = new Date();
        insertJob(this.job).then(res => {
          if (res === null) {
            this.$message({
              message: '职位发布未成功，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '职位发布成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.getEnterprise.jobs.unshift(res);
            this.setEnterprise(this.getEnterprise);
            this.$router.push('/enterprise/Home')
          }
        })
      },
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.insertJob();
          } else {
            console.log('error submit!!');
            console.log(this.job.type + '|' + this.job.area);
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
</style>
