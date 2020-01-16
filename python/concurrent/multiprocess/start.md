# 子进程基本使用

Python中的多线程无法利用多核\(os.cpu\_count\(\)\)优势，而多进程是可以的

multiprocessing模块用来开启子进程，并在子进程中执行我们定制的任务（比如函数），该模块与多线程模块threading的编程接口类似。multiprocessing模块的功能众多：支持子进程、通信和共享数据、执行不同形式的同步，提供了Process、Queue、Pipe、Lock等组件。

需要再次强调的一点是：与线程不同，进程没有任何共享状态，进程修改的数据，改动仅限于该进程内。

```python
from multiprocessing import Process
import time
import os

def task(name):
    print('pid %s: %s is running, and its parent pid: %s ' % (os.getpid(), name, os.getppid()))
    time.sleep(3)
    print('%s is done' % name)

class MyProcess(Process):
    def __init__(self, name):
        super(MyProcess, self).__init__()
        self.name = name
    def run(self):
        print('pid %s: %s is running, and its parent pid: %s' % (os.getpid(), self.name, os.getppid()))
        time.sleep(2)
        print('%s is done' % self.name)

# Windows系统，置于if之下
if __name__ == '__main__':
    # 开启子进程是为了执行一个任务
    # 得到了一个对象 p
    p = Process(target=task, args=('子进程1', ))

    # 应用程序自己是开不了进程的，得给OS发信号，让OS来申请内存空间
    p.start()   # 运行时间和print差不多

    # 类继承的使用方式
    my_process = MyProcess('子进程2')
    my_process.start()

    print('主 pid: %s, and its parent pid: %s' % (os.getpid(), os.getppid()))
    # tasklist | findstr pycharm
```

* 子进程有自己独立的内存空间，相当于并发运行两个脚本
* 开启子进程两种方式，target=task，重写run方法
* p.start\(\)本质，向OS发信号
* 查看子进程的父进程，os.getpid\(\)
* 共享打印终端
* 僵尸进程和孤儿进程

