# 初始化说 \_\_init\_\_.py

### 背景理论

#### 1. \_\_init\_\_.py用来标识所在目录是一个python的模块包\(module package\)

实际上，如果目录包含\_\_init\_\_.py文件，当导入该目录时，会执行\_\_init\_\_.py里面的代码

```python
request
   |__init__.py  --> print('I from the __init__.py of request.')
   |api.py --> def view(): pass
```

工作目录request所在目录，进入交互模式 import

```python
>>> import request
I from the __init__.py of request.
```

#### 2.  \_\_init\_\_.py用来控制模块的导入，对外提供功能

* 有时项目目录比较深，可在\_\_init\_\_.py中导入，使用者直接从package顶层即可导入使用
* 控制模块导入，当import request注意时request所在目录为工作目录

```python
# __init__.py 导入其他功能时，注意工作目录
from request.api import view

print('I from the __init__.py of request.')
```

### 源码分析

```python
# 自己开发的项目，如request的启动目录是固定的，所以from request.api import view
# 作为开源的reuqests使用相对导入较好 .就表示__init__.py所在的目录及requests
from .__version__ import __title__, __description__, __url__, __version__
from .__version__ import __build__, __author__, __author_email__, __license__
from .__version__ import __copyright__, __cake__

from . import utils
from . import packages
from .models import Request, Response, PreparedRequest
from .api import request, get, head, post, patch, put, delete, options
from .sessions import session, Session
from .status_codes import codes
from .exceptions import (
    RequestException, Timeout, URLRequired,
    TooManyRedirects, HTTPError, ConnectionError,
    FileModeWarning, ConnectTimeout, ReadTimeout
)

# reqeusts 使用方式
>>> requests.__version__
>>> requests.PreparedRequest()
>>> requests.get(url='http://www.baidu.com')
>>> requests.Session()
>>> from requests import codes
>>> from requests import ConnectTimeout
```

* warnings 用于提示用户一些错误或过时的用法，后续代码依然执行
* chardet 对未知bytes的编码进行猜测，然后转换为str

```python
>>> chardet.detect(b'Hello, world!')
{'encoding': 'ascii', 'confidence': 1.0, 'language': ''}
>>> chardet.detect('中华人民共和国'.encode('gbk'))
{'confidence': 0.99, 'encoding': 'GB2312', 'language': 'Chinese'}
```

* urllib是Python官方连接的标准库
* urllib3是第三方库，提供了原生urllib没有的特性，如连接池
* requests库其实是对urllib3的再次封装，使用更加友好

```python
# 几乎所有的三方模块都会有相关代码段，后续会有logging源码分析
import logging
from logging import NullHandler

logging.getLogger(__name__).addHandler(NullHandler())
```

* check\_compatibility和\_check\_cryptography实现思想可参考异常结构exceptions.py

### 项目结构

![](../../../.gitbook/assets/structure.png)

