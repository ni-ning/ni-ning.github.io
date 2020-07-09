<template>
    <div>
        <h2>Posts 列表</h2>
        <div class="post">
            <div v-if="loading" class="loading">Loading....</div>
            <div v-if="post">
                <h4>标题： {{ post.title }}</h4>
                <p>内容： {{ post.body }}</p>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                post: null,
                error: null,
                loading: false
            }
        },
        created () {
            this.getPostData();
        },
        watch: {
            $route: "getPostData"
        },
        methods: {
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
        },
    }
</script>

<style scoped>

</style>