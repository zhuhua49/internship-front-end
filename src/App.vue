<template>
  <div id="app">
    <NavBar/>
    <SideBar v-if="showSidebar"/>
    <router-view/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import SideBar from "components/common/sidebar/SideBar";

  export default {
    name: 'app',
    components: {
      NavBar,
      SideBar
    },
    data() {
      return {}
    },
    computed: {
      showSidebar() {
        return this.$route.path.indexOf("Login") === -1 && this.$route.path.indexOf("Register") === -1
      }
    }
  }
</script>

<style>
  @import "assets/css/base.css";

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
