import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueCookies);

Vue.prototype.$bus = new Vue();

//this.$cookies.config('0');//浏览器会话结束时过期

function getCookie(name) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/student/') || to.path.endsWith('/Login') || to.path.endsWith('/Register')) {
    next()
  } else if (to.path.startsWith('/admin/')) {
    if (getCookie('adminID') == null) {
      next({
        path: '/admin/Login'
      })
    } else {
      next()
    }
  } else {
    if (getCookie('enterpriseID') == null) {
      next({
        path: '/enterprise/Login'
      })
    } else {
      next()
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
