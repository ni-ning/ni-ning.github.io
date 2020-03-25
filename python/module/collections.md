## tuple
python 内置类型
- 不可变，iterable (实现魔法函数 __iter __ 或 __getitem __)
- 拆包
- tuple的不可变不是绝对的 （'lidna', [1, 2]）
- tuple比list好的地方 immutable的重要性
	
	- 性能优化：元素全部为immutable的tuple会作为常量在编译时确定，可加快速度
	- 线程安全：因都不能修改
	- 可以作为dick的key
	- 拆包特性
	- 可以和C原因类比 tuple对应struct, list对应array


```
# tuple
name_tuple = ('linda1', 'linda2')
# 动态语言支持，静态语言就不支持，变量的本质
name_tuple = ('linda3', 'linda4')

# 不可变说的是，元素值不能修改
# name_tuple[0] = 'linda'

# 拆包
name, age, height = ('linda', 18, '175com')
```

## nametuple

- 继承tuple
- 相比于自定义类，省空间
- 最佳场景 name_tuple=pymysql取一列

```
# nametuple
from collections import namedtuple

# 生成一个类，不是通常的对象
User = namedtuple('User', ['name', 'age', 'height'])
user = User(name='linda', age=18, height=175)
print(user.name, user.age, user.height)
print(dict(user._asdict()))
```


# defaultdict
传入参数为可调用对象
```
# defaultdict
from collections import defaultdict

# 常规统计出现次数操作
user_dict = {}
users = ['linda1', 'linda2', 'linda1', 'linda1']
for user in users:
    # if user not in user_dict:
    #     user_dict[user] = 1
    # else:
    #     user_dict[user] += 1
    # 或者 少做一次查询
    user_dict.setdefault(user, 0)
    user_dict[user] += 1

print(user_dict)

# 传入一个可调用 int->0 list->[] dict->{} 不存在时默认值
default_dict = defaultdict(int)
for user in users:
    default_dict[user] += 1
print(default_dict)
```

## deque
双向列表
- deque 线程安全 GIL
- list 不是线程安全

```
# deque
from collections import deque

dd = deque(['linda1', 'linda2'])
user = dd.popleft()
print(user, dd)     # linda1 deque(['linda2'])
```

# Counter

继承 dict

```
# Counter
from collections import Counter
users = ['linda1', 'linda2', 'linda1', 'linda1']
user_count = Counter(users)     # 直接初始化就行
user_count.update(['linda2', 'linda'])  # 两个合并统计
print(user_count)
print(user_count.most_common(2))    # 取前两个

```

# OrderedDict

- 继承 dict，具备dict特点
- 顺序添加，相应输出

```
# OrderedDict
from collections import OrderedDict

ordered_dict = OrderedDict()
ordered_dict['c'] = 'ccc'
ordered_dict['b'] = 'bbb'
ordered_dict['a'] = 'aaa'

print(ordered_dict)
```

## ChainMap
- chain map

```
# ChainMap
from collections import ChainMap

user_dict1 = {'a': 'linda1'}
user_dict2 = {'b': 'linda2'}

for key, value in ChainMap(user_dict1, user_dict2).items():
    print(key, value)
```