## CSS
层叠样式表，用来控制网页样式，并允许将样式代码与网页内容分离的一种标记性语言


## 选择器

```
选择器{
    属性名: 值;
    属性名: 值;
}
```

基础选择器
- 标签(元素)选择器
- 类(class)选择器
- 身份证号(id)选择器

标签选择器统一定位相同的标签元素，而类选择器可以让不同的标签实现统一的样式，同时可以设置多个类 class="active link title"

类选择器设计时要有公共类的概念

```
.active {
    color: red;
    backgound-color: grey;

}
.title {
    font-size: 24px;
    font-weight: bold;
}
```

高级选择器


有的属性可以继承的，如

```
color: red;
font-size: 14px;
```


选择器权重 **


