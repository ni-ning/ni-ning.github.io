# 经典视图 api.py

### 源码分析

第一个层次，核心逻辑有模块 sessions.py 实现，为方便使用，对外提供接口，对应HTTP协议的方法

第二个层次，涉及局部代码层次结构时，会有一个通用底层代码，如request，然后再此基础上构建上层代码，如get post

![](../../../.gitbook/assets/api.png)

```python
# 局部底层代码
def request(method, url, **kw):pass

def get(url, params=None, **kw):pass   # 获取
def options(url, **kw):pass            # 询问url支持的方法
def head(url, **kw):pass               # 确定url的有效性
def post(url, data=None, json=None, **kw):pass  # 新增
def put(url, data=None, **kw):pass     # 整体更新
def patch(url, data=None, **kw):pass   # 局部更新
def delete(url, **kw):pass             # 删除

```

```python
def request(method, url, **kwargs):
    with sessions.Session() as session:
        return session.request(method=method, url=url, **kwargs)
        
# with 上下文管理器触发的是类Session对应内置方法
def __enter__(self):
    return self
def __exit__(self, *args):
    self.close()
    
# 执行顺序为：
# 执行__enter__返回self作为as中的session
# 执行session.request(method=method, url=url, **kwargs)
# 执行__exit__ session.close()
```

request外部接口函数的参数与session.request绑定方式是一致，详情见 逻辑实现层sessions.py

### 项目实践

#### partial偏函数

把一个函数的某些参数设置默认值，返回一个新的函数，调用这个新函数会更简单些

```python
import functools

def show_arg(*arg, **kw):
    print(arg, kw)

show_arg(1, 2, 3, a='a', b='b', c='c')

show1 = functools.partial(show_arg, 1, 2, 3)
show1(a='a', b='b', c='c')

show2 = functools.partial(show_arg, a='a', b='b', c='c')
show2(1, 2, 3)
```

#### 程序局部结构

实际项目开发时经常是前后端分离开发，对于后端避免不了API的开发，如何构建程序结构

```text
package
  |-views   # 对外展示接口函数
  |-ops     # 内部实现逻辑
  |-models  # 存储模型
```

