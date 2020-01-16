# 互斥锁

进程间不共享内存空间，但是会共享打印终端或文件系统，就会带来竞争与错乱

```python
import time
from multiprocessing import Process

# 并发运行,效率高,但竞争同一打印终端,带来了打印错乱
def task(name):
    print('%s 1' % name)
    time.sleep(1)
    print('%s 2' % name)
    time.sleep(1)
    print('%s 3' % name)


if __name__ == '__main__':
    for i in range(3):
        p = Process(target=task, args=('进程%s' % i, ))
        p.start()
```

如何控制 - 加锁处理

`互斥锁的意思就是互相排斥，如果把多个进程比喻为多个人，互斥锁的工作原理就是多个人都要去争抢同一个资源：卫生间，一个人抢到卫生间后上一把锁，其他人都要等着，等到这个完成任务后释放锁，其他人才有可能有一个抢到......`

所以互斥锁的原理，就是把并发改成串行，降低了效率，但保证了数据安全不错乱

```python
import time
from multiprocessing import Process, Lock

# 由并发变成了串行,牺牲了运行效率,但避免了竞争
def task(name, lock):
    lock.acquire()
    print('%s 1' % name)
    time.sleep(1)
    print('%s 2' % name)
    time.sleep(1)
    print('%s 3' % name)
    lock.release()

if __name__ == '__main__':
    mutex = Lock()  # 子进程会拷贝一份全新的mutex，而所有子进程需要同一把锁
    for i in range(3):
        p = Process(target=task, args=('进程%s' % i, mutex))
        p.start()
```

加锁可以保证多个进程修改同一块数据时，同一时间只能有一个任务可以进行修改，即串行地修改，没错，速度是慢了，但牺牲了速度却保证了数据安全

用文件共享数据**实现进程间通信**，但问题是：

* 效率低\(共享数据基于文件，而文件是硬盘上的数据\);
* 需要自己加锁处理

因此我们最好找寻一种解决方案能够兼顾：

* 效率高\(多个进程共享一块内存的数据\);
* 帮我们处理好锁问题

这就是mutiprocessing模块为我们提供的基于消息的IPC通信机制：队列和管道

队列和管道都是将数据存放于内存中，而队列又是基于（管道+锁）实现的，可以让我们从复杂的锁问题中解脱出来，因而**队列**才是进程间通信的最佳选择。

我们应该尽量避免使用共享数据，尽可能使用消息传递和队列，避免处理复杂的同步和锁问题，而且在进程数目增多时，往往可以获得更好的可获展性

