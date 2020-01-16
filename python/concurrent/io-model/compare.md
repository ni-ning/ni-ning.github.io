# IO模型比较分析

**Blocking和Non-blocking的区别：**

调用Blocking IO会一直block住对应的进程直到操作完成，而Non-blocking IO在kernel还准备数据的情况下会立刻返回



![](http://book.luffycity.com/python-book/assets/chapter7/IO%E6%A8%A1%E5%9E%8B%E6%AF%94%E8%BE%83.png)

**Non-blocking和Asynchronous IO的区别：**

在Non-blocking IO中，虽然进程大部分时间都不会被block，但是它仍然要求进程去主动的check，并且当数据准备完成以后，也需要进程主动的再次调用recvfrom来将数据拷贝到用户内存。而Asynchronous IO则完全不同。它就像是用户进程将整个IO操作交给了他人（kernel）完成，然后他人做完后发信号通知。在此期间，用户进程不需要去检查IO操作的状态，也不需要主动的去拷贝数据

