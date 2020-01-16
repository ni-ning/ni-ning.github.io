---
description: Non-blocking IO
---

# 非阻塞IO

Linux下，可以通过设置socket使其变为non-blocking，当对一个non-blocking socket执行读操作时，流程是这个样子：

![](http://book.luffycity.com/python-book/assets/chapter7/%E9%9D%9E%E9%98%BB%E5%A1%9EIO.png)

* 用户进程发出read操作时，如果内核中的数据还没有准备好，那么它并不会block用户进程，而是立刻返回一个error。从用户进程角度讲 ，它发起一个read操作后，并不需要等待，而是马上就得到了一个结果
* 用户进程判断结果是一个error时，它就知道数据还没有准备好，于是用户就可以在本次到下次再发起read询问的时间间隔内做其他事情，或者直接再次发送read操作
* 一旦内核中的数据准备好了，并且又再次收到了用户进程的system call，那么它马上就将数据拷贝到了用户内存\(这一阶段仍然是阻塞的\)，然后返回

```text
- 非阻塞的recvform系统调用调用之后，进程并没有被阻塞，内核马上返回给进程
- 如果数据还没准备好，此时会返回一个error
- 进程在返回之后，可以干点别的事情，然后再发起recvform系统调用。
- 重复上面的过程，循环往复的进行recvform系统调用
- 这个过程通常被称之为轮询。轮询检查内核数据，直到数据准备好，再拷贝数据到进程，
- 进行数据处理。需要注意，拷贝数据整个过程，进程仍然是属于阻塞的状态
```

**所以，在非阻塞式IO中，用户进程其实是需要不断的主动询问内核数据准备好了没有**

非阻塞IO示例

```python
# client.py
from socket import *
client = socket(AF_INET, SOCK_STREAM)
client.connect(('127.0.0.1', 8081))

while True:
    msg = input('msg>: ').strip()
    if not msg:
        continue
    client.send(msg.encode('utf-8'))
    data = client.recv(1024)
    print(data.decode('utf-8'))

# server.py
from socket import *
server = socket(AF_INET, SOCK_STREAM)
server.bind(('127.0.0.1', 8081))
server.listen(5)
server.setblocking(False)
print('start...')
rlist = []
wlist = []
while True:
    try:
        # Non-blocking IO accept没有client来连时，抛出信号异常BlockingIOError
        # 捕获之后 while 就会一直循环，负荷状态
        conn, address = server.accept()
        rlist.append(conn)
        print('rlist: %s' % rlist)
    except BlockingIOError:
        # 没有连接来，接住BlockingIOError，做其他事情：在conn基础上接收与发送数据

        # 收消息
        del_rlist = []
        for conn in rlist:
            try:
                data = conn.recv(1024)
                if not data:
                    del_rlist.append(conn)
                    continue
                # conn.send 也是IO操作，可优化
                # conn.send(data.upper())
                wlist.append((conn, data.upper()))
            except BlockingIOError:
                # 没有收到消息，跳过就行
                continue
            except Exception:
                conn.close()
                del_rlist.append(conn)
        for conn in del_rlist:
            rlist.remove(conn)

        # 发消息
        del_wlist = []
        for item in wlist:
            conn, data = item
            try:
                # 需求是发过一次就删除
                conn.send(data)
                del_wlist.append(item)
            except BlockingIOError:
                pass
        for item in del_wlist:
            wlist.remove(item)
```

**但是非阻塞IO模型绝不被推荐**

我们不能否定其优点：

```python
能够在等待任务完成的时间里干其他活了(包括提交其他任务，也就是 “后台” 可以有多个任务在“”同时“”执行)
```

但是也难掩其缺点：

```text
1. 循环调用recv()将大幅度推高CPU占用率；这也是我们在代码中留一句time.sleep(2)的原因,否则在低配主机下极容易出现卡机情况
2. 任务完成的响应延迟增大了，因为每过一段时间才去轮询一次read操作，而任务可能在两次轮询之间的任意时间完成
这会导致整体数据吞吐量的降低。
```

**此外，在这个方案中recv\(\)更多的是起到检测“操作是否完成”的作用，实际操作系统提供了更为高效的检测“操作是否完成“作用的接口，例如select\(\)多路复用模式，可以一次检测多个连接是否活跃**

