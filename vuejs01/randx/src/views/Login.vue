<template>
    <div>
        <h3>登录页面</h3>
        <div>
            <input placeholder="username" type="text" v-model="username"> <br>
            <input placeholder="password" type="password" v-model="password"> <br> <br>

            <button @click="handleLogin">登录</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            handleLogin() {
                setTimeout(()=>{
                    // 模拟登录
                    localStorage.setItem('user', JSON.stringify({data: this.username}))
                    // this.$router.push('/notes')
                    this.$router.push({path: this.$route.query.redirect})
                }, 1000)
            }
        },
    }
</script>

<style scoped>

</style>