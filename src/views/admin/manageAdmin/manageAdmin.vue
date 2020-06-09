<template>
  <el-table :data="admins" class="admin-table" highlight-current-row>
    <el-table-column type="index" align="center"/>
    <el-table-column prop="realname" label="姓名" align="center"/>
    <el-table-column prop="telephone" label="联系电话" align="center"/>
    <el-table-column align="center" width="50px" v-if=" getAdmin.level === '超级管理员' ">
      <template slot-scope="scope">
        <el-popconfirm @onConfirm="deleteAdmin(scope.row.id, scope.row.realname, scope.$index)"
                       title="确定要删除该管理员吗" icon="el-icon-warning" iconColor="#F56C6C">
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" circle
                     v-if=" scope.row.level === '普通管理员' "/>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {admins, deleteAdmin} from "network/admin"
  import {mapGetters} from 'vuex'

  export default {
    name: "manageAdmin",
    data() {
      return {
        admins: [],
      }
    },
    computed: {
      ...mapGetters(['getAdmin']),
    },
    created() {
      this.showAdmins()
    },
    methods: {
      // 网络请求
      showAdmins() {
        admins().then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.admins = res;
          }
        })
      },
      deleteAdmin(id, realname, index) {
        deleteAdmin(id).then(res => {
          if (res !== 1) {
            this.$message({
              message: realname + '管理员删除失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: realname + '管理员删除成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.admins.splice(index, 1);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .admin-table {
    width: calc(100vw - 165px);
    height: calc(100vh - 60px);
    margin-left: 146px;
  }
</style>
