# 字符编码

## Python3特性预览

> 文本总是用unicode进行编码，以str类型表示；而二进制数据以bytes类型表示

Python3中最重要的特性将文本\(text\)和二进制数据做了更清晰的区分

不能以任何隐式方式将str和bytes类型混合使用

* 不可以将str和bytes类型进行拼接
* 不能在str中搜索bytes数据\(反之亦然\)
* 不能将str作为参数传入需要bytes类型参数的函数\(反之亦然\)

strings可以被编码\(encode\)成bytes，bytes也可以解码\(decode\)成strings

![](../../.gitbook/assets/py3_string_bytes.png)

```python
>>> '€20'.encode('utf-8')
b'\xe2\x82\xac20'
>>> b'\xe2\x82\xac20'.decode('utf-8')
'€20'
```

可以这样理解：

字符串\(string\)是文本\(text\)的抽象表示，字符串\(string\)由字符组成，字符也是抽象的实体且与任何二进制表示无关。当操纵字符串的时候，很多细节是不用了解的，我们可以分割、切片和拼接字符串，在字符串内部进行搜索。但并不在乎内部是如何表示的，也不用在意底层一个字符要花费多少byte。

传入encode和decode的参数是编码方式。**`编码是一种用二进制数据表示抽象字符的方式。`**目前有很多种编码。上面给出的utf-8是一种，下面是另一种：

```python
>>> '€20'.encode('iso-8859-15')
b'\xa420' 
>>> b'\xa420'.decode('iso-8859-15')
'€20'
```

编码是这个转换过程中至关重要的一部分。若不编码，bytes对象b'xa420'只是一堆比特位而已。编码赋予其含义。**`采用不同的编码，这堆比特位的含义就会大不同：`**

```python
>>> b'\xa420'.decode('windows-1255') 
'₪20'
```

附：[原文链接](https://eli.thegreenplace.net/2012/01/30/the-bytesstr-dichotomy-in-python-3)

## 字符编码详解

![](../../.gitbook/assets/zi-fu-bian-ma.png)

* 文本编辑器包括Pycharm编写的内容是存在内存中的，断电后丢失；
* 想要永久保存，需要点击保存按钮 save，把内存中数据刷到硬盘上；
* 保存save时用二进制的0 1比特存储内存数据，**涉及编码**，编辑器可指定默认编码；
* Python解释器先类似编辑器读取read功能，还原硬盘中数据到内存中，**涉及编码**，和save时一致就行
* Python解释器执行加载到内存中的数据，识别Python语法，有数据类型的变量，如list，dict，str
* Python解释器执行到name="Linda"时，会开辟空间存储字符串"Linda"，**会涉及编码**

所以在 **保存 - 读取** 阶段不乱码的核心法则是：字符保存时按照什么标准编码，读取时就按照什么标准解码

```python
# 文件test.py 以gbk格式保存，内容为：
country = '中国'

python2 test.py
python3 test.py

都会报错(因为python2默认ascii，python3默认utf-8)

除非在文件开头指定 # coding: gbk
```

在**解释器执行**阶段，数据已经正常读取到内存中\(统一unicode编码\)，然后执行，执行过程中会开辟新的空间，如 x = "Linda"

```python
内存的编码是用unicode，不代表内存全都是unicode

在程序执行之前，内存中确实都是unicode,
比如从文件中读取了一行x = "Linda"，其中的x，= ，""，地位都一样，都是普通字符而已，都是以unicode的格式存放于内存中的

但是程序在执行过程中，会申请内存(与程序代码所存在的内存是俩个空间)用来存放python的数据类型的值，
而python的字符串类型又涉及到了字符的概念

比如x = "Linda", 会被python解释器识别为字符串，会申请内存空间来存放字符串类型的值，
至于该字符串类型的值被识别成何种编码存放，这就与python解释器的有关了，而python2与python3的字符串类型又有所不同 
```

### Python2中有两种字符串类型str和unicode

#### **str类型**

当python解释器执行到产生字符串的代码时\(如x='上'\)，会申请新的内存地址，然后将'上'**编码成文件开头**指定的编码格式，想看x在内存中的真实格式，可以将其放入列表中再打印，而不要直接打印，直接print会自动转码

```python
# -*- coding: gbk -*-
x = '上'
y = '下'
print([x, y])             # ['\xc9\xcf', '\xcf\xc2']
print(type(x), type(y))   # (<type 'str'>, <type 'str'>)
# 16进制 \x, gbm中文2个字节，16位比特(0或1)，4个16进制字符(0-f)

print(['上'.decode('gbk'), '下'.decode('gbk')])    # [u'\u4e0a', u'\u4e0b']
```

#### **unicode类型**

当python解释器执行到产生字符串的代码时\(如x=u'上'\)，会申请新的内存地址，然后将'上'已unicode的格式存放到新的内存空间中，所以x只能encode，不能decode

```python
# -*- coding: gbk -*-
x = u'上'        # 等同于 x = '上'.decode('gbk')
y = u'下'        # 等同于 x = '下'.decode('gbk')
print([x, y])    # [u'\u4e0a', u'\u4e0b']
print(type(x), type(y))     # (<type 'unicode'>, <type 'unicode'>)
```

#### **打印到终端**

```python
# -*- coding: gbk -*-
x = '上'    # '\xc9\xcf'
print(x)    #  这一步将x指向的那块新的内存空间(非代码所在的内存空间)中的内存，打印到终端
# 按理说应该打印 '\xc9\xcf'，但不熟悉的程序员立马懵逼，所以龟叔自作主张在print时，
# 使用终端的编码格式，将内存中'\xc9\xcf'转换成字符显示，此时就要求终端编码格式必须为gbk，否则无法显示

# x = u'上'  # u'\u4e0a'
# unicode可以转换成任意编码，pycharm的utf-8还是windows的gbk都不会报错
```

python刚诞生之际，unicode编码还没有统一，所以str是bytes类型，python3直接str为unicode

### python3也有两种字符串类型str和bytes

```python
# -*- coding: gbk -*-
x = '上'          # 当程序执行时，无需加u，'上'也会被以unicode形式保存新的内存空间中
print(type(x))   #  <class 'str'>

# x可以直接encode成任意编码格式
print(x.encode('gbk'))          # b'\xc9\xcf'
print(type(x.encode('gbk')))    # <class 'bytes'>
```

看到python3中x.encode\('gbk'\)的结果'\xc9\xcf'正是python2中的str类型的值, 而在python3是bytes类型，

在python2中则是str类型，python2中的str类型就是python3的bytes类型

附：[原文链接](https://www.cnblogs.com/linhaifeng/articles/5950339.html)

## 字符编码实践

```python
# coding:utf-8
import six
def to_unicode(s, encoding='utf-8', errors='strict'):
    if six.PY2:
        return s if isinstance(s, unicode)\
               else s.decode(encoding, errors=errors)
    else:
        return s if isinstance(s, six.string_types)\
               else s.decode(encoding, errors=errors)

def to_byte(s, encoding='utf-8', errors='strict'):
    if six.PY2:
        return s.encode(encoding, errors=errors)\
               if isinstance(s, unicode) else s
    else:
        return s.encode(encoding, errors=errors)\
               if isinstance(s, six.string_types) else s
```

