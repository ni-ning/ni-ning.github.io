<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>购物车</h1>
    <ul>
        <li v-for="item in cartList" :key="item.id">
            <h3>{{item.title}}</h3>
            <p>{{item.price}}</p>
        </li>
    </ul>

  </div>
</template>

<script>

import MyCart  from "./components/Cart";

export default {
  name: 'App',
  data(){
      return {
          cartList: [
              {id: 1, title: "Vue实战开发", price: 100.00},
              {id: 2, title: "React实战开发", price: 200.00},
              {id: 3, title: "Python实战开发", price: 300.00} 
          ]
      }
  },
  components: {
        
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
