# 进程的属性或方法

在主进程运行过程中如果想并发地执行其他的任务，我们可以开启子进程，此时主进程的任务与子进程的任务分两种情况

情况一：在主进程的任务与子进程的任务彼此独立的情况下，主进程的任务先执行完毕后，主进程还需要等待子进程执行完毕，然后统一回收资源。

情况二：如果主进程的任务在执行到某一个阶段时，需要等待子进程执行完毕后才能继续执行，就需要有一种机制能够让主进程检测子进程是否运行完毕，在子进程执行完毕后才继续执行，否则一直在原地阻塞，这就是join方法的作用

```python
from multiprocessing import Process
import time

def task(name):
    print('%s is running' % name)
    time.sleep(3)
    print('%s is done' % name)

if __name__ == '__main__':
    p = Process(target=task, args=('子进程1', ))
    p.start()

    # 需要基于子进程的执行结果，才能往下执行
    p.join()    # 主进程blocking，子进程正常执行完，主进程往下执行

    print('主...')
    print(p.pid)
```

p.join\(\) 是串行吗？不是

```text
join是让主线程等, 而p1-p4仍然是并发执行的,  p1.join的时候, 其余p2、p3、p4仍然在运行,
等p1.join结束,可能p2、p3、p4早已经结束了, 这样p2.join、p3.join、p4.join直接通过检测，无需等待
所以4个join花费的总时间仍然是耗费时间最长的那个进程运行的时间
```

* p.is\_alive\(\)
* p.terminate\(\)
* p.name
* p.pid

#### 相关练习

1. 进程之间内存空间是否共享

```python
from multiprocessing import Process
n = 100
# 子进程初始化的时候n=100，但进程之间的内存空间是隔离的，所以子进程更改n，不影响主中的n
def task():
    global n
    n = 0
    print('子进程内 n: %s' % n)

if __name__ == '__main__':
    p = Process(target=task)
    p.start()
    p.join()

    print('主 n: %s' % n)
```

2. 服务端多进程实现并发

```python
# server.py
from multiprocessing import Process
from socket import *

# 服务端需要做2个任务，建链接和收发数据
def talk(conn):
    while True:
        try:
            data = conn.recv(1024)
            if not data:
                break
            conn.send(data.upper())
        except ConnectionResetError:
            break
    conn.close()
    
def server(ip, port):
    s = socket(AF_INET, SOCK_STREAM)
    s.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
    s.bind((ip, port))
    s.listen(5)
    while True:
        conn, address = s.accept()
        p = Process(target=talk, args=(conn,))
        p.start()
    s.close()

if __name__ == '__main__':
    server('127.0.0.1', 8080)
    
    
# client.py
from socket import *
client = socket(AF_INET, SOCK_STREAM)
client.connect(('127.0.0.1', 8080))

while True:
    msg = input('>>: ').strip()
    if not msg:
        continue
    client.send(msg.encode('utf-8'))
    data = client.recv(1024)
    print(data.decode('utf-8'))
```

