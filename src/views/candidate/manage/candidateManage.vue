<template>
  <div>
    <el-table ref="candidateTable" :data="candidates" class="candidate-table" highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="right" inline class="table-expand" label-width="70px">
            <el-form-item label="年龄">
              <span>{{ scope.row.student.age }}</span>
            </el-form-item>
            <el-form-item label="所在地区">
              <span>{{ scope.row.student.area }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ scope.row.student.email }}</span>
            </el-form-item>
            <el-form-item label="QQ">
              <span>{{ scope.row.student.qq }}</span>
            </el-form-item>
            <el-form-item label="政治面貌">
              <span>{{ scope.row.student.politic }}</span>
            </el-form-item>
            <el-form-item label="教育经历">
              <span>{{ scope.row.student.education }}</span>
            </el-form-item>
            <el-form-item label="工作经历">
              <span>{{ scope.row.student.career }}</span>
            </el-form-item>
            <el-form-item label="个人简介">
              <span>{{ scope.row.student.introduction }}</span>
            </el-form-item>
            <el-button type="text" class="tip-off"
                       :loading="reportLoading" @click="checkReport(scope.row.student.id)">
              举报
            </el-button>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" align="center"/>
      <el-table-column prop="job.name" label="申请的职位名称" align="center" sortable/>
      <el-table-column label="求职者" align="center">
        <template slot-scope="scope">
          <list-avatar class="avatar" :key="scope.$index + scope.row.student.id + scope.row.student.username"
                       :src=" 'http://localhost:8081/avatar/' + scope.row.student.id + scope.row.student.username + '.jpg?' + new Date() "/>
          <span>{{scope.row.student.realname}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="student.sex" label="性别" align="center"/>
      <el-table-column prop="student.telephone" label="联系电话" align="center"/>
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-link v-if="scope.row.student.cv" icon="el-icon-download" :underline="false"
                   :href=" 'http://localhost:8081/CV/' + scope.row.student.id + scope.row.student.username + '.pdf?' + new Date() ">
            下载简历
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px"
                       label="筛选" :filters="stateList" :filter-method="filterHandler">
        <template slot-scope="scope">
          <el-button-group v-if="scope.row.state==='未处理'">
            <el-button type="success" plain size="mini" icon="el-icon-check"
                       @click="showDrawer(scope.row)">邀请面试
            </el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-close"
                       @click="showNote(scope.row)">拒绝
            </el-button>
          </el-button-group>
          <span v-if=" scope.row.state==='邀请面试' || scope.row.state==='已接受面试' || scope.row.state==='已拒绝面试' ">
            {{scope.row.state==='邀请面试' ? "已邀请面试" : "对方"+scope.row.state}}
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
              <div v-if="scope.row.state==='已拒绝面试'" style="margin: 0 auto">
                <el-button @click="showDrawer(scope.row)">重新邀请面试</el-button>
                <el-button @click="showNote(scope.row)">拒绝对方</el-button>
              </div>
              <el-button slot="reference" type="text">查看详情</el-button>
            </el-popover>
          </span>
          <span v-if="scope.row.state==='已拒绝'">
            已拒绝
            <el-tooltip effect="light" :content="scope.row.note" placement="left">
              <el-button type="text">查看原因</el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer title="面试安排" :visible.sync="drawer" direction="ltr" :wrapperClosable="false">
      <div class="interviewDrawer__content">
        <el-form :model="candidate" status-icon :rules="rules" ref="ruleForm"
                 label-width="110px" class="ruleForm">
          <el-form-item label="面试时间" prop="schedule">
            <el-date-picker type="datetime" v-model="candidate.schedule"
                            placeholder="请选择面试时间" format="yyyy-MM-dd HH:mm"/>
          </el-form-item>
          <el-form-item label="面试所在地区" prop="area">
            <el-cascader v-model="candidate.area" :options="prefecture" :props="{ expandTrigger: 'hover' }"/>
          </el-form-item>
          <el-form-item label="面试具体地址" prop="address">
            <el-input v-model="candidate.address" placeholder="请输入面试的具体地址"/>
          </el-form-item>
          <el-form-item label="面试备注" prop="note">
            <el-input type="textarea" autosize v-model="candidate.note"/>
          </el-form-item>
        </el-form>
        <div class="interviewDrawer__footer">
          <el-button @click="drawer=false">取消</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="submitForm('ruleForm')" :loading="loading"
                     type="primary" plain>{{ loading ? '发送中' : '发送' }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import listAvatar from "components/common/list-avatar/list-avatar";

  import {byEnterprise, updateCandidate} from "network/candidate"
  import {checkAccusation, insertAccusation} from "network/accusation"
  import {prefecture} from "common/prefecture";
  import {formatDate} from "common/utils";
  import {mapGetters} from 'vuex'

  export default {
    name: "candidateManage",
    components: {
      listAvatar,
    },
    data() {
      const checkSchedule = (rule, value, callback) => {
        const time = new Date();
        if (value < time) {
          callback(new Error('不能选择过去的时间'));
        } else {
          callback();
        }
      };
      const checkName = (rule, value, callback) => {
        const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入合法字符'));
        } else {
          callback();
        }
      };
      return {
        drawer: false,
        loading: false,
        reportLoading: false,
        prefecture: [],
        candidates: [],
        candidate: {},
        accusation: {},
        stateList:[{ text: '未处理', value: '未处理' },
          { text: '已邀请面试', value: '邀请面试' },
          { text: '对方已接受面试', value: '已接受面试' },
          { text: '对方已拒绝面试', value: '已拒绝面试' },
          { text: '已拒绝', value: '已拒绝' }],
        rules: {
          schedule: [
            {required: true, message: '请选择面试时间', trigger: 'change'},
            {validator: checkSchedule, trigger: 'change'}
          ],
          area: [
            {required: true, message: '请选择面试所在地区', trigger: 'change'},
          ],
          address: [
            {required: true, message: '请输入面试具体地址', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
        }
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
      this.showCandidates();
      this.prefecture = prefecture;
    },
    methods: {
      //求职状态筛选
      filterHandler(value, row) {
        return row.state === value;
      },
      //打开面试安排表单抽屉
      showDrawer(candidate) {
        this.drawer = true;
        this.candidate = candidate;
        this.candidate.area = this.getEnterprise.area;
        this.candidate.address = this.getEnterprise.address;
      },
      showNote(candidate) {
        if (candidate.state === '未处理') {
          this.candidate = candidate;
        }
        this.$prompt('请填写拒绝原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPattern: /^\S{1,255}$/,
          inputErrorMessage: '请输入合法字符(非空格)',
        }).then(({value}) => {
          this.refuseCandidate(value)
        }).catch(() => {
        })
      },
      showReport() {
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
      showCandidates() {
        byEnterprise(this.getEnterprise.id).then(res => {
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
      inviteInterview() {
        this.loading = true;
        this.candidate.area = this.candidate.area.join("-");
        this.candidate.state = '邀请面试';
        updateCandidate(this.candidate).then(res => {
          if (res === null) {
            this.$message({
              message: '面试邀请发送失败',
              type: 'error',
              showClose: true,
              center: true,
            });
          } else {
            this.$message({
              message: '面试邀请发送成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.loading = false;
            this.drawer = false;
          }
        })
      },
      refuseCandidate(note) {
        this.candidate.state = '已拒绝';
        this.candidate.note = note;
        updateCandidate(this.candidate).then(res => {
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
            this.candidate = res;
          }
        })
      },
      checkReport(studentID) {
        this.reportLoading = true;
        this.accusation.studentID = studentID;
        this.accusation.bossID = this.getEnterprise.id;
        this.accusation.target = 'toStudent';
        checkAccusation(this.accusation).then(res => {
          if (res === 0) {
            this.showReport()
          } else {
            this.$message({
              message: '该求职者已被您举报，请勿重复举报',
              type: 'error',
              showClose: true,
              center: true,
            });
            this.reportLoading = false;
          }
        })
      },
      report(description) {
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
          } else {
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
      //表单操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.inviteInterview();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
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

  .tip-off {
    position: absolute;
    top: 10px;
    right: 30px;

    color: #F56C6C;
  }

  .avatar {
    margin-right: 3px;
    vertical-align: middle;
  }

  .interviewDrawer__content {
    padding: 20px;
  }

  .interviewDrawer__footer {
    margin: 0 auto;
  }

  .popover-form .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
</style>
