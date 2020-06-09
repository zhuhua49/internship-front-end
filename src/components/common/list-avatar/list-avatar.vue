<template>
  <el-avatar v-if="loaded" :src="src" :error="errorHandler" size="small"/>
</template>

<script>
  export default {
    name: "list-avatar",
    props: {
      src: {
        type: String,
      },
    },
    data() {
      return {
        loaded: true,
      }
    },
    methods: {
      errorHandler() {
        this.loaded = false;
        return true
      },
    },
  }
</script>

<style scoped>
</style>
