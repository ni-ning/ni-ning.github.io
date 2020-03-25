
## 前端路由简介

Vue + Vue-router 主要用来做单页面应用(Single Page Application), 如 [掘金](https://juejin.im/) 


### 为什么我们要做单页面应用

1. 传统的开发方式，URL改变后，立马发送请求，响应整个页面时，有可能数据资源过多，传统的开发方式会让前端的页面出现 "白屏"，用户体验不好

2. SPA单页面应用：锚点值的改变后，不会立刻发送请求，而是在某个合适的时机，发送AJAX请求，局部改变页面中的数据，页面不立刻跳转用户体验好

### 前端路由js模拟原理

	<a href="#/login">登录页面</a>
	<a href="#/register">注册页面</a>
	
	<div id="app">
	</div>
	
	<script type="text/javascript">
		var oDiv = document.getElementById('app');
		window.onhashchange = function(){
			switch(location.hash){
				case '#/login':
					oDiv.innerHTML = '<h3>登录页面</h3>'
					break;
				case '#/register':
					oDiv.innerHTML = '<h3>注册页面</h3>'
					break;
				default:
					break;
			}
		}；
	</script>
	

## 前端路由技术点

[Vue Router](https://router.vuejs.org/zh/)

