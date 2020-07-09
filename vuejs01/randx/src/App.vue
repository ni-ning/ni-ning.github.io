<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link> -->

      <router-link :to="{name: 'home'}">首页</router-link> |
      <router-link :to="{name: 'about'}">关于</router-link> |
      <router-link :to="{name: 'user', params: {id:1}}">Linda</router-link> | 
      <router-link :to="{name: 'user', params: {id:2}}">Tom</router-link> |
      <router-link :to="{name: 'page', query: {id:4, title:'标题'}}">查询页</router-link> |

      <router-link to="/user/1/profile">profile</router-link> | 
      <router-link to="/user/1/posts">posts</router-link> |

      <router-link to="/login">登录</router-link> |
      <router-link to="/notes">笔记</router-link> |
      <router-link to="/edit">编辑</router-link> |

      <router-link to="/blog">博客</router-link>

    </div>
    
    <router-view />

  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  font-size: 20px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
