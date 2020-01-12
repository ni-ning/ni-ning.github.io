# 数据结构 structures.py

> dict类型不但在各类程序中广泛使用，它也是Python语言的基石。模块的命名空间、实例的属性和函数的关键参数都可以看到字典的身影。跟它有关的内置函数都在\_\_builtins\_\_.\_\_dict\_\_模块中。 
>
>                                                                                                                                         -   来自&lt;&lt;流畅的Python&gt;&gt;

### 背景理论

collections.abc模块中有Mapping和MutableMapping这两个抽象基类，它们的作用是为dict和其他类似的类型定义形式接口，即定义了构建一个映射类型所需要的最基本接口

### 源码分析

```python
class CaseInsensitiveDict(MutableMapping):
    # CaseInsensitiveDict 可
    def __init__(self, data=None, **kwargs):
        self._store = OrderedDict()    # 内部定义一个存储
        if data is None:               # None 常见用法
            data = {}
        self.update(data, **kwargs)    # 可选项 update

    def __setitem__(self, key, value):
        # key.lower(): (key, value), 注意存储的结构
        self._store[key.lower()] = (key, value)

    def __getitem__(self, key):
        # D[key]触发，联系存储结构中的值 (key, value)
        return self._store[key.lower()][1]

    def __delitem__(self, key):
        # del D[key]触发
        del self._store[key.lower()]

    def __iter__(self):
        # 生成器表达式可解决大数据量问题
        return (casedkey for casedkey, mappedvalue in self._store.values())

    def __len__(self):
        # 围绕基本数据结构self._store
        return len(self._store)

    def lower_items(self):
        # 定义独有的方法
        return (
            (lowerkey, keyval[1])
            for (lowerkey, keyval)
            in self._store.items()
        )

    def __eq__(self, other):
        # object == object 时触发
        if isinstance(other, Mapping):
            other = CaseInsensitiveDict(other)
        else:
            return NotImplemented
        # 比较很有意思
        return dict(self.lower_items()) == dict(other.lower_items())

    def copy(self):
        # CaseInsensitiveDict 直接实例化，牛叉
        return CaseInsensitiveDict(self._store.values())

    def __repr__(self):
        return str(dict(self.items()))
# 小结：核心self._store + 映射规范

# dict的扩展
class LookupDict(dict):
    def __init__(self, name=None):
        self.name = name
        super(LookupDict, self).__init__()

    def __repr__(self):
        return '<lookup \'%s\'>' % (self.name)

    def __getitem__(self, key):
        return self.__dict__.get(key, None)

    def get(self, key, default=None):
        return self.__dict__.get(key, default)
```



