<template>
  <div>
    <el-table :data="candidates" class="candidate-table" highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="right" inline class="table-expand" label-width="100px">
            <el-form-item class="introduction" label="职位描述">
              <span>{{ scope.row.job.introduction }}</span>
            </el-form-item>
            <el-form-item label="公司邮箱">
              <span>{{ scope.row.enterprise.email }}</span>
            </el-form-item>
            <el-form-item label="公司QQ">
              <span>{{ scope.row.enterprise.qq }}</span>
            </el-form-item>
            <el-form-item label="公司所在地区">
              <span>{{ scope.row.enterprise.area }}</span>
            </el-form-item>
            <el-form-item label="公司具体地址">
              <span>{{ scope.row.enterprise.address }}</span>
            </el-form-item>
            <el-form-item label="公司创立时间">
              <span>{{ scope.row.enterprise.founded | showFounded }}</span>
            </el-form-item>
            <el-form-item label="公司规模">
              <span>{{ scope.row.enterprise.scale }}</span>
            </el-form-item>
            <el-form-item class="introduction" label="公司简介">
              <span>{{ scope.row.enterprise.introduction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" align="center"/>
      <el-table-column prop="job.name" label="申请的职位名称" align="center" width="120px"/>
      <el-table-column prop="job.type" label="职位种类" align="center"/>
      <el-table-column prop="job.salary" label="职位薪资" align="center"/>
      <el-table-column prop="job.workTime" label="工作时间" align="center"/>
      <el-table-column prop="job.area" label="所在地区" align="center"/>
      <el-table-column prop="job.address" label="工作地点" align="center"/>
      <el-table-column label="所属公司" align="center">
        <template slot-scope="scope">
          <list-avatar class="avatar" :key="scope.$index + scope.row.enterprise.id + scope.row.enterprise.username"
                       :src=" 'http://localhost:8081/logo/' + scope.row.enterprise.id + scope.row.enterprise.username + '.jpg?' + new Date() "/>
          <span>{{scope.row.enterprise.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enterprise.telephone" label="联系电话" align="center"/>
      <el-table-column align="center" label="筛选" :filters="stateList" :filter-method="filterHandler">
        <template slot-scope="scope">
          <span v-if="scope.row.state==='未处理'">对方暂未处理</span>
          <span v-if="scope.row.state==='邀请面试'">
            对方邀请面试
            <el-button type="text" @click="showInterview(scope.row)">查看详情</el-button>
          </span>
          <span v-if=" scope.row.state==='已接受面试' || scope.row.state==='已拒绝面试' ">
            {{scope.row.state}}
            <el-popover placement="left" trigger="click">
              <el-form label-position="right" class="popover-form" label-width="100px">
                <el-form-item label="面试时间">
                  <span>{{ scope.row.schedule | showDate }}</span>
                </el-form-item>
                <el-form-item label="面试所在地区">
                  <span>{{ scope.row.area }}</span>
                </el-form-item>
                <el-form-item label="面试具体地址">
                  <span>{{ scope.row.address }}</span>
                </el-form-item>
                <el-form-item label="面试备注">
                  <span>{{ scope.row.note }}</span>
                </el-form-item>
                <el-form-item label="拒绝原因" v-if="scope.row.state==='已拒绝面试'">
                  <span>{{ scope.row.reason }}</span>
                </el-form-item>
              </el-form>
              <el-button slot="reference" type="text">查看详情</el-button>
            </el-popover>
          </span>
          <span v-if="scope.row.state==='已拒绝'">
            对方已拒绝
            <el-tooltip effect="light" :content="scope.row.note" placement="left">
              <el-button type="text">查看原因</el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="面试安排" :visible.sync="interviewVisible" width="300px" center>
      <el-form label-position="right" class="interview-form" label-width="100px">
        <el-form-item label="面试时间">
          <span>{{ interview.schedule | showDate }}</span>
        </el-form-item>
        <el-form-item label="面试所在地区">
          <span>{{ interview.area }}</span>
        </el-form-item>
        <el-form-item label="面试具体地址">
          <span>{{ interview.address }}</span>
        </el-form-item>
        <el-form-item label="面试备注">
          <span>{{ interview.note }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showNote">拒绝并说明原因</el-button>
        <el-button type="primary" @click="acceptInterview"
                   :loading="loading">{{ loading ? '发送中' : '接受' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import listAvatar from "components/common/list-avatar/list-avatar";

  import {byStudent, updateCandidate} from "network/candidate"
  import {formatDate} from "common/utils";
  import {mapGetters} from 'vuex'

  export default {
    name: "candidateManage",
    components: {
      listAvatar,
    },
    data() {
      return {
        interviewVisible: false,
        loading: false,
        interview: {},
        candidates: [],
        stateList:[{ text: '对方暂未处理', value: '未处理' },
          { text: '对方邀请面试', value: '邀请面试' },
          { text: '已接受面试', value: '已接受面试' },
          { text: '已拒绝面试', value: '已拒绝面试' },
          { text: '对方已拒绝', value: '已拒绝' }],
      }
    },
    computed: {
      ...mapGetters(['getStudent']),
    },
    filters: {
      showFounded: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy年MM月')
      },
      showDate: function (value) {
        let date = new Date(value);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created() {
      this.showCandidates()
    },
    methods: {
      //求职状态筛选
      filterHandler(value, row) {
        return row.state === value;
      },
      //查看面试邀请详情
      showInterview(candidate) {
        this.interview = candidate;
        this.interviewVisible = true
      },
      showNote() {
        this.$prompt('请填写拒绝原因', {
          confirmButtonText: '发送',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPattern: /^\S{1,255}$/,
          inputErrorMessage: '请输入合法字符(非空格)',
        }).then(({value}) => {
          this.refuseInterview(value)
        }).catch(() => {
        })
      },
      // 网络请求
      showCandidates() {
        byStudent(this.getStudent.id).then(res => {
          if (res === null) {
            this.$message({
              message: '信息获取失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.candidates = res;
          }
        })
      },
      acceptInterview() {
        this.loading = true;
        this.interview.state = '已接受面试';
        updateCandidate(this.interview).then(res => {
          if (res === null) {
            this.$message({
              message: '操作失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.loading = false;
          } else {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.loading = false;
            this.interview = res;
            this.interviewVisible = false
          }
        })
      },
      refuseInterview(reason) {
        this.interview.state = '已拒绝面试';
        this.interview.reason = reason;
        updateCandidate(this.interview).then(res => {
          if (res === null) {
            this.$message({
              message: '操作失败，请重试',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.interview = res;
            this.interviewVisible = false
          }
        })
      },
    }
  }
</script>

<style scoped>
  .candidate-table {
    width: calc(100vw - 165px);
    margin-left: 146px;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .table-expand .introduction {
    width: 100%;
  }

  .avatar {
    float: left;
    margin-left: -10px;
  }

  .interview-form .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
</style>
