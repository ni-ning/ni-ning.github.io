# 单例模式

保证一个类只有一个实例，并提供一个访问它的全局访问点。 

如 模块全局对象，其他场景如日志对象，数据库连接池

```python
class Singleton(object):
    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

class MyClass(Singleton):
    def __init__(self, value):
        self.value = value

a = MyClass(10)
b = MyClass(20)

print(a.value)      # 20
print(b.value)      # 20
print(a is b)       # True
```

优点：

* 对唯一实例的受控访问
* 单例相当于全局变量，但防止了命名空间被污染

