import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http = axios

// router.beforeEach((to,from, next)=>{
//   // console.log(from)
//   if(to.path === '/notes'){
//     const user = localStorage.getItem('user')
//     if (user){
//       // 用户已登录
//       next();
//     }else{
//       // 用于没有登录，跳转到login
//       next('/login')
//     }
//   }
//   next();
// })

router.beforeEach((to,from, next)=>{
  if(to.matched.some(record=>record.meta.requireAuth)){
    // 需要权限，黑名单中
    if(!localStorage.getItem('user')){
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }else{
      next();
    }
  }
  // 白名单中全部放行
  next();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
