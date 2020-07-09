import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  // 当前的状态
    count: 0,
    username: 'linda'
  },
  getters: {
    evenOrOdd(state){
      return state.count % 2 === 0 ? '偶数' : '奇数'
    }
  },
  mutations: {  // 声明同步的方法
    increment(state){
      // 修改状态
      state.count++;
    },
    decrement(state){
      state.count--;
    },
    incrementAsync(state, amount){
      state.count += amount;
    }
  },
  actions: {  // 声明异步的方法 
    increment({commit}){
      // commit mutations声明的方法
      commit('increment');
    },
    // decrement({commit}){
    //   commit('decrement');
    // }
    incrementAsync({commit}, {amount}){
      setTimeout(()=>{
        commit('incrementAsync', amount);
      }, 1000)
    }
  },
  modules: {
  }
})

export default store;