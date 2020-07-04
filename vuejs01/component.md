
## 组件

组件 = html+css+js的整合
- 一个组件就是一个对象
- 建子 挂子 使用子
- 聪明组件 - 傻瓜组件


全局组件 
- Vue.component("VGlobal", {template: `html模板`})
- 直接使用，不用 components: {} 挂载


局部组件
- const VLocal = {template: `html模板`}
- 使用方，需要 components: {VLocal}


## 组件通信

父传子： 通过props通信
- 在子组件中声明props，即子组件的属性名列表，来接收父组件挂载的属性 
- 在子组件中使用props 变量名
- 在父组件中绑定 :子组件属性名='父组件的值'

子传父：事件触发

- 在子组件中 触发原生事件 在事件函数中通过 this.$emit('父视图中子组件绑定事件名', value)
- 在父组件视图中 `<Child @inputHandler="input1"></Child>`  理解监听自定义事件inputHandler
- 在父组件 methods中定义事件函数 input1(value)

平行组件通信：中央事件总线
- 创建全局事件总线，类似python中信号 const bus = new Vue()
- 接收方 组件B 在创建完成时，启动监听回调函数，即bus.$on('add', (value)=>{....})
- 发送方 组件A 自定义触发事件，发送事件函数，对应组件B监听的事件函数，即bus.$emit('add', value)

多层级嵌套通信
- 顶层组件 provide(){return {msg: "顶层数据"}}
- 接收组件 inject: ["msg"], 然后在template使用 {{msg}}
- 中间组件A 可以拿到父级组件 created(){this.$parent, this.$children}


## 插槽

如可定义按钮组件，包含插槽，不同场景传入不同值，实现不同效果

匿名插槽
- 定义组件时 `<slot></slot>`
- 调用组件时 `<MButton>slot内容</MButton>`

具名插槽
- 定义：`<slot name="login"></slot>`
- 使用：`<template name="login">登录</template>`


## 相关总结

实例键值
- el: "#app"
- data: {... }
- data(){return {... }}
- computed: {func(){}, ...}
- props: ['name']
- method: {func(){}, ...}
- created(){...}
- mixins: [myMixin, ...]

内置属性
- bus.$on('add', (value)=>{....})
- bus.$emit('add', value)
- this.$refs
- this.$set(this.user, 'age', 20)