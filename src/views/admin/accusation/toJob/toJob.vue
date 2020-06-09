<template>
  <el-table :data="accusations" class="candidate-table" highlight-current-row>
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="right" inline class="table-expand" label-width="100px">
          <el-form-item label="工作所在地区">
            <span>{{ scope.row.job.area }}</span>
          </el-form-item>
          <el-form-item label="工作具体地址">
            <span>{{ scope.row.job.address }}</span>
          </el-form-item>
          <el-form-item class="info" label="职位描述">
            <span>{{ scope.row.job.introduction }}</span>
          </el-form-item>
          <el-form-item class="info" label="举报内容">
            <span>{{ scope.row.description }}</span>
          </el-form-item>
          <el-form-item class="info" style="text-align: center;">
            <el-popconfirm @onConfirm="deleteJob(scope.row.job.id)"
                           title="确定要删除该职位吗" icon="el-icon-warning" iconColor="#F56C6C">
              <el-button slot="reference" type="danger" plain size="mini">删除该职位</el-button>
            </el-popconfirm>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column type="index" align="center"/>
    <el-table-column prop="student.realname" label="举报人" align="center"/>
    <el-table-column prop="student.telephone" label="举报人联系电话" align="center" width="120px"/>
    <el-table-column label="被举报职位信息" align="center">
      <el-table-column prop="job.name" label="职位名称" align="center"/>
      <el-table-column prop="job.type" label="职位种类" align="center"/>
      <el-table-column prop="job.salary" label="职位薪资" align="center"/>
      <el-table-column prop="job.workTime" label="工作时间" align="center"/>
      <el-table-column label="所属公司" align="center">
        <template slot-scope="scope">
          <list-avatar class="avatar"
                       :src=" 'http://localhost:8081/logo/' + scope.row.enterprise.id + scope.row.enterprise.username + '.jpg?' + new Date() "/>
          <span>{{scope.row.enterprise.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enterprise.telephone" label="公司联系电话" align="center" width="110px"/>
      <el-table-column label="职位发布时间" align="center" width="135px">
        <template slot-scope="scope">
          {{scope.row.job.updateTime | showDate}}
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column align="center" width="50px">
      <template slot-scope="scope">
        <el-popconfirm @onConfirm="deleteAccusation(scope.row.id, scope.$index)"
                       title="确定要删除这条举报信息吗" icon="el-icon-warning" iconColor="#F56C6C">
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle/>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import listAvatar from "components/common/list-avatar/list-avatar";

  import {toJob, deleteAccusation} from "network/accusation";
  import {deleteJob} from "network/job";
  import {formatDate} from "common/utils";

  export default {
    name: "toJob",
    components: {
      listAvatar,
    },
    data() {
      return {
        accusations: [],
      }
    },
    filters: {
      showDate: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created() {
      this.showAccusations()
    },
    methods: {
      // 网络请求
      showAccusations() {
        toJob().then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.accusations = res;
          }
        })
      },
      deleteAccusation(id, index) {
        deleteAccusation(id).then(res => {
          if (res !== 1) {
            this.$message({
              message: '举报信息删除失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '举报信息删除成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.accusations.splice(index, 1);
          }
        })
      },
      deleteJob(id) {
        deleteJob(id).then(res => {
          if (res !== 1) {
            this.$message({
              message: '职位删除失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '职位删除成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.showAccusations()
          }
        })
      },
    },
  }
</script>

<style scoped>
  .candidate-table {
    width: calc(100vw - 165px);
    height: calc(100vh - 60px);
    margin-left: 146px;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .table-expand .info {
    width: 100%;
  }

  .avatar {
    float: left;
    margin-left: -10px;
  }
</style>
