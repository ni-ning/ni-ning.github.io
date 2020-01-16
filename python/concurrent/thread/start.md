# 子线程基本使用

### 开启子线程方式

导引： 公司内分部门，可以把资源隔开，部门不能工作，而是由部门员工执行

```python
import time
import random
from threading import Thread, current_thread

def task(name):
    print('%s is running on %s' % (name, current_thread().getName()))
    time.sleep(random.randint(1, 3))
    print('%s is done' % name)

class MyThread(Thread):
    def __init__(self, name):
        super(MyThread, self).__init__()
        self.name = name

    def run(self):
        print('%s is running' % self.name)
        time.sleep(random.randint(1, 3))
        print('%s is done' % self.name)

if __name__ == '__main__':
    t1 = Thread(target=task, args=('Linda', ))
    t1.start()

    t2 = MyThread('Cathrine')
    t2.start()

    print('主...')
```

* args中数据传递会共享
* Lock解决数据共享错乱问题

### 子线程属性和方法

* from threading import Thread, current\_thread\(\), enumerate\(\)
* current\_thread\(\).getName\(\)
* t.getName\(\)
* t.setName\('线程1'\)
* t.isAlive\(\)
* t.deamon = True
* t.join\(\)

### 线程互斥锁

互斥锁原理：把并行变为串行，牺牲效率，保证数据安全，精髓在于把共享的部分数据加锁

```python
from threading import Thread, Lock

n = 100

def task():
    global n
    mutex.acquire()
    temp = n
    time.sleep(0.1)
    n = temp - 1
    mutex.release()

if __name__ == '__main__':
    thread_li = []
    mutex = Lock()
    for i in range(100):
        t = Thread(target=task)
        thread_li.append(t)
        t.start()

    for t in thread_li:
        t.join()
    print(n)
    print('主...')
```

