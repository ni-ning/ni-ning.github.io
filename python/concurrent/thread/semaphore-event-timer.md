# 信号量事件定时器

### 信号量 Semaphore

信号量也是一把锁，可以指定信号量为5，对比互斥锁同一时间只能有一个任务抢到锁去执行，信号量同一时间可以有5个任务拿到锁去执行，如果说互斥锁是合租房屋的人去抢一个厕所，那么信号量就相当于一群路人争抢公共厕所，公共厕所有多个坑位，这意味着同一时间可以有多个人上公共厕所，但公共厕所容纳的人数是一定的，这便是信号量的大小

```python
from threading import Thread, Semaphore
import threading
import time

def func():
    sm.acquire()
    print('%s gets sm' % threading.current_thread().getName())
    time.sleep(3)
    sm.release()


if __name__ == '__main__':
    sm = Semaphore(5)
    for i in range(23):
        t = Thread(target=func)
        t.start()
```

**分析：**

```text
- Semaphore管理一个内置的计数器，如value=5
- 每当调用acquire()时内置计数器-1，调用release() 时内置计数器+1
- 计数器不能小于0，当计数器为0时，acquire()将阻塞线程直到其他线程调用release()
```

### 事件 Event

线程的一个关键特性是每个线程都是独立运行且状态不可预测。如果程序中的其他线程需要通过判断某个线程的状态来确定自己下一步的操作，这时线程同步问题就会变得非常棘手

为了解决这些问题,我们需要使用threading库中的Event对象

* 对象包含一个可由线程设置的信号标志，它允许线程等待某些事件的发生在初始情况下，Event对象中的信号标志被设置为假
* 如果有线程等待一个Event对象，而这个Event对象的标志为假，那么这个线程将会被一直阻塞直至该标志为真
* 一个线程如果将一个Event对象的信号标志设置为真，它将唤醒所有等待这个Event对象的线程
* 如果一个线程等待一个已经被设置为真的Event对象,那么它将忽略这个事件, 继续执行

```python
from threading import Event
event.is_set()：返回event的状态值；
event.wait()：如果 event.is_set()==False将阻塞线程
event.set()： 设置event的状态值为True，所有阻塞池的线程激活进入就绪状态， 等待操作系统调度
event.clear()：恢复event的状态值为False
```

例如，有多个工作线程尝试链接MySQL，我们想要在链接前确保MySQL服务正常才让那些工作线程去连接MySQL服务器，如果连接不成功，都会去尝试重新连接。那么我们就可以采用threading.Event机制来协调各个工作线程的连接操作

```python
import random
import threading
import time
from threading import Thread, Event


def conn_mysql():
    count = 1
    while not event.is_set():
        if count > 10:
            return TimeoutError('超时连接')
        print('<%s>第%s次尝试连接' % (threading.current_thread().getName(), count))
        event.wait(0.5)
        count += 1

    print('<%s>连接成功' % threading.current_thread().getName())


def check_mysql():
    print('[%s]正在检查mysql' % threading.current_thread().getName())
    time.sleep(random.randint(2, 4))
    event.set()

if __name__ == '__main__':
    event = Event()
    event = Event()
    conn1 = Thread(target=conn_mysql)
    conn2 = Thread(target=conn_mysql)
    check = Thread(target=check_mysql)

    conn1.start()
    conn2.start()
    check.start()
```

### 定时器 Timer

定时器，指定n秒后执行某操作

```python
from threading import Timer

def hello():
    print('Hello World')

if __name__ == '__main__':
    t = Timer(3, hello)
    t.start()
```

