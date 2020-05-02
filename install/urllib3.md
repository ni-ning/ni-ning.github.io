# urllib3源码泛读

> urllib3是一个功能强大，方便使用，Python实现的HTTP客户端

* 英文官方:  [https://urllib3.readthedocs.io/en/latest/index.html](https://urllib3.readthedocs.io/en/latest/index.html)
* 官方中文:  [https://s0urllib30readthedocs0io.icopy.site/en/latest/index.html](https://s0urllib30readthedocs0io.icopy.site/en/latest/index.html)
* 源码链接:  [https://github.com/urllib3/urllib3](https://github.com/urllib3/urllib3)

### 基本使用

```python
import urllib3
import json

http = urllib3.PoolManager()
r = http.request('GET', 'http://httpbin.org/get', fields={'key': 'value'})
print(r.status)
print(json.loads(r.data.decode('utf-8')))
print(r.headers)
```

### 源码分析

分析\_\_init\_\_.py就可以得出对外提供的功能

```python
__all__ = (
    'HTTPConnectionPool',   # http模式连接池
    'HTTPSConnectionPool',  # https模式连接池
    'PoolManager',          # 池管理类，self.poos映射类型，保存连接信息
    'ProxyManager',         # 行为同PoolManager
    'HTTPResponse',         # 返回对象
    'Retry',                # 精细化控制重试和重定向 retries=Retry(3, redirect=2)
    'Timeout',              # 精细化控制超时 timeout=Timeout(connect=1.0, read=2.0)
    'add_stderr_logger',    # 修改默认日志的级别
    'connection_from_url',  # 返回HTTPConnectionPool或HTTPSConnectionPool实例
    'disable_warnings',     # 禁用warnings
    'encode_multipart_formdata',    # dict 转换成 form-data
    'get_host',             # Deprecated. Use :func:`parse_url` instead
    'make_headers',         # 生成request headers 快捷函数
    'proxy_from_url',       # 返回ProxyManager对象
)
```

* Retry，Timeout 整数封装成附加其他功效的简单功能类
* HTTPResponse 对返回数据的Model封装

#### PoolManager与RequestMethods

![](../../.gitbook/assets/poolmanager.png)

#### 主干类的层次结构

![](../../.gitbook/assets/urllib3.png)

