
## CSS 概述

层叠样式表(Cascading Style Sheets)

- 解决内容与表现分离的问题
- 同时控制多重网页的样式和布局
- 多个样式定义可层叠为一

- CSS 解决的是 这个组件应该放在这、多大、什么颜色等等的问题


CSS引入方式
- link href="index.css" 浏览器单独请求下载
- 解释器从上到下依次执行 从而决定了几种引入方式的优先级


## 选择器

选中页面上的元素(标签), 设置对应的样式

```
选择器 {
    属性名: 属性值;
    属性名: 属性值;
}

# 语法
selector {property: value;}
# 示例
h1 {color:red; font-size:14px}
# 含义
将h1元素内的文字颜色定义为红色，同时将字体大小设置为14像素

```

基础选择器
- 标签(元素)选择器 对应页面中相同的元素，设置共同的属性 a div p 
- 类(class)选择器 
    * 任何元素都可以设置类
    * 同一个元素可以添加多个类 <div class="类1 类2 类3"></div>
    * 一定要有"归类的概念, 公共的想法" 
- id(身份证)选择器 在现代布局中，id选择器常常用于建立派生选择器 #sidebar p{...}  #sidebar h2{...}

高级选择器
- 后代选择器(或称派生选择器) 通过依据元素在其位置的上下文关系来定义样式 li strong{...}
- 子代选择器(亲儿子)  div>p {...}
- 组合选择器 h1,h2,h3 {...}
- 交集选择器
- 伪类选择器 a:link{} a:visited{} a:hover{悬浮时，可以应用于任何元素} a:active{点击瞬间}

选择器的优先级
- 内联样式的权重为1000
- id选择器的权重为100
- 类选择器的权重为10
- 元素选择器的权重为1
- 权重计算永不进位

!import 强制生效，不推荐使用


## 字体属性
- font-family 字体
- font-weight
    * bold 粗体
    * 400 默认
- font-size 字体大小 
    * 绝对单位 px
    * 相对单位 em
    * 相对单位 rem mobile端
- color 字体颜色
    * 单词表示法 red green yellow purple orange
    * rgb rgba
    * 十六进制表示法 #ffeedd
- font-style 字体样式
    * normal 默认
    * italic 斜体

## 文本属性
- text-align
    * center 使用最多
    * left
    * right
- line-height 行与行之间的距离
- text-decoration
    * none
    * underline 下划线
    * line-through 删除线
- text-indent 文本缩进 建议使用em
- letter-spacing中文字间距 / word-spacing单词间距


## 继承性
子元素从父元素继承属性
- color
- font-size
- border 不能继承 子元素 inherited from 置灰
```
body {
    font-family: "微软雅黑 仿宋"
}
```

## 背景属性

## display 显示模式
标准文档流等级森严。display属性可以将块级元素和行内元素进行互相转换

html分类
文本级标签
- h1 ~ h6
- p
- a
- span
- img

排版级标签
- br/hr
- div
- table
- form iput select
- ul/ol/dl/ li


行内元素 display: nline
- 与其他行内元素并排;
- 不能设置宽、高。默认的宽高就是文字的宽高

块级元素 display: block
- 霸占一行, 不能与其他任何元素并列;
- 能设置宽、高。如果不设置宽度，默认宽度为父元素 100%


行内块元素 display: inline-block
- 在一行内显示；
- 可以设置宽高
- input img

## 盒模型

用来设计和布局，所有的HTML元素可以看做盒子

- width: 内容的宽度
- height: 内容的高度
- padding: 内边距, 边框到内容的距离
- border: 边框, 指盒子的宽高
- margin: 外边距, 盒子边框到附近最近盒子的距离

## 清除HTML标签的默认样式

```
<style>
    body, p, ul, ol, dl, dt{
        margin: 0;
        padding: 0;
    }
    
    ul{
        list-style: none;
    }

    input{
        border: none;
        outline: none;
    }
</style>
```

https://meyerweb.com/eric/tools/css/reset/

## 浮动与清除浮动

## 定位




## 参考链接
- https://paddywang.github.io/demo/