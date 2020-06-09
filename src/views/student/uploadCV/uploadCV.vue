<template>
  <div class="uploadCV">
    <el-upload action="http://localhost:8081/upload" :multiple="false" :show-file-list="false" drag
               :data="fileData" :on-success="handleSuccess" :before-upload="beforeUpload">
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将简历文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        只能上传pdf文件，且不超过5MB
      </div>
    </el-upload>
    <div class="tip">
      上传的简历将会覆盖之前的简历
      <br>
      企业查看您的信息时可以获取到您的简历
    </div>
    <el-link v-if="student.cv" icon="el-icon-download" :underline="false" :href="cvURL">下载简历</el-link>
  </div>
</template>

<script>
  import {updateStudent} from "network/student"
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "uploadCV",
    data() {
      return {
        fileData: {folder: "CV"},
        student: {},
        cvURL: "",
      };
    },
    computed: {
      ...mapGetters(['getStudent']),
    },
    created() {
      this.student = JSON.parse(JSON.stringify(this.getStudent));
      this.fileData.filename = this.student.id + this.student.username + ".pdf";
      this.cvURL = "http://localhost:8081/CV/" + this.student.id + this.student.username + ".pdf?" + new Date();
    },
    methods: {
      ...mapMutations(['setStudent']),
      //上传操作
      handleSuccess(res, file) {
        if (res) {
          this.updateStudent()
        }
      },
      beforeUpload(file) {
        const isPDF = file.type === 'application/pdf';
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isPDF) {
          this.$message({
            message: '上传文件只能是 PDF 格式',
            type: 'error',
            showClose: true,
            center: true,
          });
        } else if (!isLt5M) {
          this.$message({
            message: '上传文件大小不能超过 2MB',
            type: 'error',
            showClose: true,
            center: true,
          });
        }
        return isPDF && isLt5M;
      },
      // 网络请求
      updateStudent() {
        this.student.area = this.student.area.join("-");
        this.student.cv = true;
        updateStudent(this.student).then(res => {
          if (res !== null) {
            this.$message({
              message: '上传简历成功',
              type: 'success',
              showClose: true,
              center: true,
            });
            this.cvURL = "http://localhost:8081/CV/" + this.student.id + this.student.username + ".pdf?" + new Date();
            this.setStudent(this.student);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .uploadCV {
    margin-top: 50px;
  }

  .tip{
    margin: 20px auto;
    font-size: 12px;
    color: #606266;
  }
</style>
