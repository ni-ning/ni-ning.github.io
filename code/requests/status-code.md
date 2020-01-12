# 交互协定 status\_code.py

### 理论背景

实际开发中数字来表示不同的状态，状态较少时直接配置常量定义即可，如

```python
# 使用时直接使用变量名，含义更清晰
PREPARE = 0
GET_TASK = 1
DO_TASK = 2
CLEAN_UP = 3
```

HTTP协议客户端与服务端交互的协议，双方定义的状态码较多，需采用一种更加灵活的方式

### 源码分析

```python
# 定义原始数据结构
_codes = {
    200: ('ok', 'okay', 'all_ok', 'all_okay', 'all_good', '\\o/', '✓'),
    301: ('moved_permanently', 'moved', '\\o-'),
    302: ('found',),
    404: ('not_found', '-o-'),
    500: ('internal_server_error', 'server_error', '/o\\', '✗'),
}

# codes全局变量，LookupDick对象，codes.okay或codes['okay'] 都行
codes = LookupDict(name='status_codes')

# 因requests/__init__.py中from .status_codes import codes，所以会执行该模块代码

def _init():
    for code, titles in _codes.items():
        for title in titles:
            setattr(codes, title, code)
            if not title.startswith(('\\', '/')):
                setattr(codes, title.upper(), code)
# 导入时已触发执行： 全局变量codes经过setattr把所有短语和状态码进行绑定
_init()
```

* 全局项目可以使用codes.name来表示相应状态码
* \_codes作为原始数据源，自动加载设置成codes

### 项目实践

#### 1. API通用返回格式

前后端分离开发离不开双发返回状态码的格式定义，随着业务的不断增长，状态码定义需可配置

```python
from status_code import store as sc
from flask import jsonify
class APIResult(dict):
    def __init__(self, code, result=None, msg=None)
        self['code'] = code
        self['msg'] = msg or sc.get_error_msg(code)
        self['result'] = result if result is not None else {}
    
    def __call__(self, *arg, **kw):
        return self.jsonify()
    
    def jsonify(self):
        json_resp = jsonify(**self)
        json_resp.headers['Cache-Control'] = 'no-cache'
        return json_resp

# resp 就是flask 标准的json序列化后的返回对象
# 格式规定：code, result, msg  其中code与msg相对应
resp = APIResult(0, result={"data": [1, 2, 3], msg="成功"})()
```

如何实现可配置扩展的状态码映射结构体

* 定义一个结构体存储 错误码: \(错误代码名称，默认错误信息\)
* 生成的对象支持 store.E\_SUCC

```python
import types

DEFAULT_DICT = {
    0: ('E_SUCC', '成功'),
    1: ('E_PARAM', '参数错误'),
    2: ('E_INTER', '程序内部错误'),
    3: ('E_EXTERNAL', '外部接口错误'),
    4: ('E_TIMEOUT', '第三方接口超时'),
    5: ('E_RESRC', '接口不存在'),
    6: ('E_AUTH', '鉴权失败'),
    7: ('E_FORBIDDEN', '访问被禁止'),
    8: ('E_RESOURCE_NOT_FIND', '资源不存在或已删除')
}

class StatusCodeStore(object):
    DEFAULT_STORE = None
    def __init__(self, codes=None):
        self.codes = codes if type(codes) is dict else {}
        self.refresh()
    
    def refresh(self):
        self.reverse = {}
        set_into_modeluls(self.reverse, from_store=self)
    
    def get_error_msg(self, code):
    if isinstance(code, str) and code.isdigit():
        code = int(code)
    _, msg = self.codes.get(code, (None, None)
    return msg or '未知错误'
    
    def __getattr__(self, name):
        code = self.reverse[name]
        return code

def set_into_modules(target, from_store=None):
    from_store = StatusCodeStore.DEFAULT_STORE if from_store is None else from_store
    
    if isinstance(target, dict):
        target_dict = target
    elif isinstance(target, types.ModuleType):
        target_dict = target.__dict__
    for (code, (name, msg)) in from_store.codes.items():
        target_dict[name] = code

store = StatusCodeStore.DEFAULT_STORE = StatusCodeStore(DEFAULT_DICT)
```

* 根据项目需要，可以自定义status\_code.json文件，或者单独项目以供多个项目使用

#### 2. 函数之间标识符

```python
# 定义方
def func():
    flag = True
    if flag:
        print("Flag is OK.")
        return True, None
    return False, "msg"
    
# 调用方
code, msg = func()
# 根据code码来判断后续执行逻辑
```

#### 3. 多人之间协议

```python
from collections import namedtuple

# 开户基本信息
OpenProtocol = namedtuple(
    "OpenProtocol",
    "identity_card,"
    "identity_type,"
    "bank_number,"
    "data"
)

# 一方做本地的业务操作，一方做第三发连接操作，只要都满足OpenProtocol协议字段即可
```

