# 数据存储 models.py

api.py 定义一系列函数作为外部使用的接口，从而可以看出两者各自的应用场景

## Requst

该模块最直观的是定义了一些类，作为存储模型，也就是规定了存储各个字段

用户输入了一些列参数: method, url, headers, files, data, params, auth, cookies, hooks, json

* 参数较多，首先把这些分散的参数汇聚成一个Request对象
* 每一个参数需要校验格式化，并且与系统默认的参数合并，PreparedRequest为每个参数定义了各自处理方法
* PreparedRequest是最终send的合格数据，研究每个处理方法可以加深对HTTP协议的理解，以及处理用户输入的不确定性

```python
# Reqeust对用户输入数据首次封装
# Request也提供了封装数据处理成格式数据的方法 prepare
class Request(RequestHooksMixin):
    def __init__(self,
            method=None, url=None, headers=None, files=None, data=None,
            params=None, auth=None, cookies=None, hooks=None, json=None):
        
        # 定义函数参数为None，内部再用三元表达式处理成可变的数据类型
        data = [] if data is None else data
        files = [] if files is None else files
        headers = {} if headers is None else headers
        params = {} if params is None else params
        hooks = {} if hooks is None else hooks

        self.hooks = default_hooks()
        for (k, v) in list(hooks.items()):
            self.register_hook(event=k, hook=v)

        self.method = method
        self.url = url
        self.headers = headers
        self.files = files
        self.data = data
        self.json = json
        self.params = params
        self.auth = auth
        self.cookies = cookies
        # 执行__init__内部代码时，self这个变量是已经创建好了，可以放心使用
        # d = dict()  # 可变类型dict
        # ret = d     # ret作为返回值, d修改时ret也会跟着变动，所以放心使用self
         
    def __repr__(self):
        return '<Request [%s]>' % (self.method)  # 学着定义更加明确 '<类名[标识如post]>'

    def prepare(self):
        # 类的使用有时也很简单，p属性与方法的结合体
        p = PreparedRequest()
        # p.prepare可处理的参数，初始化自带参数，绑定方法定义的参数
        # 绑定方法对一些列参数进行处理，可以有直接返回值
        # 也可以直接使用p，因为p是可变类型，并且还是属性和方法的结合体
        p.prepare(
            method=self.method,
            url=self.url,
            headers=self.headers,
            files=self.files,
            data=self.data,
            json=self.json,
            params=self.params,
            auth=self.auth,
            cookies=self.cookies,
            hooks=self.hooks,
        )
        # pp 很神奇
        return p
```

## PreparedRequest

PreparedRequest对象p是最终发送时符合HTTP协议规范的数据集合。parepare接收的10个参数经过处理封装到self属性上，结合HTTP协议，分析每个self.prepare\_\*绑定方法

```python
class PreparedRequest(RequestEncodingMixin, RequestHooksMixin):
    def __init__(self):
        self.method = None
        self.url = None
        self.headers = None
        self._cookies = None
        self.body = None
        self.hooks = default_hooks()
        self._body_position = None

    def prepare(self,
            method=None, url=None, headers=None, files=None, data=None,
            params=None, auth=None, cookies=None, hooks=None, json=None)

        self.prepare_method(method)
        self.prepare_url(url, params)
        self.prepare_headers(headers)
        self.prepare_cookies(cookies)
        self.prepare_body(data, files, json)
        self.prepare_auth(auth, url)
        self.prepare_hooks(hooks)
```

### prepare\_method

```python
def prepare_method(self, method):
    # self == p 数据存储容器
    self.method = method
    
    # 解决Pyhton 2 3 兼容性问题，以及method输入支持b'post'格式，最终统一处理为'POST'
    if self.method is not None:
        self.method = to_native_string(self.method.upper())
```

### prepare\_url

```text
http://username:password@www.example.com:80/dir/index.html?uid=1#ch1

scheme    协议名 http:或https: 不区分大小写 最后附一个冒号(:)
auth      登录信息(认证)
host      服务器地址  
port      服务器端口
path      带层次的文件路径
query     查询字符串
fragment  片段标识符
```

```python
def prepare_url(self, url, params):
    # str bytes unicode 是跨不过去的坎
    if isinstance(url, bytes):
        url = url.decode('utf8')
    else:
        url = unicode(url) if is_py2 else str(url)
    
    # 后续处理http开始的url
    url = url.lstrip()
    if ':' in url and not url.lower().startswith('http'):
        self.url = url
        return
    
    try:
        scheme, auth, host, port, path, query, fragment = parse_url(url)
    except LocationParseError as e:
        raise InvalidURL(*e.args)
    if not scheme:
        error = ("Invalid URL {0!r}: No schema supplied. Perhaps you meant http://{0}?")
        error = error.format(to_native_string(url, 'utf8'))
        raise MissingSchema(error)
    if not host:
        raise InvalidURL("Invalid URL %r: No host supplied" % url)
    # 支持国际化域名
    if not unicode_is_ascii(host):
        try:
            host = self._get_idna_encoded_host(host)
        except UnicodeError:
            raise InvalidURL('URL has an invalid label.')
    elif host.startswith(u'*'):
        raise InvalidURL('URL has an invalid label.')

    # username:password@www.example.com:80
    netloc = auth or ''
    if netloc:
        netloc += '@'
    netloc += host
    if port:
        netloc += ':' + str(port)
        
    if not path:
        path = '/'
  
    # get请求时支持 params参数的原因
    enc_params = self._encode_params(params)
    if enc_params:
        if query:
            query = '%s&%s' % (query, enc_params)
        else:
            query = enc_params
    # 最后把处理好的各项重新拼接为url
    url = requote_uri(urlunparse([scheme, netloc, path, None, query, fragment]))
    # self == p 数据存储容器
    self.url = url
```

### prepare\_headers

```python
def prepare_headers(self, headers):
    # self == p 数据存储容器, key值大小写不敏感
    self.headers = CaseInsensitiveDict()
    if headers:
        for header in headers.items():
            check_header_validity(header)
            name, value = header
            self.headers[to_native_string(name)] = value
```

### prepare\_cookies

```python
# Cookie是headers中一表项，所以prepare_cookies放置于prepare_headers之后执行
def prepare_cookies(self, cookies):
    # cookielib.CookieJar 数据结构单独分析
    if isinstance(cookies, cookielib.CookieJar):
        self._cookies = cookies
    else:
        self._cookies = cookiejar_from_dict(cookies)

    cookie_header = get_cookie_header(self._cookies, self)
    if cookie_header is not None:
        self.headers['Cookie'] = cookie_header
```

### prepare\_body

```python
def prepare_body(self, data, files, json=None):
    body = None
    content_type = None
    
    # json 传入一个dict，会执行dumps(dict)
    if not data and json is not None:
        content_type = 'application/json'
        body = complexjson.dumps(json)
        if not isinstance(body, bytes):
            body = body.encode('utf-8')

    is_stream = all([
        hasattr(data, '__iter__'),
        not isinstance(data, (basestring, list, tuple, Mapping))
    ])

    try:
        length = super_len(data)
    except (TypeError, AttributeError, UnsupportedOperation):
        length = None

    if is_stream:
        body = data

        if getattr(body, 'tell', None) is not None:
            # Record the current file position before reading.
            # This will allow us to rewind a file in the event
            # of a redirect.
            try:
                self._body_position = body.tell()
            except (IOError, OSError):
                # This differentiates from None, allowing us to catch
                # a failed `tell()` later when trying to rewind the body
                self._body_position = object()

        if files:
            raise NotImplementedError('Streamed bodies and files are mutually exclusive.')

        if length:
            self.headers['Content-Length'] = builtin_str(length)
        else:
            self.headers['Transfer-Encoding'] = 'chunked'
    else:
        # Multi-part file uploads.
        if files:
            (body, content_type) = self._encode_files(files, data)
        else:
            if data:
                body = self._encode_params(data)
                if isinstance(data, basestring) or hasattr(data, 'read'):
                    content_type = None
                else:
                    content_type = 'application/x-www-form-urlencoded'

        self.prepare_content_length(body)

        # Add content-type if it wasn't explicitly provided.
        if content_type and ('content-type' not in self.headers):
            self.headers['Content-Type'] = content_type
    
    # self == p 数据存储容器
    self.body = body
```

## Response

requests会把HTTP返回的信息以对象的形式存储，那类Response就是存储的模型。模型一般是有初始值，在使用的过程中会赋值不同值，满足不同HTTP的返回对象。类Response必然符合HTTP返回信息的相关字段

* 返回状态码 status\_code和描述短语 reason
* 返回头部字段 headers，以及cookies
* 网络传输必然涉及到bytes内容的存储 \_content和编码信息encoding
* 整个过程的日志记录信息等 url, history, request, elapsed等
* 以及其他所需的状态表示和演化而来的property等

从数据流转角度，包括定义模型类，向模型类写数据，从模型类读数据

### 定义模型类

def \_\_init\_\_\(self\):pass，可以理解为建立库表字段时，定义哪些字段并附加初始值。类的优势可以根据初始属性字段推导出更符合上层使用接口，可仔细分析它们之间的层次结构

![](../../../.gitbook/assets/response.png)

### 向模型类写数据

代码写的太好了，不忍加注释，整个过程是属性的确定，没有涉及到Response绑定方法

```python
# requets.adapters.HTTPAdapter
def build_response(self, req, resp):
    """
    :param req: The :class:`PreparedRequest <PreparedRequest>` object
    :param resp: The urllib3 response object
    :rtype: requests.Response
    """
    response = Response()
    response.status_code = getattr(resp, 'status', None)
    response.headers = CaseInsensitiveDict(getattr(resp, 'headers', {}))
    response.encoding = get_encoding_from_headers(response.headers)
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
```

### 从模型类读数据

具体Response的使用方式，[参考官方文档](https://2.python-requests.org/zh_CN/latest/user/quickstart.html#id3)

