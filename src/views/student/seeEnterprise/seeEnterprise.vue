<template>
  <div>
    <div class="header">
      <div class="header-left">
        <el-avatar v-if="logoLoad" :src="logoURL" :size="50" :error="logoError"/>
        <span class="enterprise-name">{{enterprise.name}}</span><br>
        创立于{{enterprise.founded | showFounded}}
        <el-divider direction="vertical"/>
        {{enterprise.scale}}
      </div>
      <div class="header-right">
        <div style="font-size: 50px;color: #409EFF">{{enterprise.jobs.length}}</div>
        <div>在招职位</div>
        <el-button type="text" size="mini" style="color: #F56C6C"
                   :disabled="!checking" :loading="reportLoading" @click="checkReport">
          举报该公司
        </el-button>
      </div>
    </div>
    <div class="enterprise-info">
      <div class="enterprise-info-item">
        <span class="enterprise-info-title">所在地点</span>
        <el-divider/>
        {{enterprise.area}} {{enterprise.address}}
      </div>
      <div class="enterprise-info-item">
        <span class="enterprise-info-title">公司简介</span>
        <el-divider/>
        {{ typeof (enterprise.introduction) == 'string' ? enterprise.introduction : "暂无" }}
        <br><br>
        <span class="updateTime">更新于{{enterprise.updateTime | showDate}}</span>
      </div>
      <div class="enterprise-info-item">
        <span class="enterprise-info-title">在招职位</span>
        <el-divider/>
      </div>
    </div>
    <el-card class="contact" shadow="never">
      电话：{{enterprise.telephone}}<br>
      邮箱：{{ typeof (enterprise.email) == 'string' ? enterprise.email : "暂无" }}<br>
      QQ：{{ typeof (enterprise.qq) == 'string' ? enterprise.qq : "暂无" }}
    </el-card>
    <job-item v-for="job in enterprise.jobs" :job="job" :key="job.id"
              :checking="!checking" :studentID="getStudent.id" :bossID="enterprise.id"/>
  </div>
</template>

<script>
  import jobItem from "components/content/jobItem/jobItem";

  import {enterprise} from "network/enterprise"
  import {checkAccusation, insertAccusation} from "network/accusation"
  import {formatDate} from "common/utils";
  import {mapGetters} from 'vuex'

  export default {
    name: "seeEnterprise",
    components: {
      jobItem,
    },
    data() {
      return {
        logoLoad: false,
        logoURL: "",
        reportLoading: false,
        enterprise: {},
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
      this.showEnterprise()
    },
    methods: {
      logoError() {
        this.logoLoad = false;
        return true
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
      showEnterprise() {
        enterprise(this.$route.params.id).then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.enterprise = res;
            this.logoURL = "http://localhost:8081/logo/" + this.enterprise.id + this.enterprise.username + ".jpg?"+new Date();
            this.logoLoad = true;
          }
        })
      },
      checkReport(){
        this.reportLoading = true;
        this.accusation.studentID = this.getStudent.id;
        this.accusation.bossID = this.enterprise.id;
        this.accusation.target = 'toEnterprise';
        checkAccusation(this.accusation).then(res => {
          if (res === 0) {
            this.showReport()
          } else {
            this.$message({
              message: '该公司已被您举报，请勿重复举报',
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

  .el-avatar {
    margin-top: -12px;
    vertical-align: middle;
  }

  .enterprise-name {
    font-size: 40px;
  }

  .header-right {
    width: 22%;
  }

  .enterprise-info {
    width: calc(100% - 350px);
    float: left;
  }

  .enterprise-info-item {
    padding: 50px 0 0 200px;

    text-align: left;
  }

  .enterprise-info-title {
    font-size: 22px;
  }

  .enterprise-info-item .el-divider {
    margin: 5px 0 10px;

    width: 100px;
    height: 2px;
  }

  .updateTime {
    font-size: 12px;
    color: #909399;
  }

  .contact {
    width: 300px;

    float: right;
    margin: 70px 20px 0 0;

    text-align: left;
    line-height: 2;
  }
</style>
