# 逻辑实现 sessions.py

### 背景理论

编程中何时使用函数和类是很有意思的一件事

函数具有确定性，只要根据定义的参数调用即可

* 可充当类对象上层的对外使用接口，如api.py
* 作用于变量，驱动变量变化，达到目标
* 也可以说隐藏处理的细节，简化调用接口

类的三大特性决定了类是一种更复杂的结构

* 类是一系列变量存储的集合，\_\_init\_\_决定了对象初始的变量定义
* 内部方法是用来操作这些变量的
* 继承和组合让嵌套更加复杂

### 源码分析

```python
class Session(SessionRedirectMixin):
    __attrs__ = [
        'headers', 'cookies', 'auth', 'proxies', 'hooks', 'params', 'verify',
        'cert', 'prefetch', 'adapters', 'stream', 'trust_env',
        'max_redirects',
    ]
    # 初始化Session对象含有的属性值，可以理解定义库表时有哪些字段以及默认值
    def __init__(self):
        # 组合一般用法 name = Class(), 当对象较复杂时，可用函数隐藏细节，简化调用，提现编程思想
        # headers HTTP协议中传输的元数据字段信息
        self.headers = default_headers()

        self.auth = None
        self.proxies = {}
        
        # 详解钩子编程hooks.py
        self.hooks = default_hooks()
        
        # 类Session是一个复合结构，包含对Request，Response等处理，需要控制参数来适用不同场景
        self.params = {}
        self.stream = False
        self.verify = True
        self.cert = None
        self.max_redirects = DEFAULT_REDIRECT_LIMIT
        self.trust_env = True
        self.cookies = cookiejar_from_dict({})

        # 类内部经典处理逻辑
        # 定义一个变量 self.adapters = {}
        # 向该变量写数据的方法 self.mount()
        # 从该变量读数据的方法 self.get_adapter()
        self.adapters = OrderedDict()
        self.mount('https://', HTTPAdapter())
        self.mount('http://', HTTPAdapter())

    def __enter__(self):
        return self
    def __exit__(self, *args):
        self.close()

    # 初始化的参数模具已准备好，借助绑定方法去获取外部参数，加工，得到符合规定的参数
    # 绑定方法也是可以区分层次的
    #  - 从api.py得知，session对象的入口方法为request，会重点分析这个内部处理逻辑
    #  - 同样，在底层方法request之上提供其他具体使用场景的方法，通过调用self.request
    #  - get, options,head,post,put,patch,delete, 即session.get(url)的由来
    
    # 当需要处理的参数较多，且每个参数都会有自己的处理逻辑时，requests给我们提供了很好的案例，逐步处理
    # 定义req = Request(**kw) 保存初始接收到的参数，此时相当于把分散的参数汇集起来
    # 定义p = PreparedRequest() 这个类对象更像一个工具类，p.prepare(req各个参数)
    # p.prepare中可以实现每个参数的处理逻辑，最终得的符合条件的p，传给底层send发送即可
    
    def prepare_request(self, request):
        pass

    def request(self, method, url,
            params=None, data=None, headers=None, cookies=None, files=None,
            auth=None, timeout=None, allow_redirects=True, proxies=None,
            hooks=None, stream=None, verify=None, cert=None, json=None):

    def get(self, url, **kwargs):

    def options(self, url, **kwargs):

    def head(self, url, **kwargs):

    def post(self, url, data=None, json=None, **kwargs):

    def put(self, url, data=None, **kwargs):

    def patch(self, url, data=None, **kwargs):

    def delete(self, url, **kwargs):

    # 底层发送逻辑，上层接口调用时简单明了
    def send(self, request, **kwargs):

    def merge_environment_settings(self, url, proxies, stream, verify, cert):
        
    def get_adapter(self, url):

    def close(self):

    def mount(self, prefix, adapter):
    
    # pickle模块序列化的时候，涉及的相关字段
    def __getstate__(self):
        # list推导出dict, 常用技巧
        state = {attr: getattr(self, attr, None) for attr in self.__attrs__}
        return state

    def __setstate__(self, state):
        # self存储容器，存储池，存储对象，存储模型，而getattr setattr操作存储的方法
        for attr, value in state.items():
            setattr(self, attr, value)
```

#### 核心结构图

![](../../../.gitbook/assets/requests.png)

