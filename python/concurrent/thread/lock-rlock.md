# 死锁现象与递归锁

### 一死锁现象

所谓死锁： 是指两个或两个以上的进程或线程在执行过程中，因争夺资源而造成的一种互相等待的现象，若无外力作用，它们都将无法推进下去。此时称系统处于死锁状态或系统产生了死锁，这些永远在互相等待的进程称为死锁进程，如下就是死锁

```python
from threading import Thread, Lock
import time

mutex_a = Lock()
mutex_b = Lock()

class MyThread(Thread):
    def __init__(self, name):
        super(MyThread, self).__init__()
        self.name = name

    def run(self):
        self.f1()
        self.f2()

    def f1(self):
        mutex_a.acquire()
        print('%s 拿到A锁' % self.name)

        mutex_b.acquire()
        print('%s 拿到B锁' % self.name)
        mutex_b.release()

        mutex_a.release()

    def f2(self):
        mutex_b.acquire()
        print('%s 拿到B锁' % self.name)
        time.sleep(2)

        mutex_a.acquire()
        print('%s 拿到A锁' % self.name)
        mutex_a.release()

        mutex_b.release()


if __name__ == '__main__':
    for i in range(10):
        t = MyThread('线程%s' % i)
        t.start()
```

### 递归锁

解决方法，递归锁，在Python中为了支持在同一线程中多次请求同一资源，python提供了可重入锁RLock。

这个RLock内部维护着一个Lock和一个counter变量，counter记录了acquire的次数，从而使得资源可以被多次require。直到一个线程所有的acquire都被release，其他的线程才能获得资源。上面的例子如果使用RLock代替Lock，则不会发生死锁，二者的区别是：递归锁可以连续acquire多次，而互斥锁只能acquire一次

```python
from threading import Thread, RLock
import time

# 一个线程拿到锁，counter加1,该线程内又碰到加锁的情况，则counter继续加1，这期间所有其他线程都只能等待，等待该线程释放所有锁，即counter递减到0为止
mutex_a = mutex_b = RLock()

class MyThread(Thread):
    def __init__(self, name):
        super(MyThread, self).__init__()
        self.name = name

    def run(self):
        self.f1()
        self.f2()

    def f1(self):
        mutex_a.acquire()
        print('%s 拿到A锁' % self.name)

        mutex_b.acquire()
        print('%s 拿到B锁' % self.name)
        mutex_b.release()

        mutex_a.release()

    def f2(self):
        mutex_b.acquire()
        print('%s 拿到B锁' % self.name)
        time.sleep(2)

        mutex_a.acquire()
        print('%s 拿到A锁' % self.name)
        mutex_a.release()

        mutex_b.release()


if __name__ == '__main__':
    for i in range(10):
        t = MyThread('线程%s' % i)
        t.start()
```

