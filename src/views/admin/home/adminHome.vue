<template>
  <div class="statistics">
    共有
    <span class="sum">{{enterpriseLength}}</span>
    个公司
    <br>
    发布了
    <span class="sum">{{jobLength}}</span>
    个职位
    <br>
    有
    <span class="sum">{{studentLength}}</span>
    位求职者在寻找职位
  </div>
</template>

<script>
  import {enterprises} from "network/enterprise"
  import {countJobs} from "network/job"
  import {students} from "network/student"

  export default {
    name: 'adminHome',
    data() {
      return {
        enterpriseLength: 0,
        jobLength: 0,
        studentLength: 0,
      }
    },
    created() {
      this.showEnterprises();
      this.showJobs();
      this.showStudents();
    },
    methods: {
      // 网络请求
      showEnterprises() {
        enterprises().then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.enterpriseLength = res.length;
          }
        })
      },
      showJobs() {
        countJobs().then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.jobLength = res;
          }
        })
      },
      showStudents() {
        students().then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.studentLength = res.length;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .statistics {
    width: 700px;
    height: 250px;
    margin: 130px auto;

    text-align: center;
    color: #303133;
    font-size: 30px;
    line-height: 1.7;
  }

  .sum {
    color: #409EFF;
    font-size: 60px;
  }
</style>
