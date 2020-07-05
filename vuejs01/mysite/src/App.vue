<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>{{title}}</h1>
    <!-- 展示购物车列表 -->
    <ul>
        <li v-for="(item, index) in cartList" :key="item.id">
            <h3>{{item.title}}</h3>
            <p>{{item.price}}</p>
            <button @click="addCart(index)">添加到购物车</button>
        </li>
    </ul>

    <Cart :title="title"> </Cart>
  </div>
</template>

<script>

import Cart  from "./components/Cart";

export default {
  name: 'App',
  data(){
      return {
          title: "购物车",
          // cartList: [
          //     {id: 1, title: "Vue实战开发", price: 100.00, active:true, count:1},
          //     {id: 2, title: "React实战开发", price: 200.00, active:true, count:1},
          //     {id: 3, title: "Python实战开发", price: 300.00, active:true, count:1} 
          // ]
          cartList: []
      }
  },
  methods: {
    addCart(i){
      const good = this.cartList[i];
      this.$bus.$emit('addCart', good);
    }
  },
  components: {
       Cart 
  },
  // created(){
  //   this.$http.get('/api/v1/cart-list').then(resp=>{
  //     this.cartList = resp.data.result.cart_list;
  //   }).catch(err=>{
  //   })
  // }
  async created(){
    try {
      const resp = await this.$http.get('/api/v1/cart-list');
    this.cartList = resp.data.result.cart_list;
    } catch (err){
      console.log(err);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
    list-style-type: none;
    padding: 0px;
}

li {
  display: inline-block;
  margin: 0 10px;
  background-color: #fbfbfb;
  padding: 20px;
}

</style>
