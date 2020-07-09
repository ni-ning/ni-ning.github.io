<template>
  <div>
    <h1>This is user {{$route.params.id}} page.</h1>
    <h1>This is user {{id}} page.</h1>

    <div>
      <button @click="goHome()">返回首页</button>
    </div>
    
    <div class="content">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>

export default {
  created () {
    console.log(this.$route.params.id);
  },  
  props: ['id'],
  watch:{
    $route:(to)=>{
      console.log(to.params.id);
      // 发送ajax，请求后端数据
    },
    beforeRouteUpdate(to, from, next){
      console.log(to);
      console.log(from);
      console.log(next);
      // 一定要调用next，否则会阻路由
      // next();
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  },
}
</script>


<style >
  .content {
    width: 600px;
    height: 600px;
    background-color: #fafafa;
    margin: auto;
  }
</style>