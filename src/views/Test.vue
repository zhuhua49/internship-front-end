<template>
  <div class="about">
    <div class="header">
      <div class="header-left">
        <span>职位名称</span><br>
        工作时间
        <el-divider direction="vertical"/>
        职位薪资
      </div>
      <div class="header-right">
        <el-button type="primary">申请职位</el-button><br>
        <el-button type="text" size="mini">举报</el-button>
      </div>
    </div>
    {{data}}
    <input type="text"  placeholder="请输入昵称" v-model="test.name">
    <button @click="insertTest">提交</button>
    {{testData}}
    <el-upload
      class="upload-demo"
      ref="upload"
      :data="{filename}"
      action="http://localhost:8081/upload">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getTest, insertTest} from "network/test"

  export default {
    name: 'Test',
    components: {
    },
    data() {
      return {
        data: {},
        dialogVisible: false,
        test: {
          name: ""
        },
        testData: {},
        filename:'bbb'
      }
    },
    created() {
      this.getTest();
    },
    methods: {
      // 网络请求
      getTest() {
        getTest().then(res => {
          this.data = res;
        })
      },
      insertTest() {
        insertTest(this.test).then(res => {
          this.testData = res;
        })
      }
    }
  }
</script>

<style scoped>
  .header {
    height: 100px;
    background-color: #ecf5ff;
  }

  .header > div {
    display: inline-block;
    height: 100%;
  }

  .header-left {
    width: 200px;
    background-color: #409EFF;
  }

  .header-right {
    width: 100px;
    background-color: #999999;
  }
</style>
