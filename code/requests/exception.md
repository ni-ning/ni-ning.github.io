# 异常结构 exceptions.py

> 优秀的判断力来自经验，但经验来自于错误的判断。  - Fred Brooks,  著有&lt;&lt;人月神话&gt;&gt;

## 背景理论

### 什么是异常

异常就是程序运行时发生错误的信号，构成：异常的追踪信息，异常类，异常值

异常结构把功能逻辑和错误处理分开了，结构更加清晰，防止程序意外崩溃

* 语法错误：Python解释器进行语法检测，执行前必须改正
* 逻辑错误：运行期发生的错误

```python
# TypeError: int 类型不可迭代
for i in 3:
    pass

# ValueError: aaa 不是有效的10进制字符
num = int('aaa')

# IndexError: 超出索引范围
li = [1, 2, 3]
li[100]

# NameError: 变量name没有定义
name

# KeyError: 没有对应键
dic = {"name": "linda"}
dic['age']

# AttributeError: Foo没有属性x
class Foo: pass
Foo.x

# ZeroDivisionError: 0除错误
str1 = 1/0
```

### 异常的种类

* AttributeError 试图访问一个对象没有的属性，比如foo.x，但是foo没有属性x 
* IOError 输入/输出异常，基本上是无法打开文件 
* ImportError 无法引入模块或包，基本上是路径问题或名称错误 
* IndentationError 语法错误，代码没有正确对齐 
* IndexError 下标索引超出序列边界，比如当x只有三个元素，却试图访问x\[5\] 
* KeyError 试图访问字典里不存在的键 
* KeyboardInterrupt Ctrl+C被按下
* NameError 使用一个还未被赋予对象的变量 
* SyntaxError Python代码非法，代码不能编译
* TypeError 传入对象类型与要求的不符合 
* ValueError 传入一个调用者不期望的值，即使值的类型是正确的
* ....

### 异常处理

为了保证程序的健壮性与容错性，即在遇到错误时程序不会崩溃，我们需要对异常进行处理

* 如果错误发生的条件是可预知的，我们需要用if进行处理：在错误发生之前进行预防

```python
AGE = 10
while True:     
    age = input('>>: ').strip()
    if age.isdigit():  # 只有在age为字符串形式的整数时,下列代码才不会出错,该条件是可预知的
        age = int(age)
    if age == AGE:
        print('you got it')
        break
```

* 如果错误发生的条件是不可预知的，则需要用到try...except：在错误发生之后进行处理

#### 异常类只能用来处理指定的异常情况，如果非指定异常则无法处理

```python
try:
    int('hello')
except IndexError as e:  # 未捕获到异常，程序直接报错
    print(str(e))
```

#### 多分支

```python
try:
    int('hello')
except IndexError as e:
    print('from IndexError: %s' % str(e))
except KeyError as e:
    print('from KeyError: %s' % str(e))
except ValueError as e:
    print('from ValueError: %s' % str(e))
except Exception as e:
    print('from Exception: %s' % str(e))
```

#### 异常的完整结构

```python
try:
    int('hello')
except Exception as e:
    print('from Exception: %s' % str(e))
else:
    print('try内代码块没有异常，则执行else')
finally:
    print('无论异常与否，都会执行该模块，进行清理工作')
```

#### 主动触发异常

```python
try:
    raise TypeError('类型错误')
except Exception as e:
    print('from Exception: %s' % str(e))
```

#### 自定义异常

```python
class CustomException(BaseException):
    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        return '<CustomException: %s>' % self.msg

try:
    raise CustomException('权限错误')
except CustomException as e:
    print(e)
```

#### 断言

两部分合作开发，确保上游满足一定条件

```python
assert isinstance(custom, Custom)
```

### 异常处理机制

在系统内部，解释器使用一种被称作"块栈"\(block stack\)的结构来处理异常逻辑。在运行期提前将跳转存储到块栈，遇到异常时解释器会检查当前块栈内是否有匹配的处理逻辑，如果有则跳转并执行相应的指令；如果没有则沿调用栈向外传递，知道捕获或程序崩溃。

异常对象被保存到当前线程状态里，可用sys.exc\_info查看

```python
import sys

print(sys.exc_info())       # (None, None, None)
try:
    raise Exception('err')
except:
    # (<class 'Exception'>, Exception('err',), <traceback object at 0x0000027AAACFC4C8>)
    print(sys.exc_info())
# 异常一旦被捕获处理，保存在线程内的exc_type、exc_value、exc_traceback都会被清除
print(sys.exc_info())       # (None, None, None)
```

## 源码分析

实际项目开发中，会根据内置异常类自定义各种功能需求类，如class RequestExeption\(IOError\):pass

相当于打了不同的锚点，raise异常后，就可以根据不能功能锚点做相应处理

![](../../../.gitbook/assets/requests-yi-chang-jie-gou.png)

* 遇到网络问题\(如 DNS查询失败、拒绝连接等\)时，抛出ConnectionError
* HTTP请求返回不成功的状态码，r.raise\_for\_status\(\)会抛出HTTPError
* 连接超时 ConnectTimeout，读超时ReadTimeout，基础于Timeout
* 请求超出最大重定向次数，抛出TooManyRedirects
* requests显式抛出的异常都继承自 RequestException

## 项目实践

```python
import traceback
import sys

'''
1. 复杂逻辑处理时，如客户详情大量字段，每个字段都有相应的权限、参数检查等操作，
   可以继承Exception自定义不同的异常，最外层捕捉不同异常，实现分步操作
2. as e的e是异常实例，如果想追踪异常栈信息来进行相关操作 traceback
'''

class CustomBaseException(Exception):
    def __init__(self, msg):
        super(Exception, self).__init__(msg)

class CustomPermException(CustomBaseException):
    def __init__(self):
        super(CustomPermException, self).__init__('perm forbidden')

class CustomParamException(CustomBaseException):
    def __init__(self, reason):
        super(CustomParamException, self).__init__(reason)

try:
    # raise CustomParamException('Params Error!')
    # raise CustomPermException()
    # raise Exception
    raise Exception('msg')
except CustomPermException as e:
    # print_exception、format_exception的快捷形式
    traceback.print_exc()
    tb_msg = traceback.format_exc()
    print(tb_msg)
except CustomParamException as e:
    # 打印、获取异常详细信息
    traceback.print_exception(type(e), e, e.__traceback__)
    tb_msg = traceback.format_exception(type(e), e, e.__traceback__)
    print(tb_msg)
except Exception as e:
    print(type(e))                      # <class 'Exception'>
    print(isinstance(e, Exception))     # True
    print(str(e))                       # msg 字符串
    print(e.args)                       # ('msg',)，当仅仅raise 类Exception时返回值为(,) --> 实际使用时返回实例就可以带参数，推荐
    print(sys.exc_info())               # 异常类，异常类实例，异常追踪栈
    etype, value, tb = sys.exc_info()   # (<class 'Exception'>, Exception('msg',), <traceback object)
```

