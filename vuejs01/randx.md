## vue-router

多页应用 MPA 每一个页面都是.html 适合SEO

单页应用 SPA 
- 用户群体 决定是否使用单页面应用，结合服务端渲染来优化，如 掘金官网
- 很适合后台管理系统 如 vue-element-admin

### 起步-单页面应用

Vue+VueRouter: 将组件(components)映射到路由(routes)，然后告诉VueRouter在哪里渲染它们

- 安装 `npm install vue-router -S --registry="https://registry.npm.taobao.org"`
- 或者 `vue add router`

`main.js`中
```
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import router from './router'

Vue.use(VueRouter)

new Vue({
    el: "#app",
    router,
    render: h => h(App)
})

```

`router/index.js`中
```
-- 导入框架核心与扩展
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

-- 导入业务逻辑组件
import Home from '@/views/Home'
import About from '@/views/About'

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/about",
            component: About
        }
    ]
})

export default router
```

`App.vue`中
```
<div>
    <!-- router-link相当于a标签 to属性相当于href -->
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
    
    <!-- router-view相当于路由组件的出口 -->
    <router-view></router-view>
</div>
```

### 命名路由

命名路由目的地可以变量绑定，需结合 v-bind:to

- 注意to有个冒号 :to
- 类似:class 支持变量赋值 
```
<router-link :to="{name: 'home'}">首页</router-link>
<router-link :to="{name: 'about'}">关于</router-link>
```

### 动态路由

- 定义路由时，路径可以动态变化 `path: '/user/:id', name='user'`
- <router-link> 调用时params传值  :to="{name: 'user', params: {id:2}}"
- this.$route.params可以自动获取动态参数值
- 当路由参数变化时，/user/1切换到/user/2 原来的组件实例会被复用，两个路由渲染了同一个组件，所以created钩子函数只会调用一次


### 404路由

- 放置为路由最后 `path: '*'`
- 异步导入 `component: ()=> import('@/views/404')`
- 从上到下，同名路径时，展示先定义的组件

### 路由查询参数
- 定义路由时，路径可以动态变化 `path: '/page', name='page'`
- <router-link> 调用时query传值  :to="{name: 'user', query: {id:2}}"
- this.$route.query

### 路由重定向
- 定义路由时 `path: '/home', redirect='/'` 
- 或者  `path: '/home', redirect='{name: "home"}'` 

### 路由组件传值
目前在组件中访问路由的信息，可通过 $route.params.id 或 $route.query.title，路由和组件有耦合，可通过 props传递信息
- 定义路由时 props: true 或 props: ()=>({id: $route.params.id, $route.query.title})
- 组件中 props: ['id', 'title']

### 编程式导航
与声明式导航不同，编程式导航可以事件函数触发跳转

`Vue.use(VueRouter)` 会产生 
- $route 对应 当前匹配的路由条目信息，如$route.query 
- $router 对应 VueRouter 对象

所以 跳转实现为
- `this.$router.push('/')`  push包含各种形式路由
- `this.$router.go(-1)`  -1后退，0刷新 1前进


### 嵌套路由
- 动态路由 一般跳转的组件结构是相同的
- 嵌套组件 适用于跳转组件结构不同的情况

路由条目中增加选项，并在对应父级组件中增加展示入口 `<router-view></router-view>`
```
children: [
      {
        path: 'profile',
        component : ()=>import('@/views/Profile.vue')
      },
      {
        path: 'posts',
        component : ()=>import('@/views/Posts.vue')
      }
    ]
```
- 其中 /user/1和user/1/profile 可以同时起作用


## 导航守卫

"导航" 表示路由正在发生改变，触发相应的守卫函数

全局守卫 - next()
```
router.beforeEach((to,from, next)=>{
  // console.log(from)
  if(to.path === '/notes'){
    const user = localStorage.getItem('user')
    if (user){
      // 用户已登录
      next();
    }else{
      // 用于没有登录，跳转到login
      next('/login')
    }
  }
  next();
})
```

组件内守卫 - next()
- beforeRouteUpdate(to, from, next){} 组件被复用时触发，如/user/1 到 /user/2
- beforeRouteLeave(to, from, next){} 导航离开组件之前, 如编辑页面离开之前

```
beforeRouteLeave(to, from, next) {
    if(this.content){
        alert('离开之前，请保存');
        next(false);
    }else{
        next();
    }
},
```

### meta 权限控制

定义路由时，有个meta属性，可以约定好key:value, 在全局守卫函数中就可以做相应逻辑判断

```
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
```

### 获取后端数据时机

- `导航完成之后获取`：先完成导航，然后在接下来的组件生命周期钩子中获取数据，可以在数据获取期间显示`加载中`之类的指示

- `导航完成之前获取`：导航完成前，在路由进入守卫中获取数据，在数据获取成功后执行导航

```
async getPostData() {
    try {
        this.loading = true;
        const {data} = await this.$http.get('/api/v1/post');
        this.loading = false;
        this.post = data;
    } catch (err) {
        this.error = err.toString();
    }
}
```


## Vuex

状态管理，如全局共享数据管理，如单例对象

- 父子组件通信(不推荐)
- 中央事件总线(可以推荐)
- vuex

### 基本使用

`main.js` 导入与注册
```
import store from './store'

new Vue({
  store
})
```

`store/index.js` 声明状态，同步方法，异步方法
```

```

组件中简单使用
```
this.$store.state.count
```

修改state中count值 - 触发操作
```
increment() {
    // dispatch触发actions中声明的方法
    this.$store.dispatch('increment');
  }
```
修改state中count值 - 声明操作

```
const store = new Vuex.Store({
  state: {  // 当前的状态
    count: 0
  },
  mutations: {  // 声明同步的方法
    increment(state){
      // 修改状态
      state.count++;
    }
  },
  actions: {  // 声明异步的方法 
    increment({commit}){
      // commit mutations声明的方法
      commit('increment');
    }
  },
  modules: {
  }
})
```

- 修改状态值唯一的途径，commit mutations中方法
- 异步获取更新数值时，一定要在actions中定义方法，保持页面展示的数值与this.$store.state一致

### vuex辅助函数

- mapState
- mapGetters
- mapMutations

```
<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState(['count', 'username']),
    ...mapGetters(['evenOrOdd'])
  },
  methods: {
    ...mapMutations(['increment', 'decrement'])
  },
}
</script>
```