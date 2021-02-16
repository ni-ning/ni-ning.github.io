

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
        alert('running');
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


var colors = ['red', 'blue'];
// 数组拼接 类似 extend 和 append，需注意传入参数和返回值
var newColors = colors.concat({name:'linda'}, ['black', 'purple']);
console.log(newColors);

// 切片 slice
console.log(newColors.slice(0, 3));     // 类似 newColors[0:3] 一样都是顾头不顾尾，也支持负数

// 删除 插入 替换 splice
var names = ['linda', 'alex', 'catherine', 'lightnning'];
console.log(names);
// 仅仅删除
names.splice(0, 2);   //从索引0开始，删除2个元素
console.log(names);
// 仅仅插入
names.splice(1, 0, 'blues');  // 从索引1开始，删除0个元素，且在索引1之前插入blues
console.log(names);
// 仅仅替换
names.splice(1, 1, 'blues li');   // 替换的意思
console.log(names);

var fruits = ['apple', 'banana', 'orange', 'pear', 'melon', 'pear'];
console.log(fruits.indexOf('pear'));        // 从前往后查
console.log(fruits.lastIndexOf('pear'));    // 从后往前查
console.log(fruits.indexOf('blue'));        // 查不到返回 -1 

var numbers = [1, 3, 10, 4, 6, 8, 20];
// 类似 map(function, iterable)
var newNumbers = numbers.map(function(item, index){
    return item * 100;
});
console.log(newNumbers);
// 类似 filter
var newNumbers2 = numbers.filter(function(item, index){
    return item > 5;
});
console.log(newNumbers2);
```

## 内置对象 - 字符串

```
var str = 'hello world';

console.log(str.length);        // 获取字符串长度, 类似 len(str)
console.log(str.charAt(1));     // 获取指定索引的字符串 类似str[1]
console.log(str.charCodeAt(1));
console.log(str + ' linda');    // 常用拼接 

console.log(str.indexOf('l'));      
console.log(str.lastIndexOf('l'));

console.log('   hello   '.trim().length);   // 类似 str.strip()
console.log(str.toLowerCase());
console.log(str.toUpperCase()); 

console.log('--------------');
console.log(str.slice(2));      // 切片，类似str[2:]
console.log(str.substring(2));  
console.log(str.slice(2, 4));
console.log(str.substring(2, 4));
console.log(str.substr(2, 6));  // 第二个参数表示返回的字符串

// 查找e在字符串中的所有位置
var temp = 'He unfolded the map and set it on the floor.';
var arr = [];
var pos = temp.indexOf('e');    // 1
console.log(pos);
while(pos > -1){
    // 找到当前e字符对应的位置
    arr.push(pos);
    pos = temp.indexOf('e', pos+1);
}
console.log(arr);
```

## 内置对象 - 日期
```
var now = new Date();
console.log(now);

var d1 = new Date(1995, 11, 25);
console.log(d1);

console.log(now.getDate());         // 获取月份的第几天 1~31
console.log(now.getMonth());        // 获取月份 0-11
console.log(now.getFullYear());     // 获取年份 如 2021
console.log(now.getDay());          // 6表示周六 0表示周日
console.log(now.getHours());        // 获取小时 19 (0~23)
console.log(now.getMinutes());      // 获取分钟 45 (0~59)
console.log(now.getSeconds());      // 获取秒 33 (0~59)

console.log(now.toDateString());
console.log(now.toTimeString());
// 常用
console.log(now.toLocaleDateString());
console.log(now.toLocaleTimeString());
console.log(now.toLocaleString());

console.log(now.toUTCString());
```

## 字符串和数值相互转换

```
var str = '13131.9090013';
// 转换整型
console.log(parseInt(str));     // 13131
console.log(parseFloat(str));   // 13131.9090013
console.log(typeof parseFloat(str));    // 'number'

var a = Number(str);
console.log(a);         // 13131.9090013
console.log(isNaN(a));  // false

var num = 1313.779;
// 强制类型转
console.log(num.toString());            // '1313.779'
console.log(typeof num.toString());     // 'string'
console.log(String(num));

// 隐式转换
console.log(''+num);            // Python中会抛异常
console.log(num.toFixed(1))     // 1313.8
```

## BOM

除网页外的浏览器信息操作

- alert、confirm、prompt
- setTimeout、setInterval
- location
- navigator
- history
- ......

```
# window
// 仅提醒 alert
window.alert('这是window.alert');
// 返回值布尔类型 用户交互选择 confirm
let res = window.confirm('你确定要离开?');
console.log(res);
// 返回值字符串 用户交互输入
let ret = window.prompt('早晨吃了啥?', 'defaut');
console.log(typeof ret);
console.log(ret);

# 异步任务 延时操作
window.setTimeout(function(){
    console.log('异步任务，只执行一次，类似delay');
}, 3000)

# 周期性任务  
let count = 0;
let timmer = setInterval(function(){
    console.log(count);
    if (count === 3){
        clearInterval(timmer);
    }
    console.log('周期性任务，每隔一段时间执行一次');
    count += 1;
}, 2000);
console.log('主进程执行完毕!');

注: 
1. 无论setTimeout, 还是setInterval 都没有主进程执行的快
2. 清除定时器操作

# location
location.protocol   // "http:"
location.hostname   // "127.0.0.1"
location.port       // "5500"
location.pathname   // "/javascript/code/testing.html"
location.href       // "http://127.0.0.1:5500/javascript/code/testing.html?key=value"
location.search     // "?key=value"

location.href = '跳转到新页面'
location.reload();


function getQueryString(){
    let qs = location.search.substring(1);  // ''.substring(1)
    let items = qs.length > 0 ? qs.split('&') : [];
    let o = new Object();
    items.forEach(function(item, index, array){
        data = item.split('=');  // 不同于Python可以解构赋值
        name = decodeURIComponent(data[0]);   // url处理的特殊性
        value = decodeURIComponent(data[1]);

        o[name] = value
    })
    return o;
}

let o = getQueryString();
console.log(o);
```


## DOM
Document Object Model 文档对象模型  接口 document

- 元素节点(element node)
- 文本节点(text node)
- 属性节点(attribute node)

没有内容的文档是没有价值的，而大多数内容都是有文本提供的







## ES6模块

导出关键字 export  导入关键字 import
```
无论是单个导出
export const name = 'linda';
export const age = 18;

还是 对象批量导出
const gender = 'female';
function run(){
    console.log('running...)
}
export {
    gender,
    run
}


导入时 都可以对象解封的形式
import {name, age, gender, run} from 'source.js'
```

- 每个模块只能有一个默认导出 export default foo;
- 导入模块的默认导出时 import varable from 'source.js'  变量任意起，不用{}形式
- script type="module" 作为入口测试import，且 Open With Live Server形式测试有效