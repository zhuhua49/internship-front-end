<template>
  <div>
    <div class="statistics" v-if="typeof (getEnterprise.name) == 'string' && getEnterprise.name !== ''">
      发布了
      <span class="sum">{{ getEnterprise.jobs.length!==null ? getEnterprise.jobs.length : '0' }}</span>
      个职位
      <br>
      收到了
      <span class="sum">{{candidatesLength}}</span>
      份职位申请
    </div>
    <div class="statistics" v-else>
      欢迎使用斗金兼职<br>
      您可以在这里免费发布职位<br>
      公司基本信息还未完善，完善信息后即可发布职位
    </div>
  </div>
</template>

<script>
  import {byEnterprise} from "network/candidate"
  import {mapGetters} from 'vuex'

  export default {
    name: 'enterpriseHome',
    components: {},
    data() {
      return {
        candidatesLength: 0
      }
    },
    computed: {
      ...mapGetters(['getEnterprise']),
    },
    created() {
      this.showCandidates()
    },
    methods: {
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
            this.candidatesLength = res.length;
          }
        })
      },
    }
  }
</script>

<style scoped>
  .statistics {
    width: 700px;
    height: 250px;
    margin: 130px auto;

    text-align: center;
    color: #303133;
    font-size: 30px;
    line-height: 1.7;
  }

  .sum {
    color: #409EFF;
    font-size: 60px;
  }
</style>
