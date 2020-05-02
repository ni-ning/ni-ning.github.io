# urllib

* urllib是Python自带的爬虫库
* 常用urllib.reqeust, urllib.parse

使用流程：

* 指定url
* 基于urllib的request子模块发起请求
* 获取响应中的数据值
* 持久化存储

### 代理

* 正向代理：代理客户端获取数据。正向代理是为了保护客户端防止被追究责任。
* 反向代理：代理服务器提供数据。反向代理是为了保护服务器或负责负载均衡。


```python
from urllib.parse import *

quote('abc def')       --> 'abc%20edf'
unquote('abc%20edf')   --> 'abc def'

# Parse a URL into 6 components
# <scheme>://<netloc>/<path>;<params>?<query>#<fragment>
urlparse(''http://www.baidu.com/path?key=value#comments'') --> ParseResult(scheme='http', netloc='www.baidu.com', path='/path', params='', query='key=value', fragment='comments')
urlunparse(components) --> url

# urlsplit(url) --> Parse a URL into 5 components but params
# urlunsplit(components) --> url


parse_qs(query)   --> obj
parse_qsl(query)  --> dict
urlencode(query_dict) --> query_str
```


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

