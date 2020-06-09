<template>
  <el-table :data="getEnterprise.jobs" class="job-table" highlight-current-row>
    <el-table-column type="expand">
      <template slot-scope="scope">
        职位描述：{{scope.row.introduction}}
      </template>
    </el-table-column>
    <el-table-column type="index" align="center"/>
    <el-table-column prop="name" label="职位名称" align="center"/>
    <el-table-column prop="type" label="职位种类" align="center"/>
    <el-table-column prop="salary" label="职位薪资" align="center"/>
    <el-table-column prop="workTime" label="工作时间" align="center"/>
    <el-table-column prop="area" label="所在地区" align="center"/>
    <el-table-column prop="address" label="具体地址" align="center"/>
    <el-table-column prop="updateTime" label="发布时间" align="center" width="135px">
      <template slot-scope="scope">
        {{scope.row.updateTime | showDate}}
      </template>
    </el-table-column>
    <el-table-column align="center">
      <template slot-scope="scope">
        <el-popconfirm @onConfirm="deleteJob(scope.row.id, scope.row.name, scope.$index)"
                       title="删除该职位的同时也会删除该职位申请者的信息" icon="el-icon-warning" iconColor="#F56C6C">
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle/>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {deleteJob} from "network/job"
  import {formatDate} from "common/utils";
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "jobManage",
    data() {
      return {
        jobs: [],
      }
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
      // this.jobs = this.getEnterprise.jobs
    },
    methods: {
      ...mapMutations(['setEnterprise']),
      // 网络请求
      deleteJob(id, name, index) {
        deleteJob(id).then(res => {
          if (res !== 1) {
            this.$message({
              message: name + '职位删除失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: name + '职位删除成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.getEnterprise.jobs.splice(index, 1);
            this.setEnterprise(this.getEnterprise);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .job-table {
    width: calc(100vw - 165px);
    margin-left: 146px;
  }
</style>
