<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
      <button @click="decrement">同步-1</button>
      count: {{count}}
      <button @click="increment">同步+1</button>
      <button @click="incrementAsync">异步+1</button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    increment() {
      // dispatch触发actions中声明的方法
      this.$store.dispatch('increment');
    },
    decrement(){
      // 无异步操作时，也可以直接commit
      this.$store.commit('decrement');
    },
    incrementAsync(){
      this.$store.dispatch('incrementAsync', {
        amount: 10
      });
    }
  },
  computed: {
    count() {
      console.log(this.$store);
      return this.$store.state.count 
    }
  },
}
</script>
