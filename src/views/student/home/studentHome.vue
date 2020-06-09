<template>
  <div class="studentHome">
    <el-form :model="criterion" :rules="rules" :inline="true" ref="ruleForm"
             label-width="70px" class="ruleForm">
      <el-form-item label="职位名称" prop="name">
        <el-input v-model="criterion.name" placeholder="请输入职位名称关键字"/>
      </el-form-item>
      <el-form-item label="职位种类">
        <el-cascader v-model="criterion.type" :options="types" :props="{ expandTrigger: 'hover' }"/>
      </el-form-item>
      <el-form-item label="所在地区">
        <el-cascader v-model="criterion.area" :options="prefecture" :props="{ expandTrigger: 'hover' }"/>
      </el-form-item>
      <el-button type="primary" plain @click="submitForm('ruleForm')">查询</el-button>
    </el-form>
    <job-enterprise-item v-for="job in jobs" :job="job" :key="job.id"
                         :checking="!checking" :studentID="studentID"/>
    <el-button type="text" @click="addJobs">加载更多</el-button>
    <el-backtop target=".studentHome"/>
  </div>
</template>

<script>
  import jobEnterpriseItem from "components/content/jobEnterpriseItem/jobEnterpriseItem";

  import {jobs} from "network/job"
  import {type} from "common/type";
  import {prefecture} from "common/prefecture";
  import {mapGetters} from 'vuex'

  export default {
    name: 'studentHome',
    components: {
      jobEnterpriseItem,
    },
    data() {
      const checkName = (rule, value, callback) => {
        const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        if (value === '' || reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入合法字符'));
        }
      };
      return {
        types: [],
        prefecture: [],
        skipNumber: 0,
        criterion: {name: "", type: ["全部"], area: ["全国"]},
        rules: {
          name: [
            {validator: checkName, trigger: 'blur'}
          ],
        },
        jobs: [],
        studentID: 0,
      }
    },
    computed: {
      ...mapGetters(['getStudent']),
      checking() {
        return this.$cookies.isKey('studentID') && new Set(Object.values(this.getStudent)).size > 7
      },
    },
    created() {
      this.skipNumber = 0;
      this.showJobs("", "全部", "全国");
      this.studentID = this.getStudent.id;
      this.types = JSON.parse(JSON.stringify(type));
      this.types.unshift({value: '全部', label: '不限',});
      this.prefecture = JSON.parse(JSON.stringify(prefecture));
      this.prefecture.unshift({value: '全国', label: '全国',});
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.skipNumber = 0;
            this.showJobs(this.criterion.name, this.criterion.type.join("-"), this.criterion.area.join("-"));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addJobs() {
        this.showJobs(this.criterion.name, this.criterion.type.join("-"), this.criterion.area.join("-"));
      },
      // 网络请求
      showJobs(name, type, area) {
        jobs(name.split("").join("%"), type, area, this.skipNumber).then(res => {
          if (res === null) {
            this.$message({
              message: '职位获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else if (res.length === 0) {
            this.$message({
              message: '已经到底啦',
              type: 'warning',
              showClose: true,
              center: true,
            });
          } else {
            if (this.skipNumber === 0) {
              this.jobs = res;
            } else {
              this.jobs = this.jobs.concat(res)
            }
            this.skipNumber = this.skipNumber + 30;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .studentHome {
    height: calc(100vh - 60px);
    overflow-x: hidden;
  }

  .ruleForm {
    margin: 50px auto 0;
  }

  .el-input, .el-cascader {
    width: 180px;
  }
</style>
