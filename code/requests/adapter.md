# 网络传输 adapters.py

* 此章节数据发送与底层urllib3联系紧密，参考[urllib3源码泛读](../urllib3.md)
* BaseAdapter-HTTPAdapter 采用典型的 接口类-实现类，参考[设计模式](../../think/dm/)

### 源码分析

```python
# -*- coding: utf-8 -*-
from urllib3.poolmanager import PoolManager

# 模拟数据
class Response(object):
    pass
class CaseInsensitiveDict(object):
    pass
def extract_cookies_to_jar(*arg, **kw):
    pass

# 抽象类
class BaseAdapter(object):
    def __init__(self):
        super(BaseAdapter, self).__init__()

    def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
        raise NotImplementedError

    def close(self):
        raise NotImplementedError

# 实现类
class HTTPAdapter(BaseAdapter):
    def __init__(self):
        # 正常写代码的地方，可调用函数，如self.init_poolmanager
        # 内部定义数据结构来存储数据，self.config, self.proxy_manager
        self.config = {}
        self.proxy_manager = {}
        super(HTTPAdapter, self).__init__()
        self.init_poolmanager()

    def init_poolmanager(self):
        self.poolmanager = PoolManager()

    def build_response(self, req, resp):
        # requests的返回值对象属性的来源******
        response = Response()
        response.status_code = getattr(resp, 'status', None)
        response.headers = CaseInsensitiveDict(getattr(resp, 'headers', {}))

        response.encoding = response.headers
        response.raw = resp
        response.reason = response.raw.reason

        if isinstance(req.url, bytes):
            response.url = req.url.decode('utf-8')
        else:
            response.url = req.url
        extract_cookies_to_jar(response.cookies, req, resp)
        
        response.request = req
        response.connection = self
        return response

    def get_connection(self, url):
        conn = self.poolmanager.connection_from_url(url)
        return conn

    def close(self):
        self.poolmanager.clear()

    def send(self, request, stream=False, timeout=None, verify=True, cert=None, proxies=None):
        conn = self.get_connection(request.url)
        resp = conn.urlopen(
            method=request.method,
            url=request.url,
            body=request.body,
            headers=request.headers,
            redirect=False,
            assert_same_host=False,
            preload_content=False,
            decode_content=False,
            retries=self.max_retries,
            timeout=timeout
        )
        return self.build_response(request, resp)
```

