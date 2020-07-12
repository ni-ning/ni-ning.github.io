

强大的babel
- 被称为下一代JavaScript编译器。可以让ES6代码转换为ES5代码，从而让浏览器获得支持

参考文献
- ES6阮一峰教程 https://es6.ruanyifeng.com/
- MDN教程 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

## let和const

- let 声明变量，没有变量提升，也就是需要先声明再使用
- let 声明的是一个作用域块，也就是只能在一个范围内使用
- let 不能重复声明，也就是 let aaa = 100，只能一次

const 满足以上规则，另外 
- const bbb = 100，一但声明不能需改
- 若声明一个对象，可以修改数据内容

```
const person = {
    name: 'linda'
}
person.name = 'alex';
console.log(person);
```

作用1：解决for循环的经典例子
```
let arr = [];
for(let i=0;i<10;i++){
    arr[i] = function(){
        return i;
    }
}  
console.log(arr[4]());
```
作用2：不会污染全局变量
```
let RegExp = 10;
console.log(RegExp);
console.log(window.RegExp);
```

总结：默认情况下使用 const，而只有知道变量的值需要改变时才用 let

## 模板字符串

使用反引号 ``, 插入变量时使用 ${variable}

```
<script>
    const oBox = document.querySelector('.box');
    let id = 1;
        name = '小马哥';
    let htmlStr = `
    <ul>
        <li>
            <p id=${id}>${name}</p>
        </li>
    </ul>`;

    oBox.innerHTML = htmlStr;
</script>
```

## 强大的函数

类似python
- 支持函数参数默认值 
- 支持函数参数可以为函数表达式
- *args -> ...args 剩余参数，解决arguments问题
- ...[1, 20, 88, 999] 扩展运算符，类似 *[1, 20, 88, 999]

```
function pick(obj, ...keys){
    let result = Object.create(null);
    for(i=0;i<keys.length;i++){
        result[keys[i]] = obj[keys[i]]
    }
    return result
}

const book = {
    title: 'ES6快速入门',
    author: '小马哥',
    price: 99.00
};
const data = pick(book, 'title', 'author');
console.log(data);

const arr = [1, 2, 30, 99, 888];
console.log(Math.max(...arr));
```

### ES6箭头函数

function(){} 替换为 () => {}

```
const add = (a, b) => {return a + b;} 
console.log(add(100, 200));

let fn = (()=>{
            return ()=>{
                console.log('Hello World!');
            }
})();
fn();
```

- 箭头函数，内部没有arguments
- 箭头函数，不能使用 new 关键字来实例化对象


## 解构赋值

