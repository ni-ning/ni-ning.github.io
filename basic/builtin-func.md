# open

在磁盘上读写文件的功能都是由操作系统提供的，现代操作系统不允许普通的程序操作磁盘。

所以读写文件就是请求操作系统打开一个文件对象\(通常称为文件描述符\)，然后通过操作系统提供的这个接口从这个文件对象中读取数据\(读文件\)，或者把数据写入这个文件对象\(写文件\)

## open基本使用

参考：[廖雪峰Python文件读写](https://www.liaoxuefeng.com/wiki/1016959663602400/1017607179232640)

## open输入参数

**mode：**指定文件代开方，如mode='r'

* * r：只读，文件不存在会抛出异常
  * w：写入，文件不存在，会自动创建
  * a：附加，文件不存在，会自动创建
* 在模式后使用“+”表示同时支持输入、输出操作
* * r+：读写模式，默认以读模式打开，不会自动创建文件，文件不存在抛出异常
  * w+：写读模式，默认以写模式打开，会自动创建文件
  * a+：附加模式
* 在模式后附加“b”表示以二进制方式打开文件，如：rb、wb、ab、rb+、wb+、ab+
* * 二进制文件，如图片，视频等有自己的编码顺序，和文本编码不同，文本就可以展示
  * 二进制模式，就没encoding一说了

**encoding：**文本内容写时用何种编码，读取时就用该编码，如encoding='utf-8'

**errors：**遇到错误编码的处理方式，最简单的是截止忽略，如errors='ignore'

## open对象属性与方法

```python
# -*- coding: utf-8 -*-
with open('password', mode='r', encoding='utf-8') as f:
    f.read()        # 读取文件所有内容，光标移动到文件末尾
    f.readline()    # 读取一行内容，光标移动到第二行首部
    f.readlines()   # 读取每一行内容，存放于列表中
    
    f.write('1111\n222\n')                 # 针对文本模式的写,需要自己写换行符 
    f.write('1111\n222\n'.encode('utf-8')) # 针对b模式的写,需要自己写换行符 
    f.writelines(['333\n','444\n'])        # 文本模式 
    f.writelines([bytes('333\n',encoding='utf-8'),'444\n'.encode('utf-8')]) # b模式
    
    f.readable() # 文件是否可读
    f.writable() # 文件是否可写
    f.closed     # 文件是否关闭
    f.encoding   # 如果文件打开模式为b,则没有该属性
    f.flush()    # 立刻将文件内容从内存刷到硬盘
    f.name       # 文件名
    
    f.fileno()   # 整型的文件描述符，可用于os模块的read方法等一些底层操作上
```

**r**ead\(3\)

* 文件文本模式打开时，代表3个字符
* 文件r模式打开时，代表3个字节

```python
# -*- coding: utf-8 -*-
with open('password', mode='r', encoding='utf-8') as f:
    print(f.read(3))    # 小明:
with open('password', mode='rb') as f:
    print(f.read(3))    # b'\xe5\xb0\x8f'
```

其余的文件内光标移动都是以字节为单位，如seek，tell，truncate

```python
with open('password', mode='r', encoding='utf-8') as f:
    f.tell()    # 返回光标当前位置，以字节为单位
    f.seek(offset[, whence])    # offset表示偏移量，负数文件倒数开始
                                # whence: 起始位置，0(默认)文件对象的开头，1当前位置，2文件末尾
```


# vars

```python
'''
vars() 函数返回对象object的属性和属性值的字典对象
如果没有参数，就打印当前调用位置的属性和属性值 类似 locals()
'''

class Foo(object):
    key = 'value'

# {'key': 'value'}
print({key: value for (key, value) in vars(Foo).items() if not key.startswith('_')})
```







