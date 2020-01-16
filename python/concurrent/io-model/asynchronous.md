---
description: Asynchronous IO
---

# 异步IO

Linux下的asynchronous IO其实用得不多，从内核2.6版本才开始引入。先看一下它的流程：

![](http://book.luffycity.com/python-book/assets/chapter7/%E5%BC%82%E6%AD%A5IO.png)

* 用户进程发起read操作之后，立刻就可以开始去做其它的事
* 而另一方面，从kernel的角度，当它受到一个asynchronous read之后，首先它会立刻返回，所以不会对用户进程产生任何block
* 然后，kernel会等待数据准备完成，然后将数据拷贝到用户内存，当这一切都完成之后，kernel会给用户进程发送一个signal，告诉它read操作完成了

