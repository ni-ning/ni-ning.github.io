

## 变量

```
1. 必须使用字母、下划线(_)、$开始
2. 多个英文字母 驼峰 myName
3. 不用使用js中关键字和保留字来命名
4. 严格区分大小写

var myName = 'linda';
var $http = 'HTTP';
```

## 数据类型
```
基本数据类型
Number String Boolean undefined null

引用数据类型
Object Array Function

var num = -3.1415;
var isTrue = (typeof num === 'sting');  // true
alert(isTrue);

var x;
alert(x);	// undefined
alert(typeof x === 'undefined'); // true

// 空对象
var y = null;
alert(y);
alert(typeof y === 'object')	// true
```

## 数值型
```
var x = 10;
var y = 4;
var sum = x + y;

var sum2 = 4 + 5 + x + y;
var en = x - y;
var or = x * y;
var op = x % y * sum;
```

## 字符串
```
var str = '@#&^%$##@';
var word = 'hello';
alert(typeof word);

var one = 'hello';
var name = 'linda';
var joined = one + ' ' + name;

// 隐式转换 数值转字符串
var num = 234;
var myStr = num + '';
alert(typeof myStr);

var myNum = Number(myStr);
var myStr2 = myNum.toString();
```

## 数组Array
```
// 定义
var shopping = ['香蕉', '苹果', '牛奶', '红牛'];
var rand = ['tree', '345', [1, 2, 3]];
console.log(rand);
// 访问
var item1 = rand[0];
console.log(item1);
// 赋值
rand[0] = 'Catherine';
rand[2][2] = 100;
console.log(rand);
// 长度
console.log(rand.length);
```

## 条件分支
```
// if ... else ...
var weather = 'sunny';
if(weather === 'sunny'){
    console.log('天晴');
} else if(weather === 'rainy'){
    console.log('多雨');
}else{
    console.log('未知');
}

switch(weather){
    case 'sunny':
        console.log('天晴');
        break;		// 小心break语句 case 穿透
    case 'rainy':
        console.log('多雨');
        break;
    default:
        console.log('未知');
        break
}
```

## 比较与逻辑运算
```
var a = 5;
var aStr = '5';
// === 等同于 和 !== 不等同于  比较类型和值
console.log(a === aStr);
console.log(a !== aStr);
// == 等于 和 != 不等于 先转换为String再比较值
console.log(a == aStr);
console.log(a != aStr);

&& - and 
|| - or
! - not
```

## 三元运算符
```
var result = 2 > 1 ? '真' : '假';
console.log(result);
```
## for循环
```
/*
for(初始化条件;结束条件;递增条件){
    代码段;
}
*/
var i;
var sum = 0;
for(i=1;i<=100;i++){
    // console.log(i);
    sum = sum + i;
}
console.log(sum);
```

## for举例
```
// js 就是通过操作标签内容，从而实现交互
var shopping = ['香蕉', '苹果', '牛奶', '红牛'];
for(var i=0;i<shopping.length;i++){
    var htmlStr = '<h2>' + shopping[i] +'</h2>';
    console.log(htmlStr);
    document.write(htmlStr);
}
```

## 函数
```
// 函数：封装重复性代码 小括号 大括号
function cooking(isBad){
    console.log(isBad);
    console.log('做饭ing.');
}

var bad = true;
cooking();	// isBad undefined
// 返回值
function add(x, y){
    var s = x + y;
    return s;
}
var sum = add(100, 200);
console.log(sum);

// 函数表达式 匿名函数
var div = function(a, b){
    return a / b;
}
console.log(div);
```

## 全局污染
```
# js/first.js
var name = 'linda';
function hello(){
    alert('Hello ' + name + '!');
}

# js/second.js
var name = 'lightnning';
function hello(){
    alert('Hello ' + name + '!');
}

<script src="js/first.js"></script>
<script src="js/second.js"></script>
<script>
    hello();  // second.js 覆盖 first.js 中 name
</script>

# 解决方法 (匿名函数 挂载window)();   有意思
(function(){
    var name = 'linda';
    function hello(){
        alert('Hello ' + name + '!');
    }
    window.firstHello = hello;
})();

# script中调用
window.firstHello();
firstHello();
```

## 对象
```
// 对象(属性和方法) - 字面量创建方式
var person = {
    name: 'linda',
    age: 18,
    sex: 'femail',
    fav: function(){
        alert('running')
    }
};
console.log(person);
console.log(person.name);
person.fav();
```

## 内置对象 - 数组
```
// 内置对象 - 数组
var arr = [0, 3, 1, 15, 8];		// 字面量方式定义
var colors = new Array();		// 构造函数方式定义
colors[0] = 'red';
colors[1] = 'green';
colors[2] = 'blud';

console.log(arr);
console.log(colors);

console.log(Array.isArray(arr));	// 判断是否是数组 - true or false
console.log(Array.isArray(undefined));

var colorStr = colors.toString();	// 转换为字符串  toLocalString()根据对象是否定义toLocalString()
console.log(colorStr);

var colorStr1 = colors.join(':');	// 拼接字符串 类似 ':'.join(colors)
console.log(colorStr1);
// 栈 操作尾部
var new_len = colors.push('orange');  // 类似 colors.append('orange'), 但返回值为最新长度
console.log(new_len);
console.log(colors);

var last = colors.pop()	  // 与 colors.pop() 相同
console.log(last);
console.log(colors);
// 队列 操作头部
var new_length = colors.unshift('yellow');
console.log(new_length);
console.log(colors);

var first = colors.shift();
console.log(first);
console.log(colors);

// var arr = [0, 3, 1, 15, 8];
arr.reverse();		// 倒序
console.log(arr);
arr = arr.sort();   // 先调用toString(), 再进行排序
console.log(arr);

function compare(a, b){
    // a位于b之前
    if(a < b){
        return -1;
    }else if (a > b){
        return 1;
    }else {
        return 0;
    }
}
arr.sort(compare);
console.log(arr);
```