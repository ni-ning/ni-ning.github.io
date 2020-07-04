## vue-cli 开发单文件组件

```js
Vue.componet('Comp', {})

new Vue({})
```
说说缺点
- 全局定义的组件名不能重复，项目大时起名麻烦
- 字符串模板操作不友好， 即使ES6提供了模板字符串
- 不支持组件CSS
- 没有构建步骤

在vue中，把.vue文件称为单文件组件，可使用webpack等构建工具

```
<template>
	<p>{{greeting}} World!</p>
</template>

<script>
	export default {
		data(){
			return {
				greeting: "Hello"
			}
		}
	}
</script>

<style>
	fond-size: 20px;
	text-align: center;
	color: red
</style>
```