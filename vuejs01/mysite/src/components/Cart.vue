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
            <tr v-for="c in cart" :key="c.id">
                <td><input type="checkbox" v-model="c.active"></td>
                <td>{{ c.title }}</td>
                <td>{{ c.price }}</td>
                <td>
                    <button>-</button>
                    {{ c.count }}
                    <button>+</button>
                </td>
                <td>¥{{ c.price * c.count }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "Cart",
    props: ["title", "cart"]

}
</script>


<style scoped>
h3, table {
    margin: auto;
}
</style>