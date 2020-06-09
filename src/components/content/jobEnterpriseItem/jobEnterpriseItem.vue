<template>
  <el-card class="job-item">
    <div slot="header">
      <span class="name" style="font-size: 18px;">{{job.name}}</span>
      <el-button-group class="job-btn">
        <el-button size="mini" @click="seeJob">查看详情</el-button>
        <el-button size="mini" style="width: 90px"
                   :disabled="checking" :loading="loading" @click="applyFor">申请职位</el-button>
      </el-button-group>
    </div>
    <div class="job-info">
      {{job.salary + " | " + job.workTime}}<br>
      {{job.type + " | " + job.area}}<br>
    </div>
    <div class="boss-info">
      <el-avatar v-if="logoLoad" :src="logoURL" size="medium" :error="logoError"/>
      <span class="name" style="font-size: 18px;">{{job.enterprise.name}}</span><br>
      {{job.enterprise.telephone + " | " + job.enterprise.scale}}<br>
    </div>
  </el-card>

</template>

<script>
  import {checkCandidate, insertCandidate} from "network/candidate"

  export default {
    name: "jobEnterpriseItem",
    props: {
      checking: {
        type: Boolean,
        default: true
      },
      studentID: {
        type: Number,
        default: 0
      },
      job: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    data() {
      return {
        logoLoad: false,
        logoURL: "",
        loading: false,
        candidate: {},
      }
    },
    created() {
      this.logoURL = "http://localhost:8081/logo/" + this.job.enterprise.id + this.job.enterprise.username + ".jpg?"+new Date();
      this.logoLoad = true;
    },
    methods: {
      logoError() {
        this.logoLoad = false;
        return true
      },
      applyFor() {
        this.loading = true;
        this.candidate.jobID = this.job.id;
        this.candidate.studentID = this.studentID;
        this.candidate.bossID = this.job.enterprise.id;
        this.candidate.updateTime = new Date();
        checkCandidate(this.candidate).then(res => {
          if (res === 0) {
            insertCandidate(this.candidate).then(res => {
              if (res !== null) {
                this.$message({
                  message: this.job.name + '：职位申请成功',
                  type: 'success',
                  showClose: true,
                  center: true,
                });
                this.loading = false;
              }else {
                this.$message({
                  message: this.job.name + '：职位申请未成功，请重试',
                  type: 'error',
                  showClose: true,
                  center: true,
                });
                this.loading = false;
              }
            })
          } else {
            this.$message({
              message: this.job.name + '：该职位已申请，请勿重复申请',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.loading = false;
          }
        })
      },
      seeJob(){
        this.$router.push('/student/seeJob/' + this.job.id)
      }
    }
  }
</script>

<style scoped>
  .job-item {
    width: 800px;
    height: 140px;
    margin: 10px auto;
  }

  .name {
    color: #409EFF;
  }

  .job-btn {
    float: right;
  }

  .job-info {
    width: 350px;
    float: left;
    line-height: 150%;
  }

  .boss-info {
    width: 350px;
    float: right;
    line-height: 150%;
  }

  .el-avatar {
    margin-top: -3px;
    margin-right: 5px;
    vertical-align: middle;
  }
</style>
