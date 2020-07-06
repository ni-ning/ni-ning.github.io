<template>
    <div id="app">
        <h3>{{ title }}</h3>
        <table border="1" cellspacing="0">
            <tr>
                <th>#</th>
                <th>课程</th>
                <th>单价</th>
                <th>数量</th>
                <th>总价</th>
            </tr>
            <tr v-for="(c,index) in cart" :key="c.id">
                <td><input type="checkbox" v-model="c.active"></td>
                <td>{{ c.title }}</td>
                <td>{{ c.price }}</td>
                <td>
                    <button @click="substract(index)">-</button>
                    {{ c.count }}
                    <button @click="add(index)">+</button>
                </td>
                <td>¥{{ c.price * c.count }}</td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2">{{activeCount}}/{{count}}</td>
                <td colspan="2">¥{{ total1 }}</td>
            </tr>
        </table>

    </div>
</template>

<script>
export default {
    name: "Cart",
    data(){
        return {
            cart: JSON.parse(localStorage.getItem('cart')) || []
        }
    },
    props: ["title"],
    computed: {
        count(){
            return this.cart.length;
        },
        activeCount(){
            return this.cart.filter(v=>v.active).length
        },
        total(){
            let sum = 0;
            this.cart.forEach(c=>{
                if(c.active){
                    sum += c.price * c.count;
                }
            });
            return sum
        },
        total1(){
            return this.cart.reduce((sum, c)=>{
                if (c.active){
                    sum += c.price * c.count;
                }
                return sum
            }, 0)
            
        }
    },
    methods: {
        remove(index){
            if(window.confirm("确认是否要删除?")){
                this.cart.splice(index, 1);
            }
        },
        substract(index){
            let count = this.cart[index].count;
            count > 1 ? this.cart[index].count -= 1 : this.remove(index)
        },
        add(index){
            this.cart[index].count++;
        },
        setLocalData(n){
            localStorage.setItem('cart', JSON.stringify(n));
        }
    },
    watch: {
        cart: {
            deep: true,
            handler(n){
                this.setLocalData(n);
            }
        }
    },
    created(){
        this.$bus.$on('addCart', good=>{
            const ret = this.cart.find(v=>v.id === good.id)
            if(!ret){
                this.cart.push(good);
            }else{
                ret.count++;
            }
        });
    }

}
</script>


<style scoped>
h3, table {
    margin: auto;
}
</style>