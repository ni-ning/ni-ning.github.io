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
	<div>
		<p>{{greeting}} World!</p>
	</div>
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

<style scoped>
	p {
		fond-size: 20px;
		text-align: center;
		color: red;
	}
</style>

```

- 完整语法高亮
- CommonJS模块
- 组件作用域的CSS

## 安装vue-cli脚手架

- [安装nodejs](https://nodejs.org/en/download)  node -v
- 安装淘宝镜像源 `npm install -g cnpm --registry="https://registry.npm.taobao.org"` 以后cnpm代替 npm
- 安装vue-cli脚手架 cnpm install -g @vue/cli
- 检查版本 vue -V


## 快速原型开发

使用 `vue serve` 和 `vue bulid` 命令对单个 `*.vue` 文件进行快速原型开发

- 首先安装扩展 `cnpm install -g @vue/cli-service-global`
- vue serve的缺点需要安装全局依赖，这使得它在不同机器上的一致性不能得到保证，因此只适用于快速原型开发
- 仅仅需要一个 App.vue 文件
- 开始 需要初始化 npm init
- 运行 vue serve

## vue-cli生成项目

- 创建 `vue create mysite`
- 运行 `npm run serve`