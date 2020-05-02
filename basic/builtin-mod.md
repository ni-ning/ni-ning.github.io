# argparse

argparse 是 Python 内置的一个用于命令项选项与参数解析的模块，通过在程序中定义好我们需要的参数，argparse将会从 sys.argv 中解析出这些参数，并自动生成帮助和使用信息。类似第三方强大库[click](http://funhacks.net/2016/12/20/click/)

```python
# bar.py
import argparse

# 创建对象 parser
parser = argparse.ArgumentParser()

# 必填项 定位参数 传给 integer int型
parser.add_argument('integer', type=int, help='display an integer')
# 可选项 传给 name
parser.add_argument('--name', type=str, help='display a name')

# 解析参数挂到对象 args
args = parser.parse_args()

print('integer: %s, and type: %s' % (args.integer, type(args.integer)))
if args.name:
    print('name: %s, and type: %s' % (args.name, type(args.name)))
```

```bash
python bar.py 100 --name 'linda'

>>> integer: 100, and type: <class 'int'>
>>> name: 'linda', and type: <class 'str'>
```


# enum

常量配置

```python
from enum import Enum

class CustomType(Enum):
    SOURCE = '网站到访'
    ALLOCATION = '一部'
    PROVINCE = '北京'
    CITY = '北京'

print(CustomType.SOURCE.name)    # 'SOURCE'
print(CustomType.SOURCE.value)   # '网站到访'
```


# importlib

通过字符串名导入模块。你想导入一个模块，但是模块的名字在字符串里

```python
import importlib
math = importlib.import_module('math')
math.sin(2)

mod = importlib.import_module('requests')
mod.get('www.baidu.com')

# Same as 'from . import b'
b = importlib.import_module('.b', __package)
```

* import\_module只是简单地执行和import相同的步骤，但是返回生成的模块对象。你只需要将其存储在一个变量，然后像正常的模块一样使用
* 在旧的代码，有时你会看到用于导入的内建函数 \_\_import\_\_\(\) 尽管它能工作，但是importlib.import\_module\(\) 通常更容易使用
* [参考cookbook相关章节](https://python3-cookbook.readthedocs.io/zh_CN/latest/c10/p10_import_modules_using_name_given_in_string.html)


# os

os.path 操纵文件路径，os 操纵文件，os.environ 环境变量

```python
os.getcwd()    # 类似Linux pwd, '/home/ubuntu/code/backend/projects/gbm'

print(__file__)      # 当前执行脚本的路径，包含文件名bar.py
python path/bar.py   # 'path/bar.py'

# 文件路径名称相关操作，一般都是os.path开头
os.path.abspath(__file__)   # 绝对路径
os.path.basename(__file__)  # 文件名
os.path.dirname(__file__)   # 目录名
os.path.isabs(__file__)     # 是否绝对路径名

os.path.isfile('app.py')    # 判断是否是文件
os.path.isdir('custom')     # 判断是否是文件夹
os.path.exists('custom/hooks.py')    # 文件是否存在，可认为是isfile or isdir

os.path.split('custom/hooks.py')     # ('custom', 'hooks.py')
os.path.join('custom', 'hooks.py')   # 'custom/hooks.py'


# 操纵文件或目录， 一般以os开头
os.path.getsize('bar.py')
os.stat('bar.py')  # 文件属性  
os.listdir()       # 展示当前目录的文件和目录列表 [....]

os.remove('lazy_dog.txt')    # 删除文件
os.mkdir('dir1')             # 创建目录
os.makedirs('dir2/dir22')    # 创建记录目录
os.rename/replace            # 重命名 
shutil.copyfile('file1', 'file2')  # 拷贝文件
shutil.rmtree('dir2')        # 递归删除文件夹

os.environ            # 环境变量
os.environ['HOME']    # '/home/ubuntu'

# 遍历目录文件
for root, dirs, files in os.walk('custom'):
    root    # 所指的是当前正在遍历的这个文件夹的本身的地址
    dirs    # list, 该文件夹中所有的目录的名字(不包括子目录)
    files   # list, 该文件夹中所有的文件(不包括子目录)
    
os.path.expanduser(path)    # 把path中包含的"~"和"~user"转换成用户目录
```

# re

在 Python 中，使用内置的 re 模块来使用正则表达式

> 注意点：\ 对特殊字符进行转义，比如'python.org' --&gt; 'python\.org'，而 Python 的字符串本身也用  \ 转义，所以应写成 'python\\.org'，很容易陷入困扰，直接r'python\.org' 较好

re 模块的一般使用步骤：

* 使用 compile 函数将正则表达式的字符串形式编译为一个Pattern对象
* 通过Pattern对象提供的一系列方法对文本进行匹配查找，获得匹配结果\(一个 Match 对象\)
* 最后使用 Match 对象提供的属性和方法获得信息，根据需要进行其他操作

参考链接

1.  [re 模块](https://wiki.jikexueyuan.com/project/explore-python/Regular-Expressions/re.html)

# shelve

```python
'''
json和pickle模块的序列化和反序列化处理，有一个不足是在python3中不能多次dump和load, shelve模块则可以规避这个问题
shelve模块是一个简单的k,v将内存数据通过文件持久化的模块，可以持久化任何pickle可支持的python数据格式, 是pickle更上一层的封装
'''

import shelve
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
SH_DIR = os.path.join(DATA_DIR, 'sh.pkl')

if not os.path.exists(DATA_DIR):
    os.mkdir(DATA_DIR)

# 文件持久化, sh类似字典操作数据的方式
sh = shelve.open('data/sh.pkl')
sh['list'] = [1, 2, 3]

# writeback=False, need to code carefully
temp = sh['list']
temp.append(4)
sh['list'] = temp

print(sh['list'])

print(list(sh.keys()))
del sh['key']   # delete data stored at key (raises KeyError # if no such key)
print(list(sh.keys()))

sh.close()
```

# collections

## tuple
python 内置类型
- 不可变，iterable (实现魔法函数 __iter __ 或 __getitem __)
- 拆包
- tuple的不可变不是绝对的 （'lidna', [1, 2]）
- tuple比list好的地方 immutable的重要性
	
	- 性能优化：元素全部为immutable的tuple会作为常量在编译时确定，可加快速度
	- 线程安全：因都不能修改
	- 可以作为dick的key
	- 拆包特性
	- 可以和C原因类比 tuple对应struct, list对应array


```python
# tuple
name_tuple = ('linda1', 'linda2')
# 动态语言支持，静态语言就不支持，变量的本质
name_tuple = ('linda3', 'linda4')

# 不可变说的是，元素值不能修改
# name_tuple[0] = 'linda'

# 拆包
name, age, height = ('linda', 18, '175com')
```

## nametuple

- 继承tuple
- 相比于自定义类，省空间
- 最佳场景 name_tuple=pymysql取一列

```python
# nametuple
from collections import namedtuple

# 生成一个类，不是通常的对象
User = namedtuple('User', ['name', 'age', 'height'])
user = User(name='linda', age=18, height=175)
print(user.name, user.age, user.height)
print(dict(user._asdict()))
```


## defaultdict
传入参数为可调用对象
```python
# defaultdict
from collections import defaultdict

# 常规统计出现次数操作
user_dict = {}
users = ['linda1', 'linda2', 'linda1', 'linda1']
for user in users:
    # if user not in user_dict:
    #     user_dict[user] = 1
    # else:
    #     user_dict[user] += 1
    # 或者 少做一次查询
    user_dict.setdefault(user, 0)
    user_dict[user] += 1

print(user_dict)

# 传入一个可调用 int->0 list->[] dict->{} 不存在时默认值
default_dict = defaultdict(int)
for user in users:
    default_dict[user] += 1
print(default_dict)
```

## deque
双向列表
- deque 线程安全 GIL
- list 不是线程安全

```python
# deque
from collections import deque

dd = deque(['linda1', 'linda2'])
user = dd.popleft()
print(user, dd)     # linda1 deque(['linda2'])
```

## Counter

继承 dict

```python
# Counter
from collections import Counter
users = ['linda1', 'linda2', 'linda1', 'linda1']
user_count = Counter(users)     # 直接初始化就行
user_count.update(['linda2', 'linda'])  # 两个合并统计
print(user_count)
print(user_count.most_common(2))    # 取前两个
```

## OrderedDict

- 继承 dict，具备dict特点
- 顺序添加，相应输出

```python
# OrderedDict
from collections import OrderedDict

ordered_dict = OrderedDict()
ordered_dict['c'] = 'ccc'
ordered_dict['b'] = 'bbb'
ordered_dict['a'] = 'aaa'

print(ordered_dict)
```

## ChainMap
- chain map

```python
# ChainMap
from collections import ChainMap

user_dict1 = {'a': 'linda1'}
user_dict2 = {'b': 'linda2'}

for key, value in ChainMap(user_dict1, user_dict2).items():
    print(key, value)
```