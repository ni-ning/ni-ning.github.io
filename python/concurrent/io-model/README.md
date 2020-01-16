# 并发编程之IO模型

为了更好地了解IO模型，我们需要事先回顾下：同步、异步、阻塞、非阻塞

**同步：**

就是在发出一个功能调用时，在没有得到结果之前，该调用就不会返回。按照这个定义，其实绝大多数函数都是同步调用。但是一般而言，我们在说同步、异步的时候，特指那些需要其他部件协作或者需要一定时间完成的任务

```python
# 发起同步调用后，就在原地等着任务结束，根本不考虑任务是在计算还是在io阻塞，总之就是一股脑地等任务结束
multiprocessing.Pool下的apply 
concurrent.futures.ProcessPoolExecutor().submit(func,).result()
concurrent.futures.ThreadPoolExecutor().submit(func,).result()
```

**异步：**

异步的概念和同步相对。当一个异步功能调用发出后，调用者不能立刻得到结果。当该异步功能完成后，通过状态、通知或回调来通知调用者。如果异步功能用状态来通知，那么调用者就需要每隔一定时间检查一次，效率就很低（有些初学多线程编程的人，总喜欢用一个循环去检查某个变量的值，这其实是一 种很严重的错误）。如果是使用通知的方式，效率则很高，因为异步功能几乎不需要做额外的操作。至于回调函数，其实和通知没太多区别

```python
# 发起异步调用后，并不会等待任务结束才返回，相反，会立即获取一个临时结果(并不是最终的结果，可能是封装好的一个对象)
multiprocessing.Pool().apply_async()
concurrent.futures.ProcessPoolExecutor(3).submit(func,)
concurrent.futures.ThreadPoolExecutor(3).submit(func,)
```

**阻塞：**

阻塞调用是指调用结果返回之前，当前线程会被挂起（如遇到io操作）。函数只有在得到结果之后才会将阻塞的线程激活。有人也许会把阻塞调用和同步调用等同起来，实际上他是不同的。对于同步调用来说，很多时候当前线程还是激活的，只是从逻辑上当前函数没有返回而已

* 同步调用：apply一个累计1亿次的任务，该调用会一直等待，直到任务返回结果为止，但并未阻塞住（即便是被抢走cpu的执行权限，那也是处于就绪态）
* 阻塞调用：当socket工作在阻塞模式的时候，如果没有数据的情况下调用recv函数，则当前线程就会被挂起，直到有数据为止

**非阻塞：**

非阻塞和阻塞的概念相对应，指在不能立刻得到结果之前也会立刻返回，同时该函数不会阻塞当前线程

**小结：**

* 同步与异步针对的是函数/任务的调用方式：同步就是当一个进程发起一个函数（任务）调用的时候，一直等到函数（任务）完成，而进程继续处于激活状态。而异步情况下是当一个进程发起一个函数（任务）调用的时候，不会等函数返回，而是继续往下执行当，函数返回的时候通过状态、通知、事件等方式通知进程任务完成。
* 阻塞与非阻塞针对的是进程或线程：阻塞是当请求不能满足的时候就将进程挂起，而非阻塞则不会阻塞当前进程

[原文参考链接](https://www.cnblogs.com/linhaifeng/articles/7430066.html#_label4)

### IO模型介绍

本文讨论的背景是Linux环境下的Network IO，参考文献&lt;&lt;UNIX网络编程 卷1 套接字联网API（第3版&gt;&gt;，可分为五种IO模型

* Blocking IO
* Non-blocking IO
* IO Multiplexing
* Signal Driven IO \(不常用\)
* Asynchronous IO

再说一下IO发生时涉及的对象和步骤，对于一个Network IO，以read为例，它会涉及到两个系统对象

* 一个是调用这个IO的process \(or thread\)
* 另一个就是系统内核\(kernel\)

操作发生时，经历两个阶段

* 等待数据准备 \(Waiting for the data to be ready\)
* 将数据从内核拷贝到进程中\(Copying the data from the kernel to the process\)

记住这两点很重要，因为这些IO模型的区别就是在两个阶段上各有不同的情况
