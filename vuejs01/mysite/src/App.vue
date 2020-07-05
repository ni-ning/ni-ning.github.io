<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>{{title}}</h1>
    <ul>
        <li v-for="item in cartList" :key="item.id">
            <h3>{{item.title}}</h3>
            <p>{{item.price}}</p>
        </li>
    </ul>

    <Cart :title="title" :cart="cartList"> </Cart>
  </div>
</template>

<script>

import Cart  from "./components/Cart";

export default {
  name: 'App',
  data(){
      return {
          title: "购物车",
          cartList: [
              {id: 1, title: "Vue实战开发", price: 100.00, active:true, count:1},
              {id: 2, title: "React实战开发", price: 200.00, active:true, count:1},
              {id: 3, title: "Python实战开发", price: 300.00, active:true, count:1} 
          ]
      }
  },
  components: {
       Cart 
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
}

</style>
