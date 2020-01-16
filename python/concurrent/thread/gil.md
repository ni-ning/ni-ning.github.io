# GIL全局解释器锁

### GIL引子

```text
In CPython, the global interpreter lock, or GIL, is a mutex that prevents multiple 
native threads from executing Python bytecodes at once. This lock is necessary mainly 
because CPython’s memory management is not thread-safe. (However, since the GIL 
exists, other features have grown to depend on the guarantees that it enforces.)

结论： 在CPython解释器中，同一个进程下开启的多线程，同一时刻只能有一个线程执行，无法利用多核优势
```

需要明确的一点是GIL并不是Python的特性，它是在实现Python解析器\(CPython\)时所引入的一个概念。

好比C++是一套语言（语法）标准，但是可以用不同的编译器来编译成可执行代码，有名的编译器如GCC，INTEL C++，Visual C++等。Python也一样，同样一段代码可以通过CPython，PyPy，Psyco等不同的Python执行环境来执行。像其中的JPython就没有GIL。然而因为CPython是大部分环境下默认的Python执行环境。所以在很多人的概念里CPython就是Python，也就想当然的把GIL归结为Python语言的缺陷。所以这里要先明确一点：GIL并不是Python的特性，Python完全可以不依赖于GIL

### GIL介绍

GIL本质就是一把互斥锁，既然是互斥锁，所有互斥锁的本质都一样，都是将并发运行变成串行，以此来控制同一时间内共享数据只能被一个任务所修改，进而保证数据安全。

可以肯定的一点是：保护不同的数据的安全，就应该加不同的锁。

要想了解GIL，首先确定一点：每次执行python程序，都会产生一个独立的进程。例如python test.py，python aaa.py，python bbb.py会产生3个不同的python进程

 **验证python test.py只会产生一个进程**

```python
# test.py内容
import os,time
print(os.getpid())
time.sleep(1000)

#打开终端执行
python test.py

#在windows下查看
tasklist |findstr python

#在linux下下查看
ps aux |grep python
```

在一个python的进程内，不仅有test.py的主线程或者由该主线程开启的其他线程，还有解释器开启的垃圾回收等解释器级别的线程，总之，所有线程都运行在这一个进程内

```python
1. 所有数据都是共享的，其中，代码作为一种数据也是被所有线程共享的(test.py的所有代码以及Cpython解释器的所有代码)
2. 所有线程的任务，都需要将任务的代码当做参数传给解释器的代码去执行，即所有的线程要想运行自己的任务，首先需要解决的是能够访问到解释器的代码
```

综上：

如果多个线程的target=work，那么执行流程是：多个线程先访问到解释器的代码，即拿到执行权限，然后将target的代码交给解释器的代码去执行

解释器的代码是所有线程共享的，所以垃圾回收线程也可能访问到解释器的代码去执行，这就导致了一个问题:对于同一个数据100，可能线程1执行x=100的同时，而垃圾回收执行的是回收100的操作，解决这种问题没有什么高明的方法，就是加锁处理，如下图的GIL，保证python解释器同一时间只能执行一个任务的代码

![](../../../.gitbook/assets/gil.png)

### GIL与Lock

机智的同学可能会问到这个问题：Python已经有一个GIL来保证同一时间只能有一个线程来执行了，为什么这里还需要Lock?

* 锁的目的是为了保护共享的数据，同一时间只能有一个线程来修改共享的数据
* 保护不同的数据就应该加不同的锁

GIL 与Lock是两把锁，保护的数据不一样，前者是解释器级别的（当然保护的就是解释器级别的数据，比如垃圾回收的数据），后者是保护用户自己开发的应用程序的数据，很明显GIL不负责这件事，只能用户自定义加锁处理，即Lock，如下图

![](../../../.gitbook/assets/gil-gong-zuo-liu-cheng.png)

```text
100个线程去抢GIL锁，即抢执行权限
肯定有一个线程先抢到GIL（暂且称为线程1），然后开始执行，一旦执行就会拿到lock.acquire()
极有可能线程1还未运行完毕，就有另外一个线程2抢到GIL，然后开始运行，但线程2发现互斥锁lock还未被线程1释放，于是阻塞，被迫交出执行权限，即释放GIL
直到线程1重新抢到GIL，开始从上次暂停的位置继续执行，直到正常释放互斥锁lock，然后其他的线程再重复2 3 4的过程
```

```python
from threading import Thread, Lock
import time

def work():
    global n
    with lock:
        temp = n
        time.sleep(0.1)
        n = temp - 1

if __name__ == '__main__':
    lock = Lock()
    n = 100

    li = []
    for i in range(100):
        t = Thread(target=work)
        li.append(t)
        t.start()
    for t in li:
        t.join()

    print(n)    # 结果肯定为0，由原来的并发执行变成串行，牺牲了执行效率保证了数据安全，不加锁则结果可能为99
```

### GIL与多线程

有了GIL的存在，同一时刻同一进程中只有一个线程被执行

疑问：进程可以利用多核，但是开销大，而python的多线程开销小，但却无法利用多核优势

 **要解决这个问题，我们需要在几个点上达成一致：**

```text
cpu到底是用来做计算的，还是用来做I/O的?

1. 多cpu，意味着可以有多个核并行完成计算，所以多核提升的是计算性能
2. 每个cpu一旦遇到I/O阻塞，仍然需要等待，所以多核对I/O操作没什么用处
```

一个工人相当于cpu，此时计算相当于工人在干活，I/O阻塞相当于为工人干活提供所需原材料的过程，工人干活的过程中如果没有原材料了，则工人干活的过程需要停止，直到等待原材料的到来。

如果你的工厂干的大多数任务都要有准备原材料的过程（I/O密集型），那么你有再多的工人，意义也不大，还不如一个人，在等材料的过程中让工人去干别的活，

反过来讲，如果你的工厂原材料都齐全，那当然是工人越多，效率越高

```text
1.对计算来说，cpu越多越好，但是对于I/O来说，再多的cpu也没用
2. 当然对运行一个程序来说，随着cpu的增多执行效率肯定会有所提高(不管提高幅度多大，总会有所提高)，
这是因为一个程序基本上不会是纯计算或者纯I/O，所以我们只能相对的去看一个程序到底是计算密集型还是I/O密集型，
从而进一步分析python的多线程到底有无用武之地
```

**假设我们有四个任务需要处理，处理方式肯定是要玩出并发的效果，解决方案可以是：**

```text
方案一：开启四个进程
方案二：一个进程下，开启四个线程
```

**单核情况下，分析结果:**

```text
如果四个任务是计算密集型，没有多核来并行计算，方案一徒增了创建进程的开销，方案二胜
如果四个任务是I/O密集型，方案一创建进程的开销大，且进程的切换速度远不如线程，方案二胜
```

**多核情况下，分析结果：**

```text
如果四个任务是计算密集型，多核意味着并行计算，在python中一个进程中同一时刻只有一个线程执行用不上多核，方案一胜
如果四个任务是I/O密集型，再多的核也解决不了I/O问题，方案二胜
```

**结论：**

现在的计算机基本上都是多核，python对于计算密集型的任务开多线程的效率并不能带来多大性能上的提升，甚至不如串行\(没有大量切换\)，但是，对于IO密集型的任务效率还是有显著提升的

### 多线程性能测试

 **如果并发的多个任务是计算密集型：多进程效率高**

```python
from multiprocessing import Process
from threading import Thread
import time
import os

def work():
    res = 0
    for i in range(100000000):
        res *= i

if __name__ == '__main__':
    li = []
    print(os.cpu_count())   # 4核
    start = time.time()
    for i in range(4):
        p = Process(target=work)    # 耗时 4.45s
        p = Thread(target=work)     # 耗时 16.35s
        li.append(p)
        p.start()
    for p in li:
        p.join()
    stop = time.time()
    print('run time is %s' % (stop - start))
```

 **如果并发的多个任务是I/O密集型：多线程效率高**

```python
from multiprocessing import Process
from threading import Thread
import time
import os

def work():
    time.sleep(2)
    print('==>')

if __name__ == '__main__':
    li = []
    print(os.cpu_count())   # 4核
    start = time.time()
    for i in range(400):
        p = Process(target=work)    # 耗时 13.34s, 大部分时间耗费在创建进程上
        p = Thread(target=work)     # 耗时 2.04s
        li.append(p)
        p.start()
    for p in li:
        p.join()
    stop = time.time()
    print('run time is %s' % (stop - start))
```

 **应用：**

```text
多线程用于IO密集型，如socket，爬虫，web
多进程用于计算密集型，如金融分析
```

