
## 介绍

- Vue.js的核心是采用简洁的模板语法声明式地将数据渲染进DOM系统
- 数据与DOM关联，所有的东西都是响应式的，app.message = '控制台'
- 指令v-开头，表示Vue提供的特殊attribute
- v-bind:title="message", 表示将这个节点元素的title attribue和Vue实例的message属性保持一致
- v-if="flag", 不仅可以把数据绑定到DOM文本或attribute，还可以绑定到DOM结构
- v-for指令可以绑定数组的数据来渲染一个项目列表
- v-on:click="reverseMessage"与用户交互，添加一个事件监听器，通过它调用Vue实例中的方法
- 所有的DOM的操作都是Vue来处理，只需关注逻辑层即可
- input v-model="message" 实现 input的value，message， {{message}} 双向绑定
- 一个组件本质上是一个拥有预定义选项的一个Vue实例
- 子单元通过prop接口与父单元进行了良好的解耦
- 跨组件数据流、自定义事件通信以及构建工具集成

## Vue实例

- 所有的Vue组件都是Vue实例，并且接受相同的选项对象(一些根实例特有的选项)
- 数据与方法
- 实例生命周期钩子

## 模板语法

- 插值：文本 原值HTML Attribute JavaScript表达式
- 指令(Directives)是带有v-前缀的特殊attribute。指令attribute值的预期是单个JavaScript表达式
- 指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于DOM
- 指令参数，在指令名之后以冒号表示 v-bind:src, v-on:click
- 指令修饰符，半角句号.指明的特殊后缀，用于指出一个指令应该以特殊方式绑定 form v-on:submit.prevent="onSubmit"
- 指令缩写 v-on:click -> @click  v-bind:src -> :src

## 计算属性和监听器

- 简单逻辑 JavaScript表达式；复杂逻辑 计算属性
- 计算属性是基于它们的响应式依赖进行缓存的，只有message发生变化，reverseMessage才会变；return Date.now()没有依赖，计算属性不会变
- 监听属性有一些数据需要随着其他数据的变动而变动，命令式watch莫要滥用，想想是否可以用计算属性
- 计算属性默认getter，可定义setter  fullName: {getter:Function, setter:Function}
- watch选项，当需要在数据变化时执行异步或开销较大的操作时，这个方式较好
- watch允许我们执行异步操作(访问一个API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态