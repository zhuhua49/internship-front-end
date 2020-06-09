<template>
  <div>
    <div class="header">
      <div class="header-left">
        <span class="job-name">{{job.name}} </span>
        <span class="job-type">{{job.type}} </span>
        <br>
        {{job.workTime}}
        <el-divider direction="vertical"/>
        {{job.salary}}
      </div>
      <div class="header-right">
        <el-button type="primary" style="width: 120px;height: 50px;"
                   :disabled="!checking" :loading="applyForLoading" @click="applyFor">
          申请职位
        </el-button>
        <br>
        <el-button type="text" size="mini" style="color: #F56C6C"
                   :disabled="!checking" :loading="reportLoading" @click="checkReport">
          举报该职位
        </el-button>
      </div>
    </div>
    <div class="job-info">
      <div class="job-info-item">
        <span class="job-info-title">工作地点</span>
        <el-divider/>
        {{job.area}} {{job.address}}
      </div>
      <div class="job-info-item">
        <span class="job-info-title">职位描述</span>
        <el-divider/>
        {{job.introduction}}
        <br><br>
        <span class="updateTime">发布时间：{{job.updateTime | showDate}}</span>
      </div>
    </div>
    <el-card class="enterprise">
    <div slot="header" class="clear-fix">
      <el-avatar v-if="logoLoad" :src="logoURL" size="medium" :error="logoError"/>
      <span>{{job.enterprise.name}}</span>
      <el-button style="float: right; padding: 8px 0" type="text" @click="seeEnterprise">
        查看公司详情
      </el-button>
    </div>
    <div class="enterprise-info">
      <i class="el-icon-phone"/>{{job.enterprise.telephone}}<br>
      <i class="el-icon-s-custom"/>{{job.enterprise.scale}}<br>
      <i class="el-icon-s-flag"/>创立于{{job.enterprise.founded | showFounded}}<br>
      <i class="el-icon-location"/>{{job.enterprise.area}} {{job.enterprise.address}}<br>
      <span class="updateTime">更新于{{job.enterprise.updateTime | showDate}}</span>
    </div>
  </el-card>
  </div>
</template>

<script>
  import {getJob} from "network/job"
  import {checkCandidate, insertCandidate} from "network/candidate"
  import {checkAccusation, insertAccusation} from "network/accusation"

  import {formatDate} from "common/utils";
  import {mapGetters} from 'vuex'

  export default {
    name: "seeJob",
    data() {
      return {
        logoLoad: false,
        logoURL: "",
        applyForLoading: false,
        reportLoading: false,
        job: {},
        candidate: {},
        accusation: {},
      }
    },
    computed: {
      ...mapGetters(['getStudent']),
      checking() {
        return this.$cookies.isKey('studentID') && new Set(Object.values(this.getStudent)).size > 7
      }
    },
    filters: {
      showFounded: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy年MM月')
      },
      showDate: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    created() {
      this.showJob();
    },
    methods: {
      logoError() {
        this.logoLoad = false;
        return true
      },
      seeEnterprise(){
        this.$router.push('/student/seeEnterprise/' + this.job.enterprise.id)
      },
      showReport(){
        this.$prompt('请填写举报原因', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPattern: /^\S{1,255}$/,
          inputErrorMessage: '请输入合法字符(非空格)',
        }).then(({value}) => {
          this.report(value)
        }).catch(() => {
          this.reportLoading = false;
        })
      },
      // 网络请求
      showJob() {
        getJob(this.$route.params.id).then(res => {
          if (res === null) {
            this.$message({
              message: '职位获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.job = res;
            this.logoURL = "http://localhost:8081/logo/" + this.job.enterprise.id + this.job.enterprise.username + ".jpg?"+new Date();
            this.logoLoad = true;
          }
        })
      },
      applyFor() {
        this.applyForLoading = true;
        this.candidate.jobID = this.job.id;
        this.candidate.studentID = this.getStudent.id;
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
                this.applyForLoading = false;
              }else {
                this.$message({
                  message: this.job.name + '：职位申请未成功，请重试',
                  type: 'error',
                  showClose: true,
                  center: true,
                });
                this.applyForLoading = false;
              }
            })
          } else {
            this.$message({
              message: this.job.name + '：该职位已申请，请勿重复申请',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.applyForLoading = false;
          }
        })
      },
      checkReport(){
        this.reportLoading = true;
        this.accusation.jobID = this.job.id;
        this.accusation.studentID = this.getStudent.id;
        this.accusation.bossID = this.job.enterprise.id;
        this.accusation.target = 'toJob';
        checkAccusation(this.accusation).then(res => {
          if (res === 0) {
            this.showReport()
          } else {
            this.$message({
              message: '该职位已被您举报，请勿重复举报',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.reportLoading = false;
          }
        })
      },
      report(description){
        this.accusation.description = description;
        insertAccusation(this.accusation).then(res => {
          if (res !== null) {
            this.$message({
              message: '举报信息发送成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.reportLoading = false;
          }else {
            this.$message({
              message: '举报信息发送失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.reportLoading = false;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .el-divider {
    background-color: #303133;
  }

  .header {
    height: 150px;
    padding: 30px 0 0 150px;
    background-color: #ecf5ff;
  }

  .header > div {
    display: inline-block;
    height: 100%;
  }

  .header-left {
    width: 70%;

    text-align: left;
    line-height: 50px;
    font-size: 22px;
  }

  .job-name {
    font-size: 40px;
  }

  .job-type{
    font-size: 12px;
  }

  .header-right {
    width: 22%;
  }

  .job-info {
    width: calc(100% - 350px);
    float: left;
  }

  .job-info-item {
    padding: 50px 0 0 200px;

    text-align: left;
  }

  .job-info-title {
    font-size: 22px;
  }

  .job-info-item .el-divider {
    margin: 5px 0 10px;

    width: 100px;
    height: 2px;
  }

  .updateTime {
    font-size: 12px;
    color: #909399;
  }

  .enterprise {
    width: 300px;

    float: right;
    margin: 20px 20px 0 0;
  }

  .el-avatar {
    margin-top: -3px;
    margin-right: 3px;
    vertical-align: middle;
  }

  .enterprise-info {
    text-align: left;
    line-height: 2;
  }
</style>
