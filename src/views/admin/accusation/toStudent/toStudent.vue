<template>
  <el-table :data="accusations" class="candidate-table" highlight-current-row>
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form label-position="right" inline class="table-expand" label-width="100px">
          <el-form-item label="个人邮箱">
            <span>{{ scope.row.student.email }}</span>
          </el-form-item>
          <el-form-item label="个人QQ">
            <span>{{ scope.row.student.qq }}</span>
          </el-form-item>
          <el-form-item label="政治面貌">
            <span>{{ scope.row.student.politic }}</span>
          </el-form-item>
          <el-form-item class="info" label="教育经历">
            <span>{{ scope.row.student.education }}</span>
          </el-form-item>
          <el-form-item class="info" label="工作经历">
            <span>{{ scope.row.student.career }}</span>
          </el-form-item>
          <el-form-item class="info" label="个人简介">
            <span>{{ scope.row.student.introduction }}</span>
          </el-form-item>
          <el-form-item class="info" label="举报内容">
            <span>{{ scope.row.description }}</span>
          </el-form-item>
          <el-form-item class="info" style="text-align: center;">
            <el-popconfirm @onConfirm="deleteStudent(scope.row.student.id, scope.row.student.username)"
                           title="确定要删除该求职者吗" icon="el-icon-warning" iconColor="#F56C6C">
              <el-button slot="reference" type="danger" plain size="mini">删除该求职者</el-button>
            </el-popconfirm>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column type="index" align="center"/>
    <el-table-column prop="enterprise.name" label="举报公司" align="center"/>
    <el-table-column prop="enterprise.telephone" label="公司联系电话" align="center"/>
    <el-table-column label="被举报人信息" align="center">
      <el-table-column label="被举报人" align="center">
        <template slot-scope="scope">
          <list-avatar class="avatar"
                       :src=" 'http://localhost:8081/avatar/' + scope.row.student.id + scope.row.student.username + '.jpg?' + new Date() "/>
          <span>{{scope.row.student.realname}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="student.telephone" label="联系电话" align="center"/>
      <el-table-column prop="student.sex" label="性别" align="center" width="50px"/>
      <el-table-column prop="student.age" label="年龄" align="center" width="50px"/>
      <el-table-column prop="student.area" label="所在地区" align="center"/>
      <el-table-column label="信息更新时间" align="center" width="135px">
        <template slot-scope="scope">
          {{scope.row.student.updateTime | showDate}}
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

  import {toStudent, deleteAccusation} from "network/accusation";
  import {deleteStudent} from "network/student";
  import {formatDate} from "common/utils";

  export default {
    name: "toStudent",
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
        toStudent().then(res => {
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
      deleteStudent(id, username) {
        deleteStudent(id, username).then(res => {
          if (res !== 1) {
            this.$message({
              message: '求职者删除失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '求职者删除成功',
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
    width: 33%;
  }

  .table-expand .info {
    width: 100%;
  }

  .avatar {
    margin-right: 3px;
    vertical-align: middle;
  }
</style>
