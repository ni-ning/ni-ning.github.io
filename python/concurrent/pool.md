# 并发编程之进程线程池

### 进程池与线程池

刚开始学多进程或多线程时，我们迫不及待地基于多进程或多线程实现并发的套接字通信，然而这种实现方式的致命缺陷是：服务的开启的进程数或线程数都会随着并发的客户端数目地增多而增多，这会对服务端主机带来巨大的压力，甚至于不堪重负而瘫痪，于是我们必须对服务端开启的进程数或线程数加以控制，让机器在一个自己可以承受的范围内运行，这就是进程池或线程池的用途，例如进程池，就是用来存放进程的池子，本质还是基于多进程，只不过是对开启进程的数目加上了限制

```python
import os
import time
import random
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

def task(name):
    print('name: %s, pid: %s is running' % (name, os.getpid()))
    time.sleep(random.randint(1, 3))

if __name__ == '__main__':
    pool = ProcessPoolExecutor(4)           # 池子内部造进程，并开启，Process() and start
    # pool = ThreadPoolExecutor(4)           # 池子内部造进程，并开启，Thread() and start
    for i in range(10):
        pool.submit(task, 'linda%s' % i)    # 异步调用

    # pool.shutdown(wait=True)    # 类似 join()

    print('主...')
```

**基本方法：**

```text
1. submit(fn, *args, **kwargs)
异步提交任务

2. map(func, *iterables, timeout=None, chunksize=1) 
取代for循环submit的操作

3. shutdown(wait=True) 
相当于进程池的pool.close()+pool.join()操作
wait=True，等待池内所有任务执行完毕回收完资源后才继续
wait=False，立即返回，并不会等待池内的任务执行完毕
但不管wait参数为何值，整个程序都会等到所有任务执行完毕
submit和map必须在shutdown之前

4. result(timeout=None)
取得结果

5. add_done_callback(fn)
回调函数
```

### 回调函数

提交任务的两种方式

* 同步调用：提交完任务后，就在原地等待任务执行完毕，拿到结果，再执行下一行代码，导致程序串行执行

```python
import time
import random
from concurrent.futures import ThreadPoolExecutor

def task(name):
    print('name: %s' % name)
    time.sleep(random.randint(1, 3))
    ret = random.randint(4, 6) * '#'
    return {'name': name, 'ret': ret}

def callback(d):
    name, size = d['name'], d['ret']
    print('name: %s, size: %s' % (name, size))

if __name__ == '__main__':
    pool = ThreadPoolExecutor(13)

    ret1 = pool.submit(task, 'linda').result()
    callback(ret1)
    ret2 = pool.submit(task, 'tom').result()
    callback(ret2)
    ret3 = pool.submit(task, 'catherine').result()
    callback(ret3)
```

* 异步调用：提交完任务后，不用在原地等待，而直接执行下一行代码。可附加回调函数，即把任务的结果自动传给callback

```python
import time
import random
from concurrent.futures import ThreadPoolExecutor

def task(name):
    print('%s is doing ' % name)
    time.sleep(random.randint(1, 3))

    ret = random.randint(4, 6) * '#'
    return {'name': name, 'ret': ret}

def callback(future):
    # callback只会在task执行完，自动执行
    d = future.result()
    name, size = d['name'], d['ret']
    print('at last, name: %s, size: %s' % (name, size))

if __name__ == '__main__':
    pool = ThreadPoolExecutor(13)

    pool.submit(task, 'linda').add_done_callback(callback)
    pool.submit(task, 'tom').add_done_callback(callback)
    pool.submit(task, 'catherine').add_done_callback(callback)
```

**补充：**

```text
阻塞：进程运行的一种状态，遇到IO，CPU执行权限被剥夺
非阻塞： 对立面，即运行或就绪

同步提交，虽然在原地等，如果任务是纯计算的，没有IO，也就不是阻塞
```

**示例：**

```python
import requests
import time
from concurrent.futures import ThreadPoolExecutor

def get(url):
    print('GET %s' % url)
    resp = requests.get(url)
    time.sleep(3)
    return {'url': url, 'content': resp.text}

def parse(future):
    ret = future.result()
    print('parse content is %s' % len(ret['content']))

if __name__ == '__main__':
    urls = [
        'http://www.baidu.com',
        'http://cnblogs.com',
        'http://www.python.org'
    ]
    pool = ThreadPoolExecutor(2)
    for url in urls:
        pool.submit(get, url).add_done_callback(parse)
```

