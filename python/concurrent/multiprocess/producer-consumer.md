# 生产者消费者模型

### 生产者消费者模型介绍

 **为什么要使用生产者消费者模型**

生产者指的是生产数据的任务，消费者指的是处理数据的任务，在并发编程中，如果生产者处理速度很快，而消费者处理速度很慢，那么生产者就必须等待消费者处理完，才能继续生产数据。同样的道理，如果消费者的处理能力大于生产者，那么消费者就必须等待生产者。为了解决这个问题于是引入了生产者和消费者模式。

 **什么是生产者和消费者模式**

生产者消费者模式是通过一个容器来解决生产者和消费者的强耦合问题。生产者和消费者彼此之间不直接通讯，而通过阻塞队列来进行通讯，所以生产者生产完数据之后不用等待消费者处理，直接扔给阻塞队列，消费者不找生产者要数据，而是直接从阻塞队列里取，阻塞队列就相当于一个缓冲区，平衡了生产者和消费者的处理能力。

这个阻塞队列就是用来给生产者和消费者解耦的

### 生产者消费者模型实现

```python
import time
import random
import os
from multiprocessing import Process, Queue

def producer(q):
    # 生产3个包子，但生产的时间不确定
    for i in range(3):
        ret = '进程%s包子%s' % (os.getpid(), i)
        time.sleep(random.randint(0, 3))
        print('生产: %s' % ret)

        q.put(ret)

def consumer(q):
    while True:
        ret = q.get()
        if ret is None:
            break
        time.sleep(1)
        print('进程%s消费：%s' % (os.getpid(), ret))

if __name__ == '__main__':
    # 容器
    q = Queue()

    # 生产者们
    p1 = Process(target=producer, args=(q, ))
    p2 = Process(target=producer, args=(q, ))
    p3 = Process(target=producer, args=(q, ))

    # 消费者们
    c1 = Process(target=consumer, args=(q, ))
    c2 = Process(target=consumer, args=(q, ))

    p1.start()
    p2.start()
    p3.start()

    c1.start()
    c2.start()

    p1.join()       # 保证producer执行生产完毕
    p2.join()       # 保证producer执行生产完毕
    p3.join()       # 保证producer执行生产完毕
    q.put(None)     # 生产者 2 个
    q.put(None)     # 生产者 2 个
    print('主...')
```

* 有几个消费者，就需要发送几个结束信号None
* JoinableQueue 提供了信号机制

### 生产者消费者模型总结

* 程序中有两类角色

```text
一类负责生产数据（生产者）
一类负责处理数据（消费者）
```

* 引入生产者消费者模型为了解决的问题

```text
平衡生产者与消费者之间的速度差
程序解开耦合
```

* 如何实现生产者消费者模型

```text
生产者 <---> 队列 <---> 消费者
```

* 示例是在单台主机上演示

```text
- 稳定性问题
- 效率性能问题
- RabbitMQ
```

