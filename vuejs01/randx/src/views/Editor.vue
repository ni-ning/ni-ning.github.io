<template>
    <div>
        <h2>用户编辑页面</h2>
        <textarea v-model="content" cols="40" rows="15"></textarea>
        <div>
            <button @click="saveContent">保存</button>
        </div>
        <ul>
            <li v-for="(item, index) in showList" :key="index">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                content: '',
                showList: []
            }
        },
        methods: {
            saveContent() {
                this.showList.push(this.content);
                this.content = ''
            }
        },
        beforeRouteLeave(to, from, next) {
            if(this.content){
                alert('离开之前，请保存');
                next(false);
            }else{
                next();
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>