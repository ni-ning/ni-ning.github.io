<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <button @click="decrement">同步-1</button>
      count: {{count}}
      <button @click="increment">同步+1</button>
    </div>
    <div>
      username: {{username}} {{evenOrOdd}}
    </div>
  </div>
</template>

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
