# 版本兼容 compat.py

Python2和Python3的字符编码，模块路径名称的变动，会产生不一致的问题，统一建立新的变量名称是很好的编程实践

```python
import sys
_ver = sys.version_info
is_py2 = (_ver[0] == 2)
is_py3 = (_ver[0] == 3)

# simplejson比json效率更高, 支持版本更多
# 需单独安装 pip install simplejson
try:
    import simplejson as json
except ImportError:
    import json

if is_py2:
    from urllib import (
        quote, unquote, quote_plus, unquote_plus, urlencode, getproxies,
        proxy_bypass, proxy_bypass_environment, getproxies_environment)
    from urlparse import urlparse, urlunparse, urljoin, urlsplit, urldefrag
    from urllib2 import parse_http_list
    import cookielib
    from Cookie import Morsel
    from StringIO import StringIO
    from collections import Callable, Mapping, MutableMapping, OrderedDict

    builtin_str = str
    bytes = str
    str = unicode
    basestring = basestring
    numeric_types = (int, long, float)
    integer_types = (int, long)

elif is_py3:
    from urllib.parse import urlparse, urlunparse, urljoin, urlsplit, urlencode, quote, unquote, quote_plus, unquote_plus, urldefrag
    from urllib.request import parse_http_list, getproxies, proxy_bypass, proxy_bypass_environment, getproxies_environment
    from http import cookiejar as cookielib
    from http.cookies import Morsel
    from io import StringIO
    from collections import OrderedDict
    from collections.abc import Callable, Mapping, MutableMapping

    builtin_str = str
    str = str
    bytes = bytes
    basestring = (str, bytes)
    numeric_types = (int, float)
    integer_types = (int,)
```

### 字符编码

统一str表示unicode，bytes表示字节符，数字类型统一为numeric\_types和integer\_types，详尽参考

{% page-ref page="../../dev-info/character.md" %}

### 网络解析

{% page-ref page="../urllib.md" %}

{% page-ref page="../urllib3.md" %}



